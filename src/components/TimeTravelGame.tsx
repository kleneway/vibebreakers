"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EraSelector } from "./EraSelector";
import { DilemmaGenerator } from "./DilemmaGenerator";
import { ConsequenceTracker } from "./ConsequenceTracker";
import { TemporalReport } from "./TemporalReport";
import { Button } from "./Button";

export interface Era {
  id: string;
  name: string;
  year: string;
  description: string;
  theme: string;
  completed: boolean;
}

export interface Choice {
  id: string;
  text: string;
  consequences: string[];
  benefitsNextEra: boolean;
  blocksOptions: string[];
  unlockOptions: string[];
}

export interface Decision {
  eraId: string;
  choice: Choice;
  timestamp: Date;
}

export interface GameState {
  currentEraIndex: number;
  decisions: Decision[];
  availableOptions: string[];
  blockedOptions: string[];
  gamePhase: "setup" | "playing" | "consequences" | "analysis" | "completed";
  timer: number;
}

const ERAS: Era[] = [
  {
    id: "ancient_rome",
    name: "Ancient Rome",
    year: "44 BCE",
    description: "The assassination of Julius Caesar has left Rome in chaos",
    theme: "power-struggle",
    completed: false,
  },
  {
    id: "medieval_england",
    name: "Medieval England",
    year: "1347",
    description: "The Black Plague devastates Europe",
    theme: "survival",
    completed: false,
  },
  {
    id: "renaissance_italy",
    name: "Renaissance Italy",
    year: "1503",
    description: "Art and science flourish in Leonardo da Vinci's time",
    theme: "innovation",
    completed: false,
  },
  {
    id: "industrial_revolution",
    name: "Industrial London",
    year: "1888",
    description: "Steam power transforms society but creates new problems",
    theme: "progress",
    completed: false,
  },
  {
    id: "current_day",
    name: "Present Day",
    year: "2024",
    description: "Digital age decisions with global consequences",
    theme: "connectivity",
    completed: false,
  },
  {
    id: "climate_crisis",
    name: "Climate Crisis Era",
    year: "2050",
    description: "Humanity adapts to environmental changes",
    theme: "adaptation",
    completed: false,
  },
];

