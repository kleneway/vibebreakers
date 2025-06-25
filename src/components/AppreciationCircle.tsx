"use client";

import React from "react";
import { Player, Superpower } from "./InvisibleSuperpowers";
import { Button } from "./Button";

interface AppreciationCircleProps {
  players: Player[];
  superpowers: Superpower[];
  currentPlayerIndex: number;
  isActive: boolean;
  onNext: () => void;
}

export const AppreciationCircle: React.FC<AppreciationCircleProps> = ({
  players,
  superpowers,
  currentPlayerIndex,
  isActive,
  onNext
}) => {
  const currentPlayer = players[currentPlayerIndex];
  const playerSuperpowers = superpowers.filter(sp => sp.playerId === currentPlayer?.id);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 p-8 rounded-lg">
        <h2 className="text-3xl font-bold text-purple-900 dark:text-purple-100 mb-4 text-center">
          🎉 Superpower Bestowal Ceremony
        </h2>
        <p className="text-purple-800 dark:text-purple-200 mb-6 text-center">
          Time to celebrate and bestow superpowers!
        </p>
        
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-800/50 dark:to-pink-800/50 p-6 rounded-lg text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
            {currentPlayer?.name?.charAt(0).toUpperCase()}
          </div>
          <h3 className="text-2xl font-bold text-purple-900 dark:text-purple-100 mb-2">
            {currentPlayer?.name}
          </h3>
          <p className="text-purple-800 dark:text-purple-200">
            Your invisible superpowers are being revealed!
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {playerSuperpowers.length === 0 ? (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg text-center">
            <p className="text-yellow-800 dark:text-yellow-200">
              No superpowers have been assigned to {currentPlayer?.name} yet.
            </p>
          </div>
        ) : (
          playerSuperpowers.map((superpower, index) => (
            <div key={superpower.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg border-2 border-purple-200 dark:border-purple-700 shadow-lg">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  ✨
                </div>
                
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-purple-900 dark:text-purple-100 mb-2">
                      {superpower.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Bestowed by <strong>{superpower.assignedByName}</strong>
                    </p>
                  </div>

                  {superpower.evidence && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-2">
                        📝 Evidence:
                      </h4>
                      <p className="text-blue-800 dark:text-blue-200 text-sm">
                        {superpower.evidence}
                      </p>
                    </div>
                  )}

                  {superpower.impact && (
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <h4 className="font-bold text-green-900 dark:text-green-100 mb-2">
                        💫 Impact:
                      </h4>
                      <p className="text-green-800 dark:text-green-200 text-sm">
                        {superpower.impact}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              {index < playerSuperpowers.length - 1 && (
                <div className="mt-6 border-t pt-4 text-center">
                  <div className="inline-flex items-center space-x-2 text-purple-600 dark:text-purple-400 text-sm">
                    <span>⭐</span>
                    <span>⭐</span>
                    <span>⭐</span>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-6 rounded-lg">
        <h4 className="font-bold text-orange-900 dark:text-orange-100 mb-3 text-center">
          🌟 Celebration Time!
        </h4>
        <div className="text-center space-y-2">
          <p className="text-orange-800 dark:text-orange-200 text-sm">
            Take a moment to appreciate these unique strengths.
          </p>
          <p className="text-orange-700 dark:text-orange-300 text-sm font-medium">
            {currentPlayer?.name}, how do these superpowers feel? Any surprises?
          </p>
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <div className="text-center">
          <div className="flex justify-center space-x-2 mb-2">
            {players.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index === currentPlayerIndex
                    ? "bg-purple-600"
                    : index < currentPlayerIndex
                    ? "bg-green-600"  
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Player {currentPlayerIndex + 1} of {players.length}
          </p>
        </div>
      </div>

      <div className="flex justify-center">
        <Button 
          onClick={onNext} 
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          {currentPlayerIndex < players.length - 1 ? "Next Player" : "Complete Ceremony"}
        </Button>
      </div>
    </div>
  );
};