"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "./Button";
import { PlaceMapper } from "./PlaceMapper";
import { StoryAnchor } from "./StoryAnchor";
import { GuidedTour } from "./GuidedTour";
import { EmotionalCartographer } from "./EmotionalCartographer";
import { Timer } from "./Timer";
import { MemoryPalaceGameState, MemoryPalace, Player } from "@/lib/types";
import { Clock, Users, MapPin, Heart, Brain, ArrowRight } from "lucide-react";

interface MemoryPalaceExchangeProps {
  players: Player[];
  onGameComplete?: (insights: string[]) => void;
}

const PHASE_DURATIONS = {
  construction: 4 * 60, // 4 minutes
  pairing: 2 * 60, // 2 minutes
  exchange: 5 * 60, // 5 minutes per person
  exploration: 3 * 60, // 3 minutes
  reflection: 2 * 60, // 2 minutes
};

const PHASE_DESCRIPTIONS = {
  construction:
    "Create your memory palace by selecting a meaningful place and mapping its locations",
  pairing: "Connect memories and emotions to each location in your palace",
  exchange: "Guide others through your memory palace, sharing your stories",
  exploration:
    "Ask thoughtful questions and explore the emotional significance of each palace",
  reflection:
    "Reflect on connections and insights gained from all the palaces shared",
};

