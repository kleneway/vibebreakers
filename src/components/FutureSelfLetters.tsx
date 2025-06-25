"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./Button";
import { TimeFrameSelector } from "./TimeFrameSelector";
import { LetterComposer } from "./LetterComposer";
import { LetterExchange } from "./LetterExchange";
import { WisdomAnalyzer } from "./WisdomAnalyzer";
import {
  GameState,
  Player,
  TimeFrame,
  Letter,
  WisdomInsight,
} from "@/lib/types";
import { Clock, Users, Heart, Lightbulb } from "lucide-react";

interface FutureSelfLettersProps {
  onGameComplete?: (insights: WisdomInsight[]) => void;
  playerNames?: string[];
}

const TIME_FRAMES: TimeFrame[] = [
  {
    id: "6-months",
    label: "6 Months",
    value: "6 months",
    description: "Your near-future self, just around the corner",
  },
  {
    id: "2-years",
    label: "2 Years",
    value: "2 years",
    description: "Your evolving self, with new experiences",
  },
  {
    id: "5-years",
    label: "5 Years",
    value: "5 years",
    description: "Your transformed self, significantly different",
  },
  {
    id: "10-years",
    label: "10 Years",
    value: "10 years",
    description: "Your mature self, with accumulated wisdom",
  },
  {
    id: "25-years",
    label: "25 Years",
    value: "25 years",
    description: "Your elder self, with deep life perspective",
  },
];

