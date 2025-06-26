"use client";

import React from "react";
import { Player } from "./InvisibleSuperpowers";

interface ObservationPromptsProps {
  players: Player[];
  isActive: boolean;
}

const OBSERVATION_PROMPTS = [
  "Who asks questions that make others think deeper?",
  "Who creates comfort for nervous people?",
  "Who remembers small details others shared?",
  "Who finds connections between different ideas?",
  "Who stays calm when others are stressed?",
  "Who makes sure everyone feels included?",
  "Who helps clarify confusing situations?",
  "Who brings out the best in others?",
  "Who notices when someone needs support?",
  "Who creates positive energy in the group?",
];

export const ObservationPrompts: React.FC<ObservationPromptsProps> = ({
  players,
  isActive,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-green-900 dark:text-green-100 mb-4">
          👀 Observation Phase
        </h2>
        <p className="text-green-800 dark:text-green-200 mb-4">
          Observe others during casual conversation. Look for subtle strengths
          and positive impacts.
        </p>

        {isActive && (
          <div className="bg-green-100 dark:bg-green-800/30 p-4 rounded-lg">
            <p className="text-green-800 dark:text-green-200 font-medium mb-2">
              💬 Start a casual conversation now! While talking, notice...
            </p>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            🔍 Observation Prompts
          </h3>
          <div className="space-y-2">
            {OBSERVATION_PROMPTS.map((prompt, index) => (
              <div key={index} className="flex items-start space-x-2">
                <span className="text-blue-600 dark:text-blue-400 font-bold text-sm mt-1">
                  {index + 1}.
                </span>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  {prompt}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            👥 Group Members
          </h3>
          <div className="space-y-3">
            {players.map((player) => (
              <div
                key={player.id}
                className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {player.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {player.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-2">
          💡 Tips for Effective Observation:
        </h4>
        <ul className="text-blue-800 dark:text-blue-200 text-sm space-y-1">
          <li>• Focus on impact rather than intention</li>
          <li>• Notice subtle behaviors, not obvious ones</li>
          <li>• Look for strengths people might not see in themselves</li>
          <li>• Pay attention to how others respond to each person</li>
        </ul>
      </div>
    </div>
  );
};
