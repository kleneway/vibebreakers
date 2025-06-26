"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  QuestionLadderGameState,
  QuestionDepthLevel,
  QuestionRound,
  QuestionQuality,
} from "@/lib/types";
import { Button } from "./Button";
import { DepthMeter } from "./DepthMeter";
import { ResponseTimer } from "./ResponseTimer";
import {
  QuestionQualityAnalyzer,
  analyzeQuestionQuality,
} from "./QuestionQualityAnalyzer";
import { InsightTracker, detectInsight } from "./InsightTracker";
import { cn } from "@/lib/utils";
import { Play, Pause, RotateCcw, Users } from "lucide-react";

interface QuestionLadderProps {
  playerNames: string[];
  onGameComplete?: (gameData: QuestionLadderGameState) => void;
}

const DEPTH_LEVELS: QuestionDepthLevel[] = [
  {
    level: 1,
    name: "Surface Level",
    description: "Facts, preferences, and basic information",
    keywords: ["what", "which", "who", "when", "where", "favorite"],
    color: "#10B981", // green
  },
  {
    level: 2,
    name: "Experience Level",
    description: "Stories, experiences, and memories",
    keywords: ["how", "tell me about", "describe", "experience"],
    color: "#3B82F6", // blue
  },
  {
    level: 3,
    name: "Values Level",
    description: "Beliefs, values, and motivations",
    keywords: ["why", "believe", "value", "important", "meaning"],
    color: "#8B5CF6", // purple
  },
  {
    level: 4,
    name: "Vulnerability Level",
    description: "Fears, struggles, and challenges",
    keywords: ["feel", "fear", "worry", "struggle", "challenge", "vulnerable"],
    color: "#F59E0B", // orange
  },
  {
    level: 5,
    name: "Identity Level",
    description: "Core identity, purpose, and meaning",
    keywords: ["identity", "purpose", "life", "meaning", "legacy", "remember"],
    color: "#EF4444", // red
  },
];

const STARTER_QUESTIONS = [
  "What's something you've learned about yourself recently?",
  "What's a small thing that always makes you smile?",
  "What's one thing you're curious about right now?",
];