export const MemoryPalaceExchange: React.FC<MemoryPalaceExchangeProps> = ({
  players,
  onGameComplete,
}) => {
  const [gameState, setGameState] = useState<MemoryPalaceGameState>({
    phase: "construction",
    timeRemaining: PHASE_DURATIONS.construction,
    currentPlayer: 0,
    palaces: [],
    currentPalaceIndex: 0,
    currentLocationIndex: 0,
    insights: [],
    connections: [],
  });

  const [isGameActive, setIsGameActive] = useState(false);

  // Timer management
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isGameActive && gameState.timeRemaining > 0) {
      interval = setInterval(() => {
        setGameState((prev) => ({
          ...prev,
          timeRemaining: prev.timeRemaining - 1,
        }));
      }, 1000);
    } else if (gameState.timeRemaining === 0) {
      handlePhaseComplete();
    }

    return () => clearInterval(interval);
  }, [isGameActive, gameState.timeRemaining]);

  const handlePhaseComplete = useCallback(() => {
    setGameState((prev) => {
      switch (prev.phase) {
        case "construction":
          return {
            ...prev,
            phase: "pairing",
            timeRemaining: PHASE_DURATIONS.pairing,
          };
        case "pairing":
          return {
            ...prev,
            phase: "exchange",
            timeRemaining: PHASE_DURATIONS.exchange,
            currentPlayer: 0,
          };
        case "exchange":
          const nextPlayer = prev.currentPlayer + 1;
          if (nextPlayer >= players.length) {
            return {
              ...prev,
              phase: "exploration",
              timeRemaining: PHASE_DURATIONS.exploration,
              currentPlayer: 0,
            };
          }
          return {
            ...prev,
            currentPlayer: nextPlayer,
            timeRemaining: PHASE_DURATIONS.exchange,
          };
        case "exploration":
          return {
            ...prev,
            phase: "reflection",
            timeRemaining: PHASE_DURATIONS.reflection,
          };
        case "reflection":
          setIsGameActive(false);
          onGameComplete?.(prev.insights);
          return prev;
        default:
          return prev;
      }
    });
  }, [players.length, onGameComplete]);

  const handlePalaceUpdate = (palace: MemoryPalace) => {
    setGameState((prev) => {
      const existingIndex = prev.palaces.findIndex((p) => p.id === palace.id);
      const updatedPalaces =
        existingIndex >= 0
          ? prev.palaces.map((p, i) => (i === existingIndex ? palace : p))
          : [...prev.palaces, palace];

      return {
        ...prev,
        palaces: updatedPalaces,
      };
    });
  };

  const handleInsightAdd = (insight: string) => {
    setGameState((prev) => ({
      ...prev,
      insights: [...prev.insights, insight],
    }));
  };

  const handleConnectionAdd = (
    playerId1: string,
    playerId2: string,
    connection: string,
  ) => {
    setGameState((prev) => ({
      ...prev,
      connections: [...prev.connections, { playerId1, playerId2, connection }],
    }));
  };

  const startGame = () => {
    setIsGameActive(true);
  };

  const pauseGame = () => {
    setIsGameActive(false);
  };

  const resumeGame = () => {
    setIsGameActive(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case "construction":
        return <MapPin className="w-5 h-5" />;
      case "pairing":
        return <Heart className="w-5 h-5" />;
      case "exchange":
        return <Users className="w-5 h-5" />;
      case "exploration":
        return <Brain className="w-5 h-5" />;
      case "reflection":
        return <Clock className="w-5 h-5" />;
      default:
        return <MapPin className="w-5 h-5" />;
    }
  };

  const renderPhaseContent = () => {
    switch (gameState.phase) {
      case "construction":
        return (
          <PlaceMapper
            players={players}
            onPalaceUpdate={handlePalaceUpdate}
            existingPalaces={gameState.palaces}
          />
        );
      case "pairing":
        return (
          <StoryAnchor
            palaces={gameState.palaces}
            onPalaceUpdate={handlePalaceUpdate}
          />
        );
      case "exchange":
        return (
          <GuidedTour
            currentPalace={gameState.palaces[gameState.currentPalaceIndex]}
            currentPlayer={players[gameState.currentPlayer]}
            onLocationChange={(index) =>
              setGameState((prev) => ({ ...prev, currentLocationIndex: index }))
            }
            onInsightAdd={handleInsightAdd}
          />
        );
      case "exploration":
        return (
          <EmotionalCartographer
            palaces={gameState.palaces}
            insights={gameState.insights}
            onConnectionAdd={handleConnectionAdd}
            onInsightAdd={handleInsightAdd}
          />
        );
      case "reflection":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-4">
                Reflection & Integration
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                Take a moment to reflect on the journey through these memory
                palaces and the connections you've discovered.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
                <h4 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-4 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-blue-500" />
                  Key Insights
                </h4>
                <div className="space-y-2">
                  {gameState.insights.map((insight, index) => (
                    <div
                      key={index}
                      className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md"
                    >
                      <p className="text-sm text-neutral-700 dark:text-neutral-300">
                        {insight}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
                <h4 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-4 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  Connections Made
                </h4>
                <div className="space-y-2">
                  {gameState.connections.map((connection, index) => (
                    <div
                      key={index}
                      className="p-3 bg-red-50 dark:bg-red-900/20 rounded-md"
                    >
                      <p className="text-sm text-neutral-700 dark:text-neutral-300">
                        {connection.connection}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Game Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">
          Memory Palace Exchange
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
          Create detailed mental maps of meaningful places, then guide others
          through these spaces while sharing the stories and emotions connected
          to each location.
        </p>
      </div>

      {/* Game Controls */}
      <div className="flex justify-center mb-6">
        {!isGameActive && gameState.phase === "construction" ? (
          <Button onClick={startGame} variant="primary" size="lg">
            Start Memory Palace Journey
          </Button>
        ) : (
          <div className="flex gap-4">
            <Button onClick={pauseGame} variant="secondary">
              Pause
            </Button>
            <Button onClick={resumeGame} variant="primary">
              Resume
            </Button>
          </div>
        )}
      </div>

      {/* Phase Indicator */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 mb-6 border border-neutral-200 dark:border-neutral-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {getPhaseIcon(gameState.phase)}
            <div>
              <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200 capitalize">
                {gameState.phase} Phase
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {PHASE_DESCRIPTIONS[gameState.phase]}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-mono font-bold text-blue-600 dark:text-blue-400">
              {formatTime(gameState.timeRemaining)}
            </div>
            <div className="text-sm text-neutral-500">
              {gameState.phase === "exchange" &&
                `Player ${gameState.currentPlayer + 1} of ${players.length}`}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
            style={{
              width: `${
                (1 -
                  gameState.timeRemaining / PHASE_DURATIONS[gameState.phase]) *
                100
              }%`,
            }}
          />
        </div>
      </div>

      {/* Player Indicators */}
      {gameState.phase === "exchange" && (
        <div className="flex justify-center mb-6">
          <div className="flex gap-2">
            {players.map((player, index) => (
              <div
                key={player.id}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  index === gameState.currentPlayer
                    ? "bg-blue-500 text-white"
                    : index < gameState.currentPlayer
                    ? "bg-green-500 text-white"
                    : "bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400"
                }`}
              >
                {player.name}
                {index === gameState.currentPlayer && (
                  <ArrowRight className="w-4 h-4 inline ml-1" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Game Content */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
        {renderPhaseContent()}
      </div>
    </div>
  );
};
