"use client";

import React, { useState } from "react";
import { QuestionLadder } from "@/components/QuestionLadder";
import { Button } from "@/components/Button";
import { QuestionLadderGameState } from "@/lib/types";
import { UserPlus, Trash2 } from "lucide-react";

export default function QuestionLadderPage() {
  const [players, setPlayers] = useState<string[]>([]);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [gameData, setGameData] = useState<QuestionLadderGameState | null>(
    null,
  );

  const addPlayer = () => {
    if (newPlayerName.trim() && !players.includes(newPlayerName.trim())) {
      setPlayers([...players, newPlayerName.trim()]);
      setNewPlayerName("");
    }
  };

  const removePlayer = (index: number) => {
    setPlayers(players.filter((_, i) => i !== index));
  };

  const startGame = () => {
    if (players.length >= 2) {
      setGameStarted(true);
    }
  };

  const handleGameComplete = (data: QuestionLadderGameState) => {
    setGameData(data);
    setGameStarted(false);
  };

  const resetAll = () => {
    setPlayers([]);
    setGameStarted(false);
    setGameData(null);
    setNewPlayerName("");
  };

  if (gameStarted) {
    return (
      <QuestionLadder
        playerNames={players}
        onGameComplete={handleGameComplete}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-neutral-50 dark:from-neutral-900 dark:to-neutral-950">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-neutral-800 dark:text-neutral-200">
            The Question Ladder
          </h1>
          <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Climb from surface-level conversation to profound personal insights
            through the power of thoughtful questioning.
          </p>
        </div>

        {/* Game Setup */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-sm p-6">
          <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-200 mb-4">
            Game Setup
          </h2>

          {/* Add Players */}
          <div className="space-y-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addPlayer()}
                placeholder="Enter player name"
                className="flex-1 p-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Button onClick={addPlayer} disabled={!newPlayerName.trim()}>
                <UserPlus className="w-4 h-4 mr-2" />
                Add Player
              </Button>
            </div>

            {/* Player List */}
            {players.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-neutral-800 dark:text-neutral-200">
                  Players ({players.length})
                </h3>
                <div className="grid gap-2">
                  {players.map((player, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-900/50 rounded-lg"
                    >
                      <span className="text-neutral-800 dark:text-neutral-200 font-medium">
                        {player}
                      </span>
                      <button
                        onClick={() => removePlayer(index)}
                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Start Game */}
          <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center justify-between">
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                {players.length < 2
                  ? "Add at least 2 players to start"
                  : `Ready to start with ${players.length} players`}
              </div>
              <div className="flex space-x-2">
                {players.length > 0 && (
                  <Button onClick={resetAll} variant="secondary">
                    Reset
                  </Button>
                )}
                <Button
                  onClick={startGame}
                  disabled={players.length < 2}
                  size="lg"
                >
                  Start Game
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Game Instructions */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-sm p-6">
          <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-200 mb-4">
            How to Play
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-neutral-800 dark:text-neutral-200">
                Game Flow
              </h3>
              <ul className="space-y-2 text-neutral-600 dark:text-neutral-400">
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center mr-3 mt-0.5">
                    1
                  </span>
                  Each player gets 60 seconds to answer the current question
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center mr-3 mt-0.5">
                    2
                  </span>
                  Then 30 seconds to ask a question for the next person
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center mr-3 mt-0.5">
                    3
                  </span>
                  Questions should be the same depth level or deeper
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center mr-3 mt-0.5">
                    4
                  </span>
                  Build on previous answers to create connections
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-neutral-800 dark:text-neutral-200">
                Depth Levels
              </h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">
                    <strong>Level 1:</strong> Facts and preferences
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">
                    <strong>Level 2:</strong> Experiences and stories
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">
                    <strong>Level 3:</strong> Values and beliefs
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">
                    <strong>Level 4:</strong> Fears and vulnerabilities
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">
                    <strong>Level 5:</strong> Core identity and purpose
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Game Results */}
        {gameData && (
          <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-200 mb-4">
              Last Game Results
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-neutral-800 dark:text-neutral-200 mb-2">
                  Final Scores
                </h3>
                <div className="space-y-2">
                  {gameData.players
                    .sort((a, b) => b.score - a.score)
                    .map((player, index) => (
                      <div
                        key={player.id}
                        className="flex items-center justify-between p-2 bg-neutral-50 dark:bg-neutral-900/50 rounded"
                      >
                        <span className="text-neutral-800 dark:text-neutral-200">
                          {index + 1}. {player.name}
                        </span>
                        <span className="text-blue-600 dark:text-blue-400 font-bold">
                          {player.score.toFixed(1)}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-neutral-800 dark:text-neutral-200 mb-2">
                  Game Stats
                </h3>
                <div className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <div className="flex justify-between">
                    <span>Depth Level Reached:</span>
                    <span className="font-medium">
                      Level {gameData.currentDepthLevel}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Rounds:</span>
                    <span className="font-medium">
                      {gameData.rounds.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Meaningful Moments:</span>
                    <span className="font-medium">
                      {gameData.insights.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