export const QuestionLadder: React.FC<QuestionLadderProps> = ({
  playerNames,
  onGameComplete,
}: QuestionLadderProps) => {
  const [gameState, setGameState] = useState<QuestionLadderGameState>({
    players: playerNames.map((name, index) => ({
      id: index.toString(),
      name,
      score: 0,
      isActive: index === 0,
      answers: [],
    })),
    currentRound: 0,
    activePlayerIndex: 0,
    currentDepthLevel: 1,
    rounds: [],
    gamePhase: "setup",
    timeRemaining: 90,
    insights: [],
  });

  const [currentAnswer, setCurrentAnswer] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [phase, setPhase] = useState<"answer" | "question">("answer");
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [questionQuality, setQuestionQuality] =
    useState<QuestionQuality | null>(null);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && gameState.timeRemaining > 0) {
      interval = setInterval(() => {
        setGameState((prev) => ({
          ...prev,
          timeRemaining: prev.timeRemaining - 1,
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, gameState.timeRemaining]);

  const handleTimeUp = useCallback(() => {
    setIsTimerRunning(false);
    if (phase === "answer") {
      // Move to question phase
      setPhase("question");
      setGameState((prev) => ({ ...prev, timeRemaining: 30 }));
      setIsTimerRunning(true);
    } else {
      // Move to next player
      handleNextPlayer();
    }
  }, [phase]);

  const startGame = () => {
    setGameState((prev) => ({
      ...prev,
      gamePhase: "playing",
      timeRemaining: 60,
    }));
    setPhase("answer");
    setCurrentQuestion(
      STARTER_QUESTIONS[Math.floor(Math.random() * STARTER_QUESTIONS.length)],
    );
    setIsTimerRunning(true);
  };

  const handleAnswerSubmit = () => {
    if (!currentAnswer.trim()) return;

    // Analyze question quality if moving to question phase
    if (phase === "answer") {
      setPhase("question");
      setGameState((prev) => ({ ...prev, timeRemaining: 30 }));
    }
  };

  const handleQuestionSubmit = () => {
    if (!currentQuestion.trim()) return;

    const activePlayer = gameState.players[gameState.activePlayerIndex];
    const previousAnswer =
      gameState.rounds[gameState.rounds.length - 1]?.answer || "";

    // Analyze question quality
    const quality = analyzeQuestionQuality(currentQuestion, previousAnswer);
    setQuestionQuality(quality);

    // Determine depth level based on question
    const newDepthLevel = Math.max(
      gameState.currentDepthLevel,
      Math.ceil(quality.depthScore / 2),
    );

    // Create new round
    const newRound: QuestionRound = {
      id: Math.random().toString(36).substr(2, 9),
      playerId: activePlayer.id,
      question: currentQuestion,
      answer: currentAnswer,
      depthLevel: newDepthLevel,
      timestamp: new Date(),
      qualityScore: quality.totalScore,
    };

    // Detect insights
    const insight = detectInsight(
      currentAnswer,
      currentQuestion,
      activePlayer.name,
      gameState.rounds,
    );

    // Update game state
    setGameState((prev) => ({
      ...prev,
      rounds: [...prev.rounds, newRound],
      currentDepthLevel: newDepthLevel,
      insights: insight ? [...prev.insights, insight] : prev.insights,
      players: prev.players.map((player) =>
        player.id === activePlayer.id
          ? { ...player, score: player.score + quality.totalScore }
          : player,
      ),
    }));

    handleNextPlayer();
  };

  const handleNextPlayer = () => {
    const nextPlayerIndex =
      (gameState.activePlayerIndex + 1) % gameState.players.length;

    setGameState((prev) => ({
      ...prev,
      activePlayerIndex: nextPlayerIndex,
      currentRound: prev.currentRound + 1,
      timeRemaining: 60,
      players: prev.players.map((player, index) => ({
        ...player,
        isActive: index === nextPlayerIndex,
      })),
    }));

    setPhase("answer");
    setCurrentAnswer("");
    setCurrentQuestion("");
    setQuestionQuality(null);
    setIsTimerRunning(true);

    // Check if game should end
    if (
      gameState.currentRound >= playerNames.length * 3 ||
      gameState.currentDepthLevel >= 5
    ) {
      endGame();
    }
  };

  const endGame = () => {
    setGameState((prev) => ({ ...prev, gamePhase: "finished" }));
    setIsTimerRunning(false);
    if (onGameComplete) {
      onGameComplete(gameState);
    }
  };

  const resetGame = () => {
    setGameState({
      players: playerNames.map((name, index) => ({
        id: index.toString(),
        name,
        score: 0,
        isActive: index === 0,
        answers: [],
      })),
      currentRound: 0,
      activePlayerIndex: 0,
      currentDepthLevel: 1,
      rounds: [],
      gamePhase: "setup",
      timeRemaining: 90,
      insights: [],
    });
    setCurrentAnswer("");
    setCurrentQuestion("");
    setPhase("answer");
    setIsTimerRunning(false);
    setQuestionQuality(null);
  };

  const activePlayer = gameState.players[gameState.activePlayerIndex];

  if (gameState.gamePhase === "setup") {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-200">
            The Question Ladder
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Climb from surface-level conversation to profound personal insights
            through the power of thoughtful questioning.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200">
              How to Play
            </h3>
            <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
              <li>
                • Each player gets 60 seconds to answer, then 30 seconds to ask
                a question
              </li>
              <li>
                • Questions must be the same depth level or deeper than the
                current level
              </li>
              <li>
                • Build on previous answers to create meaningful connections
              </li>
              <li>
                • The goal is to reach the deepest level of conversation
                together
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200">
              Players ({playerNames.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {playerNames.map((name, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg"
                >
                  <Users className="w-4 h-4" />
                  <span className="text-sm font-medium">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center">
          <Button onClick={startGame} size="lg">
            <Play className="w-5 h-5 mr-2" />
            Start Game
          </Button>
        </div>
      </div>
    );
  }

  if (gameState.gamePhase === "finished") {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-200">
            Game Complete!
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            You reached level {gameState.currentDepthLevel} of conversation
            depth
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200">
              Final Scores
            </h3>
            <div className="space-y-2">
              {gameState.players
                .sort((a, b) => b.score - a.score)
                .map((player, index) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg"
                  >
                    <span className="font-medium text-neutral-800 dark:text-neutral-200">
                      {index + 1}. {player.name}
                    </span>
                    <span className="text-blue-600 dark:text-blue-400 font-bold">
                      {player.score.toFixed(1)}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          <InsightTracker insights={gameState.insights} />
        </div>

        <div className="text-center space-x-4">
          <Button onClick={resetGame} variant="secondary">
            <RotateCcw className="w-5 h-5 mr-2" />
            Play Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
          Round {gameState.currentRound + 1}
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          {activePlayer.name}'s turn •{" "}
          {phase === "answer" ? "Answer" : "Ask a question"}
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Game Controls */}
        <div className="space-y-6">
          <DepthMeter
            currentLevel={gameState.currentDepthLevel}
            maxLevel={5}
            levels={DEPTH_LEVELS}
          />

          <ResponseTimer
            totalTime={phase === "answer" ? 60 : 30}
            timeRemaining={gameState.timeRemaining}
            phase={phase}
            onTimeUp={handleTimeUp}
          />

          <div className="flex space-x-2">
            <Button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              variant="secondary"
              size="sm"
            >
              {isTimerRunning ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </Button>
            <Button onClick={resetGame} variant="secondary" size="sm">
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Center Column - Main Interface */}
        <div className="space-y-6">
          {phase === "answer" ? (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  Current Question:
                </h3>
                <p className="text-blue-700 dark:text-blue-300">
                  {currentQuestion || "Waiting for question..."}
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Your Answer
                </label>
                <textarea
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  className="w-full h-32 p-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Share your thoughts..."
                />
              </div>

              <Button
                onClick={handleAnswerSubmit}
                disabled={!currentAnswer.trim()}
                className="w-full"
              >
                Submit Answer & Ask Question
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                  Previous Answer:
                </h3>
                <p className="text-green-700 dark:text-green-300">
                  {currentAnswer}
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Your Question for the Next Person
                </label>
                <textarea
                  value={currentQuestion}
                  onChange={(e) => setCurrentQuestion(e.target.value)}
                  className="w-full h-24 p-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Ask a thoughtful question..."
                />
              </div>

              <Button
                onClick={handleQuestionSubmit}
                disabled={!currentQuestion.trim()}
                className="w-full"
              >
                Submit Question
              </Button>
            </div>
          )}
        </div>

        {/* Right Column - Analytics */}
        <div className="space-y-6">
          {questionQuality && (
            <QuestionQualityAnalyzer quality={questionQuality} />
          )}

          <InsightTracker insights={gameState.insights} />

          {/* Player Scores */}
          <div className="p-4 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-sm">
            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-3">
              Scores
            </h3>
            <div className="space-y-2">
              {gameState.players.map((player) => (
                <div
                  key={player.id}
                  className={cn(
                    "flex items-center justify-between p-2 rounded",
                    player.isActive
                      ? "bg-blue-50 dark:bg-blue-900/20"
                      : "bg-neutral-50 dark:bg-neutral-900/50",
                  )}
                >
                  <span
                    className={cn(
                      "font-medium",
                      player.isActive
                        ? "text-blue-800 dark:text-blue-200"
                        : "text-neutral-700 dark:text-neutral-300",
                    )}
                  >
                    {player.name}
                  </span>
                  <span
                    className={cn(
                      "font-bold",
                      player.isActive
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-neutral-600 dark:text-neutral-400",
                    )}
                  >
                    {player.score.toFixed(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
