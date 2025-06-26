"use client";

import { useState } from "react";

interface HomeScreenProps {
  onStartGame: (sessionName: string) => void;
}

export function HomeScreen({ onStartGame }: HomeScreenProps) {
  const [sessionName, setSessionName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (sessionName.trim()) {
      onStartGame(sessionName.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-teal-600 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            🎮 Emoji Pictionary
          </h1>
          <p className="text-gray-600 dark:text-gray-300">Three-Team Edition</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="sessionName"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Session Name
            </label>
            <input
              type="text"
              id="sessionName"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              placeholder="Enter session name..."
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>

          <button
            type="submit"
            disabled={!sessionName.trim()}
            className={`
              w-full py-3 px-6 rounded-lg font-bold text-lg transition-all
              ${
                sessionName.trim()
                  ? "bg-purple-600 hover:bg-purple-700 text-white hover:scale-105 active:scale-95"
                  : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              }
            `}
          >
            Start Game
          </button>
        </form>
      </div>
    </div>
  );
}
