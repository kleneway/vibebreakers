"use client";

import { useState, useEffect, useCallback } from "react";
import { HomeScreen } from "./HomeScreen";
import { GameScreen } from "./GameScreen";
import { VerdictModal } from "./VerdictModal";
import { EndGameModal } from "./EndGameModal";

interface GameState {
  sessionName: string;
  round: number;
  totalRounds: number;
  scores: {
    red: number;
    blue: number;
    green: number;
  };
  secondsLeft: number;
  currentPrompt: string;
  lockedOutTeams: string[];
  gamePhase: "home" | "playing" | "judging" | "ended";
  buzzedTeam: string | null;
}

const EMOJI_PROMPTS = [
  "🎯🔑📈",
  "🦄🎪🎭",
  "🎨🎵🎸",
  "🚀🌙⭐",
  "🏖️🌊🏝️",
  "🎂🎉🎈",
  "📧⛓️💻",
  "🔥❄️🌈",
  "🎭🎪🎨",
  "🍎🍌🍊",
];

const ROUND_TIME = 60;
const TOTAL_ROUNDS = 10;

export function EmojiPictionaryGame() {
  const [gameState, setGameState] = useState<GameState>({
    sessionName: "",
    round: 0,
    totalRounds: TOTAL_ROUNDS,
    scores: { red: 0, blue: 0, green: 0 },
    secondsLeft: ROUND_TIME,
    currentPrompt: "",
    lockedOutTeams: [],
    gamePhase: "home",
    buzzedTeam: null,
  });

  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  // Define nextRound first since it's used by other functions
  const nextRound = useCallback(() => {
    setGameState((prev) => {
      const { round, totalRounds } = prev;

      if (round >= totalRounds) {
        // Game over
        return {
          ...prev,
          gamePhase: "ended",
        };
      } else {
        // Next round
        const nextRoundNum = round + 1;
        return {
          ...prev,
          round: nextRoundNum,
          currentPrompt: EMOJI_PROMPTS[nextRoundNum - 1] || "🎯🔑📈",
          secondsLeft: ROUND_TIME,
          lockedOutTeams: [],
          gamePhase: "playing",
          buzzedTeam: null,
        };
      }
    });
  }, []);

  // Timer effect
  useEffect(() => {
    if (gameState.gamePhase === "playing" && gameState.secondsLeft > 0) {
      const id = setInterval(() => {
        setGameState((prev) => ({
          ...prev,
          secondsLeft: prev.secondsLeft - 1,
        }));
      }, 1000);
      setIntervalId(id);
      return () => clearInterval(id);
    } else if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  }, [gameState.gamePhase, gameState.secondsLeft, intervalId]);

  // Time up effect
  useEffect(() => {
    if (gameState.gamePhase === "playing" && gameState.secondsLeft === 0) {
      // Time's up, move to next round
      nextRound();
    }
  }, [gameState.secondsLeft, gameState.gamePhase, nextRound]);

  const startGame = useCallback((sessionName: string) => {
    setGameState((prev) => ({
      ...prev,
      sessionName,
      round: 1,
      currentPrompt: EMOJI_PROMPTS[0],
      gamePhase: "playing",
      secondsLeft: ROUND_TIME,
      lockedOutTeams: [],
    }));
  }, []);

  const handleBuzz = useCallback(
    (teamName: string) => {
      if (gameState.lockedOutTeams.includes(teamName)) return;

      setGameState((prev) => ({
        ...prev,
        gamePhase: "judging",
        buzzedTeam: teamName,
      }));
    },
    [gameState.lockedOutTeams],
  );

  const handleVerdict = useCallback((isCorrect: boolean) => {
    setGameState((prev) => {
      const { buzzedTeam, scores } = prev;
      if (!buzzedTeam) return prev;

      const newScores = { ...scores };
      const teamKey = buzzedTeam.toLowerCase() as keyof typeof scores;

      if (isCorrect) {
        newScores[teamKey] += 1;
        // Correct answer, move to next round via useEffect
        return {
          ...prev,
          scores: newScores,
          gamePhase: "playing",
          buzzedTeam: null,
          secondsLeft: 0, // This will trigger nextRound in useEffect
        };
      } else {
        newScores[teamKey] -= 1;
        // Wrong answer, lock out team and continue
        return {
          ...prev,
          scores: newScores,
          lockedOutTeams: [...prev.lockedOutTeams, buzzedTeam],
          gamePhase: "playing",
          buzzedTeam: null,
        };
      }
    });
  }, []);

  const getWinner = useCallback(() => {
    const { red, blue, green } = gameState.scores;
    const maxScore = Math.max(red, blue, green);
    const winners = [];

    if (red === maxScore) winners.push("Red");
    if (blue === maxScore) winners.push("Blue");
    if (green === maxScore) winners.push("Green");

    return winners.length === 1 ? winners[0] : undefined;
  }, [gameState.scores]);

  const isTie = useCallback(() => {
    const { red, blue, green } = gameState.scores;
    const maxScore = Math.max(red, blue, green);
    const winners = [];

    if (red === maxScore) winners.push("Red");
    if (blue === maxScore) winners.push("Blue");
    if (green === maxScore) winners.push("Green");

    return winners.length > 1;
  }, [gameState.scores]);

  const resetGame = useCallback(() => {
    setGameState({
      sessionName: "",
      round: 0,
      totalRounds: TOTAL_ROUNDS,
      scores: { red: 0, blue: 0, green: 0 },
      secondsLeft: ROUND_TIME,
      currentPrompt: "",
      lockedOutTeams: [],
      gamePhase: "home",
      buzzedTeam: null,
    });
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameState.gamePhase !== "playing") return;

      switch (e.key) {
        case "1":
          handleBuzz("Red");
          break;
        case "2":
          handleBuzz("Blue");
          break;
        case "3":
          handleBuzz("Green");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [gameState.gamePhase, handleBuzz]);

  if (gameState.gamePhase === "home") {
    return <HomeScreen onStartGame={startGame} />;
  }

  if (gameState.gamePhase === "ended") {
    return (
      <EndGameModal
        winner={getWinner()}
        isTie={isTie()}
        onPlayAgain={resetGame}
      />
    );
  }

  return (
    <>
      <GameScreen
        sessionName={gameState.sessionName}
        round={gameState.round}
        totalRounds={gameState.totalRounds}
        scores={gameState.scores}
        secondsLeft={gameState.secondsLeft}
        currentPrompt={gameState.currentPrompt}
        lockedOutTeams={gameState.lockedOutTeams}
        onBuzz={handleBuzz}
      />

      {gameState.gamePhase === "judging" && gameState.buzzedTeam && (
        <VerdictModal
          teamName={gameState.buzzedTeam}
          onVerdict={handleVerdict}
        />
      )}
    </>
  );
}
