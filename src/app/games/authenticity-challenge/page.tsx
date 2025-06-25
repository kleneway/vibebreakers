"use client";

import React, { useState } from 'react';
import { AuthenticityChallenge } from '@/components/AuthenticityChallenge';
import { Button } from '@/components/Button';
import { ArrowLeft, Users, Plus, Minus } from 'lucide-react';
import Link from 'next/link';

interface GameRound {
  roundNumber: number;
  vulnerability: 'low' | 'medium' | 'high';
  prompt: any;
  players: any[];
  votes: any[];
  revealed: boolean;
}

export default function AuthenticityChallengePage() {
  const [gameStarted, setGameStarted] = useState(false);
  const [playerNames, setPlayerNames] = useState(['Alice', 'Bob', 'Charlie']);
  const [newPlayerName, setNewPlayerName] = useState('');

  const handleAddPlayer = () => {
    if (newPlayerName.trim() && playerNames.length < 8) {
      setPlayerNames([...playerNames, newPlayerName.trim()]);
      setNewPlayerName('');
    }
  };

  const handleRemovePlayer = (index: number) => {
    if (playerNames.length > 2) {
      setPlayerNames(playerNames.filter((_, i) => i !== index));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddPlayer();
    }
  };

  const handleGameEnd = (results: GameRound[]) => {
    console.log('Game completed with results:', results);
    // Could add game results tracking here
    setGameStarted(false);
  };

  if (gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-neutral-50 dark:from-neutral-900 dark:to-neutral-950">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setGameStarted(false)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Setup
            </Button>
          </div>
          
          <AuthenticityChallenge 
            playerNames={playerNames}
            onGameEnd={handleGameEnd}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-neutral-50 dark:from-neutral-900 dark:to-neutral-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Games
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Game Info */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg p-8 mb-8 shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <div className="text-4xl">🎭</div>
              <div>
                <h1 className="text-3xl font-bold mb-2">The Authenticity Challenge</h1>
                <p className="text-lg opacity-90">
                  Share stories and detect deception through the power of authentic connection
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="font-semibold mb-1">Duration</h3>
                <p className="text-sm opacity-80">15-20 minutes</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="font-semibold mb-1">Players</h3>
                <p className="text-sm opacity-80">3-8 people</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="font-semibold mb-1">Difficulty</h3>
                <p className="text-sm opacity-80">Progressive vulnerability</p>
              </div>
            </div>
          </div>

          {/* How to Play */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 mb-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-4">How to Play</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
                  Role Assignment
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  Players are secretly assigned roles: 70% will tell true stories, 30% will craft believable lies.
                </p>
                
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
                  Story Sharing
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Everyone gets 90 seconds to share a personal story based on the round's prompt.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
                  Deception Detection
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  Vote on who you think was lying, with confidence ratings and optional reasoning.
                </p>
                
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm">4</span>
                  Results & Discussion
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Reveal who was lying, see detection accuracy, and discuss what made stories believable.
                </p>
              </div>
            </div>
          </div>

          {/* Player Setup */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Users className="w-6 h-6" />
              Setup Players
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {playerNames.map((name, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-neutral-700 rounded-lg p-3">
                    <span className="font-medium">{name}</span>
                    <button
                      onClick={() => handleRemovePlayer(index)}
                      disabled={playerNames.length <= 2}
                      className={`p-1 rounded ${
                        playerNames.length <= 2
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20'
                      }`}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {playerNames.length < 8 && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newPlayerName}
                    onChange={(e) => setNewPlayerName(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter player name"
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white"
                  />
                  <Button
                    onClick={handleAddPlayer}
                    disabled={!newPlayerName.trim()}
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Player
                  </Button>
                </div>
              )}

              <div className="flex items-center justify-between pt-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {playerNames.length} of 8 players • Minimum 3 required
                </div>
                <Button
                  onClick={() => setGameStarted(true)}
                  disabled={playerNames.length < 3}
                  className="flex items-center gap-2"
                >
                  Start Game
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}