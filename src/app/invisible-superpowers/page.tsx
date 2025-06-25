"use client";

import React, { useState } from "react";
import {
  InvisibleSuperpowers,
  Player,
  Superpower,
} from "@/components/InvisibleSuperpowers";
import { Button } from "@/components/Button";

export default function InvisibleSuperpowersDemo() {
  const [gameStarted, setGameStarted] = useState(false);
  const [players, setPlayers] = useState<Player[]>([
    { id: "1", name: "Alex" },
    { id: "2", name: "Sarah" },
    { id: "3", name: "Mike" },
    { id: "4", name: "Emma" },
  ]);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [gameResults, setGameResults] = useState<Superpower[]>([]);

  const addPlayer = () => {
    if (newPlayerName.trim()) {
      setPlayers([
        ...players,
        { id: Date.now().toString(), name: newPlayerName.trim() },
      ]);
      setNewPlayerName("");
    }
  };

  const removePlayer = (playerId: string) => {
    setPlayers(players.filter((p) => p.id !== playerId));
  };

  const startGame = () => {
    if (players.length >= 2) {
      setGameStarted(true);
    }
  };

  const handleGameComplete = (results: Superpower[]) => {
    setGameResults(results);
    console.log("Game completed with results:", results);
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameResults([]);
  };

  if (gameStarted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <InvisibleSuperpowers
          players={players}
          onGameComplete={handleGameComplete}
        />
        <div className="fixed top-4 right-4">
          <Button onClick={resetGame} variant="secondary" size="sm">
            Reset Game
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-2xl mx-auto p-6 space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            🦸‍♀️ Invisible Superpowers
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Discover and celebrate each other's subtle but powerful strengths
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Game Setup
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Add Players (minimum 2)
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  placeholder="Enter player name"
                  className="flex-1 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  onKeyPress={(e) => e.key === "Enter" && addPlayer()}
                />
                <Button onClick={addPlayer} disabled={!newPlayerName.trim()}>
                  Add Player
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                Current Players ({players.length})
              </h3>
              <div className="space-y-2">
                {players.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {player.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {player.name}
                      </span>
                    </div>
                    <Button
                      onClick={() => removePlayer(player.id)}
                      variant="secondary"
                      size="sm"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
          <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-3">
            How to Play:
          </h3>
          <ul className="text-blue-800 dark:text-blue-200 text-sm space-y-2">
            <li>
              🔍 <strong>Observation:</strong> Watch others during casual
              conversation
            </li>
            <li>
              🦸‍♀️ <strong>Identification:</strong> Assign creative superpower
              names to others
            </li>
            <li>
              📝 <strong>Evidence:</strong> Provide specific examples of each
              superpower
            </li>
            <li>
              🎉 <strong>Ceremony:</strong> Celebrate each person's unique
              strengths
            </li>
            <li>
              💭 <strong>Reflection:</strong> Discuss insights and surprises
            </li>
          </ul>
        </div>

        <div className="text-center">
          <Button
            onClick={startGame}
            disabled={players.length < 2}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {players.length < 2
              ? `Need ${2 - players.length} more player${
                  2 - players.length === 1 ? "" : "s"
                }`
              : `Start Game with ${players.length} Players`}
          </Button>
        </div>
      </div>
    </div>
  );
}
