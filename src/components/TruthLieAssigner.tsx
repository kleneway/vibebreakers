"use client";

import React, { useState, useMemo } from 'react';
import { Player } from '@/lib/types';
import { Button } from './Button';
import { Shuffle, Eye, EyeOff, Users } from 'lucide-react';

interface TruthLieAssignerProps {
  players: Player[];
  onAssignmentComplete: (playersWithRoles: Player[]) => void;
}

export const TruthLieAssigner: React.FC<TruthLieAssignerProps> = ({
  players,
  onAssignmentComplete
}) => {
  const [isAssigned, setIsAssigned] = useState(false);
  const [showRoles, setShowRoles] = useState(false);

  // Assign roles: 70% truth-tellers, 30% liars
  const playersWithRoles = useMemo(() => {
    const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
    const numLiars = Math.max(1, Math.floor(players.length * 0.3));
    
    return shuffledPlayers.map((player, index) => ({
      ...player,
      isLiar: index < numLiars,
      story: '',
      hasShared: false
    }));
  }, [players]);

  const liars = playersWithRoles.filter(p => p.isLiar);
  const truthTellers = playersWithRoles.filter(p => !p.isLiar);

  const handleAssignRoles = () => {
    setIsAssigned(true);
  };

  const handleComplete = () => {
    onAssignmentComplete(playersWithRoles);
  };

  if (!isAssigned) {
    return (
      <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <Shuffle className="w-5 h-5 text-purple-500" />
          <h3 className="text-xl font-semibold">Role Assignment</h3>
        </div>
        
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4">
            <h4 className="font-semibold text-lg mb-2">How It Works</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-white dark:bg-neutral-700 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-medium">Truth-Tellers (70%)</span>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Share a real, authentic story from your life based on the prompt.
                </p>
              </div>
              <div className="bg-white dark:bg-neutral-700 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="font-medium">Fabricators (30%)</span>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Create a believable fictional story that feels authentic and personal.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
            <h5 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
              Tips for Fabricators
            </h5>
            <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
              <li>• Base your lie on real emotions - fake the situation, not the feelings</li>
              <li>• Include specific, embarrassing details to seem authentic</li>
              <li>• Stay emotionally consistent throughout your story</li>
              <li>• Don't make it too perfect - real stories have messy parts</li>
            </ul>
          </div>

          <div className="flex items-center justify-center">
            <Button onClick={handleAssignRoles} className="flex items-center gap-2">
              <Shuffle className="w-4 h-4" />
              Assign Roles Randomly
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-purple-500" />
          <h3 className="text-xl font-semibold">Roles Assigned</h3>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowRoles(!showRoles)}
          className="flex items-center gap-2"
        >
          {showRoles ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {showRoles ? 'Hide' : 'Show'} Roles
        </Button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2 flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              Truth-Tellers ({truthTellers.length})
            </h4>
            {showRoles ? (
              <ul className="space-y-1 text-sm">
                {truthTellers.map(player => (
                  <li key={player.id} className="text-green-700 dark:text-green-300">
                    {player.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-green-600 dark:text-green-300">
                Will share authentic personal stories
              </p>
            )}
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
            <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2 flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              Fabricators ({liars.length})
            </h4>
            {showRoles ? (
              <ul className="space-y-1 text-sm">
                {liars.map(player => (
                  <li key={player.id} className="text-red-700 dark:text-red-300">
                    {player.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-red-600 dark:text-red-300">
                Will create believable fictional stories
              </p>
            )}
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <strong>Everyone:</strong> Take a moment to mentally prepare your story. 
            Remember, the goal is to create connection and intrigue - whether through truth or skillful fiction!
          </p>
        </div>

        <div className="flex justify-center pt-4">
          <Button onClick={handleComplete}>
            Start Story Sharing
          </Button>
        </div>
      </div>
    </div>
  );
};