export const FutureSelfLetters: React.FC<FutureSelfLettersProps> = ({
  onGameComplete,
  playerNames = ["Player 1", "Player 2", "Player 3", "Player 4"],
}) => {
  const [gameState, setGameState] = useState<GameState>({
    id: Math.random().toString(36).substr(2, 9),
    status: "setup",
    phase: "setup",
    currentStep: 1,
    totalSteps: 6,
    timeRemaining: 0,
    players: [],
    currentPlayerIndex: 0,
    story: [],
    roundNumber: 1,
    maxRounds: 1,
  });

  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [allLetters, setAllLetters] = useState<Letter[]>([]);
  const [exchangedLetters, setExchangedLetters] = useState<Letter[]>([]);
  const [wisdomInsights, setWisdomInsights] = useState<WisdomInsight[]>([]);

  // Initialize players with random time frames
  useEffect(() => {
    const initializedPlayers: Player[] = playerNames.map((name, index) => {
      // Each player gets 2 random time frames
      const shuffledTimeFrames = [...TIME_FRAMES].sort(
        () => Math.random() - 0.5,
      );
      const assignedTimeFrames = shuffledTimeFrames.slice(0, 2);

      return {
        id: `player-${index}`,
        name,
        isActive: true,
        score: 0,
        assignedTimeFrames,
        writtenLetters: [],
        receivedLetters: [],
      };
    });

    setPlayers(initializedPlayers);
    setCurrentPlayer(initializedPlayers[0]);
  }, [playerNames]);

  const startGame = () => {
    setGameState((prev) => ({
      ...prev,
      phase: "timeframe-selection",
      currentStep: 1,
      totalSteps: 6,
      timeRemaining: 30,
    }));
  };

  const proceedToLetterWriting = () => {
    setGameState((prev) => ({
      ...prev,
      phase: "letter-writing",
      currentStep: 2,
      totalSteps: 6,
      timeRemaining: 240, // 4 minutes per letter
    }));
  };

  const handleLetterComplete = (letter: Letter) => {
    if (!currentPlayer) return;

    const updatedLetters = [...allLetters, letter];
    setAllLetters(updatedLetters);

    // Update current player's written letters
    const updatedPlayers = players.map((player) =>
      player.id === currentPlayer.id
        ? {
            ...player,
            writtenLetters: [...(player.writtenLetters || []), letter],
          }
        : player,
    );
    setPlayers(updatedPlayers);

    // Check if current player has written all their letters
    const updatedCurrentPlayer = updatedPlayers.find(
      (p) => p.id === currentPlayer.id,
    );
    if (
      updatedCurrentPlayer &&
      (updatedCurrentPlayer.writtenLetters || []).length >=
        (updatedCurrentPlayer.assignedTimeFrames || []).length
    ) {
      // Move to next player or next phase
      const currentPlayerIndex = players.findIndex(
        (p) => p.id === currentPlayer.id,
      );
      const nextPlayerIndex = currentPlayerIndex + 1;

      if (nextPlayerIndex < players.length) {
        setCurrentPlayer(players[nextPlayerIndex]);
        setGameState((prev) => ({ ...prev, timeRemaining: 240 }));
      } else {
        proceedToExchange();
      }
    }
  };

  const proceedToExchange = () => {
    // Randomly shuffle and redistribute letters
    const shuffledLetters = [...allLetters].sort(() => Math.random() - 0.5);
    const lettersPerPlayer = Math.floor(
      shuffledLetters.length / players.length,
    );

    const updatedPlayers = players.map((player, index) => {
      const startIndex = index * lettersPerPlayer;
      const endIndex = startIndex + lettersPerPlayer;
      const receivedLetters = shuffledLetters.slice(startIndex, endIndex);

      return {
        ...player,
        receivedLetters,
      };
    });

    setPlayers(updatedPlayers);
    setExchangedLetters(shuffledLetters);

    setGameState((prev) => ({
      ...prev,
      phase: "letter-exchange",
      currentStep: 3,
      totalSteps: 6,
      timeRemaining: 60,
    }));
  };

  const proceedToReading = () => {
    setGameState((prev) => ({
      ...prev,
      phase: "reading",
      currentStep: 4,
      totalSteps: 6,
      timeRemaining: 180, // 3 minutes
    }));
  };

  const proceedToSharing = () => {
    setGameState((prev) => ({
      ...prev,
      phase: "sharing",
      currentStep: 5,
      totalSteps: 6,
      timeRemaining: 300, // 5 minutes
    }));
  };

  const proceedToAnalysis = () => {
    setGameState((prev) => ({
      ...prev,
      phase: "complete",
      currentStep: 6,
      totalSteps: 6,
      timeRemaining: 0,
    }));
  };

  const handleWisdomAnalysisComplete = (insights: WisdomInsight[]) => {
    setWisdomInsights(insights);
    onGameComplete?.(insights);
  };

  const renderPhaseIcon = () => {
    switch (gameState.phase) {
      case "setup":
      case "timeframe-selection":
        return <Clock className="w-6 h-6" />;
      case "letter-writing":
        return <Heart className="w-6 h-6" />;
      case "letter-exchange":
      case "reading":
        return <Users className="w-6 h-6" />;
      case "sharing":
      case "complete":
        return <Lightbulb className="w-6 h-6" />;
      default:
        return <Clock className="w-6 h-6" />;
    }
  };

  const getPhaseTitle = () => {
    switch (gameState.phase) {
      case "setup":
        return "Welcome to Future Self Letters";
      case "timeframe-selection":
        return "Your Time Horizons";
      case "letter-writing":
        return "Writing to Your Future Self";
      case "letter-exchange":
        return "Anonymous Letter Exchange";
      case "reading":
        return "Reading Letters from Others";
      case "sharing":
        return "Sharing Wisdom";
      case "complete":
        return "Collective Insights";
      default:
        return "Future Self Letters";
    }
  };

  const getPhaseDescription = () => {
    switch (gameState.phase) {
      case "setup":
        return "Write letters to your future self, then exchange them anonymously with others for mutual inspiration and wisdom.";
      case "timeframe-selection":
        return "You've been assigned time horizons to write to. Each represents a different stage of your future journey.";
      case "letter-writing":
        return currentPlayer
          ? `${currentPlayer.name}, write heartfelt letters to your future self using the guided prompts.`
          : "Write your letters";
      case "letter-exchange":
        return "Letters are being shuffled anonymously. You'll receive letters that others wrote to their future selves.";
      case "reading":
        return "Read the letters you received silently. Look for advice that resonates with your own journey.";
      case "sharing":
        return "Share the most meaningful advice you received (without revealing who wrote it).";
      case "complete":
        return "Discover the collective wisdom and common themes from everyone's letters.";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center mb-4">
            <motion.div
              className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg mr-4"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {renderPhaseIcon()}
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
              {getPhaseTitle()}
            </h1>
          </div>

          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-4">
            {getPhaseDescription()}
          </p>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{
                width: `${
                  ((gameState.currentStep || 0) / (gameState.totalSteps || 1)) *
                  100
                }%`,
              }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            Step {gameState.currentStep} of {gameState.totalSteps}
            {(gameState.timeRemaining || 0) > 0 && (
              <span className="ml-4">
                Time: {Math.floor((gameState.timeRemaining || 0) / 60)}:
                {String((gameState.timeRemaining || 0) % 60).padStart(2, "0")}
              </span>
            )}
          </div>
        </motion.div>

        {/* Game Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={gameState.phase}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8"
          >
            {gameState.phase === "setup" && (
              <div className="text-center">
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
                    How to Play
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6 text-left">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                        1. Write Letters
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        Write 2 letters to your future self at different time
                        horizons using guided prompts.
                      </p>
                    </div>
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">
                        2. Anonymous Exchange
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        Letters are shuffled and redistributed anonymously to
                        other participants.
                      </p>
                    </div>
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                        3. Read & Reflect
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        Read letters from others and identify advice that
                        resonates with your journey.
                      </p>
                    </div>
                    <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">
                        4. Share Wisdom
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        Share meaningful insights without revealing who wrote
                        them.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
                    Players ({players.length})
                  </h3>
                  <div className="flex flex-wrap justify-center gap-2">
                    {players.map((player) => (
                      <span
                        key={player.id}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                      >
                        {player.name}
                      </span>
                    ))}
                  </div>
                </div>

                <Button onClick={startGame} size="lg">
                  Begin Letter Writing Journey
                </Button>
              </div>
            )}

            {gameState.phase === "timeframe-selection" && currentPlayer && (
              <TimeFrameSelector
                player={currentPlayer}
                onContinue={proceedToLetterWriting}
              />
            )}

            {gameState.phase === "letter-writing" && currentPlayer && (
              <LetterComposer
                player={currentPlayer}
                timeFrames={currentPlayer.assignedTimeFrames || []}
                onLetterComplete={handleLetterComplete}
                timeRemaining={gameState.timeRemaining || 0}
              />
            )}

            {gameState.phase === "letter-exchange" && (
              <LetterExchange
                letters={allLetters}
                players={players}
                onContinue={proceedToReading}
              />
            )}

            {gameState.phase === "reading" && currentPlayer && (
              <div className="text-center">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
                  Reading Your Received Letters
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                  Take time to read through the letters you received. Look for
                  advice that speaks to you.
                </p>

                <div className="space-y-6 mb-8">
                  {(currentPlayer.receivedLetters || []).map(
                    (letter, index) => (
                      <motion.div
                        key={letter.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2 }}
                        className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-xl border border-gray-200 dark:border-gray-600"
                      >
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                          Letter to {letter.timeFrame.label} Future Self
                        </div>
                        <div className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                          {letter.content}
                        </div>
                      </motion.div>
                    ),
                  )}
                </div>

                <Button onClick={proceedToSharing} size="lg">
                  Continue to Sharing
                </Button>
              </div>
            )}

            {gameState.phase === "sharing" && (
              <div className="text-center">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
                  Share Your Insights
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                  This is where players would share the most meaningful advice
                  they received, without revealing who wrote it. In a real
                  implementation, this would be an interactive discussion
                  interface.
                </p>

                <Button onClick={proceedToAnalysis} size="lg">
                  View Collective Wisdom
                </Button>
              </div>
            )}

            {gameState.phase === "complete" && (
              <WisdomAnalyzer
                letters={allLetters}
                onAnalysisComplete={handleWisdomAnalysisComplete}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