export const TimeTravelGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    currentEraIndex: 0,
    decisions: [],
    availableOptions: [],
    blockedOptions: [],
    gamePhase: "setup",
    timer: 30,
  });

  const [selectedEras, setSelectedEras] = useState<Era[]>([]);
  const [showConsequences, setShowConsequences] = useState(false);

  // Initialize game with random era selection
  useEffect(() => {
    const shuffledEras = [...ERAS].sort(() => Math.random() - 0.5);
    const selectedErasForGame = shuffledEras.slice(0, 4);
    setSelectedEras(selectedErasForGame);
  }, []);

  // Timer management
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (gameState.gamePhase === "playing" && gameState.timer > 0) {
      interval = setInterval(() => {
        setGameState((prev: GameState) => ({
          ...prev,
          timer: prev.timer - 1,
        }));
      }, 1000);
    } else if (gameState.gamePhase === "playing" && gameState.timer === 0) {
      // Auto-advance when time runs out
      handleTimeUp();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameState.gamePhase, gameState.timer]);

  const startGame = () => {
    setGameState((prev: GameState) => ({
      ...prev,
      gamePhase: "playing",
      timer: 90,
    }));
  };

  const handleChoice = (choice: Choice) => {
    const currentEra = selectedEras[gameState.currentEraIndex];
    const newDecision: Decision = {
      eraId: currentEra.id,
      choice,
      timestamp: new Date(),
    };

    setGameState((prev: GameState) => ({
      ...prev,
      decisions: [...prev.decisions, newDecision],
      gamePhase: "consequences",
      timer: 45,
      availableOptions: [...prev.availableOptions, ...choice.unlockOptions],
      blockedOptions: [...prev.blockedOptions, ...choice.blocksOptions],
    }));

    setShowConsequences(true);
  };

  const handleTimeUp = () => {
    if (gameState.gamePhase === "playing") {
      // Force a neutral choice when time runs out
      const neutralChoice: Choice = {
        id: "timeout",
        text: "Time ran out - took no decisive action",
        consequences: ["Opportunity missed due to hesitation"],
        benefitsNextEra: false,
        blocksOptions: ["decisive_action"],
        unlockOptions: [],
      };
      handleChoice(neutralChoice);
    } else {
      proceedToNextEra();
    }
  };

  const proceedToNextEra = () => {
    setShowConsequences(false);

    if (gameState.currentEraIndex < selectedEras.length - 1) {
      setGameState((prev: GameState) => ({
        ...prev,
        currentEraIndex: prev.currentEraIndex + 1,
        gamePhase: "playing",
        timer: 90,
      }));
    } else {
      setGameState((prev: GameState) => ({
        ...prev,
        gamePhase: "analysis",
        timer: 180,
      }));
    }
  };

  const completeGame = () => {
    setGameState((prev: GameState) => ({
      ...prev,
      gamePhase: "completed",
      timer: 0,
    }));
  };

  const resetGame = () => {
    const shuffledEras = [...ERAS].sort(() => Math.random() - 0.5);
    const selectedErasForGame = shuffledEras.slice(0, 4);
    setSelectedEras(selectedErasForGame);

    setGameState({
      currentEraIndex: 0,
      decisions: [],
      availableOptions: [],
      blockedOptions: [],
      gamePhase: "setup",
      timer: 30,
    });

    setShowConsequences(false);
  };

  const currentEra = selectedEras[gameState.currentEraIndex];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Time Traveler's Dilemma
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Navigate through history, making decisions that echo through time
        </p>
      </div>

      {/* Timer Display */}
      {gameState.gamePhase !== "setup" &&
        gameState.gamePhase !== "completed" && (
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg text-center"
            animate={{ scale: gameState.timer <= 10 ? [1, 1.05, 1] : 1 }}
            transition={{
              repeat: gameState.timer <= 10 ? Infinity : 0,
              duration: 0.5,
            }}
          >
            <div className="text-2xl font-bold">
              {Math.floor(gameState.timer / 60)}:
              {(gameState.timer % 60).toString().padStart(2, "0")}
            </div>
            <div className="text-sm opacity-90">
              {gameState.gamePhase === "playing" && "Time to decide"}
              {gameState.gamePhase === "consequences" &&
                "Processing consequences"}
              {gameState.gamePhase === "analysis" && "Analyzing your journey"}
            </div>
          </motion.div>
        )}

      <AnimatePresence mode="wait">
        {gameState.gamePhase === "setup" && (
          <motion.div
            key="setup"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center space-y-6"
          >
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                Your Time Travel Mission
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                You'll visit {selectedEras.length} different time periods. Your
                choices in each era will affect the options available to you in
                future periods. Choose wisely - history is watching!
              </p>

              <EraSelector eras={selectedEras} currentIndex={-1} />

              <Button onClick={startGame} size="lg" className="mt-6">
                Begin Your Journey Through Time
              </Button>
            </div>
          </motion.div>
        )}

        {gameState.gamePhase === "playing" && currentEra && (
          <motion.div
            key={`playing-${gameState.currentEraIndex}`}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
          >
            <EraSelector
              eras={selectedEras}
              currentIndex={gameState.currentEraIndex}
            />

            <DilemmaGenerator
              era={currentEra}
              onChoice={handleChoice}
              availableOptions={gameState.availableOptions}
              blockedOptions={gameState.blockedOptions}
              previousDecisions={gameState.decisions}
            />
          </motion.div>
        )}

        {gameState.gamePhase === "consequences" && showConsequences && (
          <motion.div
            key="consequences"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <ConsequenceTracker
              decision={gameState.decisions[gameState.decisions.length - 1]}
              onContinue={proceedToNextEra}
              isLastEra={gameState.currentEraIndex >= selectedEras.length - 1}
            />
          </motion.div>
        )}

        {gameState.gamePhase === "analysis" && (
          <motion.div
            key="analysis"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <TemporalReport
              decisions={gameState.decisions}
              eras={selectedEras}
              onComplete={completeGame}
            />
          </motion.div>
        )}

        {gameState.gamePhase === "completed" && (
          <motion.div
            key="completed"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-8 rounded-lg">
              <h2 className="text-3xl font-bold mb-4">Journey Complete!</h2>
              <p className="text-lg opacity-90">
                You've experienced the weight of decisions across time. Your
                choices have shaped history - and revealed your character.
              </p>
            </div>

            <div className="flex gap-4 justify-center">
              <Button onClick={resetGame} variant="primary">
                Travel Through Time Again
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
