"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { AuthenticityGameState, Player, GameRound } from '@/lib/types';
import { Button } from './Button';
import { StoryPromptGenerator } from './StoryPromptGenerator';
import { TruthLieAssigner } from './TruthLieAssigner';
import { DeceptionDetector } from './DeceptionDetector';
import { VulnerabilityScaler } from './VulnerabilityScaler';
import { Timer } from './Timer';
import { Users, Eye, MessageCircle, Trophy } from 'lucide-react';

interface AuthenticityChallengeProps {
  playerNames: string[];
  onGameEnd?: (results: GameRound[]) => void;
}

export const AuthenticityChallenge: React.FC<AuthenticityChallengeProps> = ({
  playerNames,
  onGameEnd
}) => {
  const [gameState, setGameState] = useState<AuthenticityGameState>({
    players: playerNames.map((name, index) => ({
      id: `player-${index}`,
      name
    })),
    currentRound: 1,
    rounds: [],
    phase: 'setup'
  });

  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);

  // Initialize game
  useEffect(() => {
    if (gameState.phase === 'setup' && gameState.players.length > 0) {
      setGameState(prev => ({
        ...prev,
        phase: 'assignment'
      }));
    }
  }, [gameState.phase, gameState.players.length]);

  const startNewRound = useCallback((vulnerability: 'low' | 'medium' | 'high') => {
    const newRound: GameRound = {
      roundNumber: gameState.currentRound,
      vulnerability,
      prompt: { id: '', text: '', category: vulnerability }, // Will be set by StoryPromptGenerator
      players: gameState.players.map(p => ({ ...p, isLiar: false, story: '', hasShared: false })),
      votes: [],
      revealed: false
    };

    setGameState(prev => ({
      ...prev,
      rounds: [...prev.rounds, newRound],
      phase: 'assignment'
    }));
  }, [gameState.currentRound, gameState.players]);

  const handleRoleAssignment = useCallback((playersWithRoles: Player[]) => {
    setGameState(prev => ({
      ...prev,
      players: playersWithRoles,
      rounds: prev.rounds.map((round, index) => 
        index === prev.rounds.length - 1 
          ? { ...round, players: playersWithRoles }
          : round
      ),
      phase: 'sharing',
      currentSpeaker: playersWithRoles[0]?.id
    }));
    setCurrentPlayerIndex(0);
  }, []);

  const handleStorySubmit = useCallback((playerId: string, story: string) => {
    setGameState(prev => {
      const updatedPlayers = prev.players.map(player =>
        player.id === playerId ? { ...player, story, hasShared: true } : player
      );
      
      const updatedRounds = prev.rounds.map((round, index) =>
        index === prev.rounds.length - 1
          ? { ...round, players: updatedPlayers }
          : round
      );

      const allShared = updatedPlayers.every(p => p.hasShared);
      const nextPlayerIndex = currentPlayerIndex + 1;
      
      return {
        ...prev,
        players: updatedPlayers,
        rounds: updatedRounds,
        phase: allShared ? 'voting' : 'sharing',
        currentSpeaker: allShared ? undefined : updatedPlayers[nextPlayerIndex]?.id
      };
    });

    if (!gameState.players.every(p => p.hasShared)) {
      setCurrentPlayerIndex(prev => prev + 1);
    }
  }, [currentPlayerIndex, gameState.players]);

  const handleVotingComplete = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      phase: 'discussion'
    }));
  }, []);

  const handleRoundComplete = useCallback(() => {
    const isLastRound = gameState.currentRound >= 3;
    
    if (isLastRound) {
      setGameState(prev => ({
        ...prev,
        phase: 'finished'
      }));
      onGameEnd?.(gameState.rounds);
    } else {
      setGameState(prev => ({
        ...prev,
        currentRound: prev.currentRound + 1,
        phase: 'setup',
        players: prev.players.map(p => ({ ...p, isLiar: false, story: '', hasShared: false }))
      }));
      setCurrentPlayerIndex(0);
    }
  }, [gameState.currentRound, gameState.rounds, onGameEnd]);

  const getCurrentRound = () => gameState.rounds[gameState.rounds.length - 1];

  const renderPhase = () => {
    const currentRound = getCurrentRound();

    switch (gameState.phase) {
      case 'setup':
        return (
          <VulnerabilityScaler
            currentRound={gameState.currentRound}
            onLevelSelect={startNewRound}
          />
        );

      case 'assignment':
        return (
          <div className="space-y-6">
            <StoryPromptGenerator
              vulnerability={currentRound?.vulnerability || 'low'}
              onPromptGenerated={(prompt) => {
                setGameState(prev => ({
                  ...prev,
                  rounds: prev.rounds.map((round, index) =>
                    index === prev.rounds.length - 1 ? { ...round, prompt } : round
                  )
                }));
              }}
            />
            <TruthLieAssigner
              players={gameState.players}
              onAssignmentComplete={handleRoleAssignment}
            />
          </div>
        );

      case 'sharing':
        const currentSpeaker = gameState.players.find(p => p.id === gameState.currentSpeaker);
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Story Sharing - {currentSpeaker?.name}'s Turn
              </h3>
              <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-lg">{currentRound?.prompt.text}</p>
              </div>
              <Timer
                duration={90} // 90 seconds per story
                onTimeUp={() => {
                  // Auto-advance if no story submitted
                  if (currentSpeaker && !currentSpeaker.story) {
                    handleStorySubmit(currentSpeaker.id, '');
                  }
                }}
              />
            </div>
          </div>
        );

      case 'voting':
        return (
          <DeceptionDetector
            round={currentRound}
            players={gameState.players}
            onVotingComplete={handleVotingComplete}
          />
        );

      case 'discussion':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Round {gameState.currentRound} Results
              </h3>
              <div className="space-y-4">
                {gameState.players.map(player => (
                  <div key={player.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{player.name}</span>
                      <span className={`px-2 py-1 rounded text-sm ${
                        player.isLiar 
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                          : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      }`}>
                        {player.isLiar ? 'Was Lying' : 'Told Truth'}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-300">
                      {player.story}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Button onClick={handleRoundComplete}>
                  {gameState.currentRound >= 3 ? 'Finish Game' : 'Next Round'}
                </Button>
              </div>
            </div>
          </div>
        );

      case 'finished':
        return (
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-lg text-center">
            <Trophy className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
            <h3 className="text-2xl font-bold mb-4">Game Complete!</h3>
            <p className="text-lg text-neutral-600 dark:text-neutral-300 mb-6">
              Thank you for playing The Authenticity Challenge. 
              You've shared stories and discovered new things about each other!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Rounds Played</h4>
                <p className="text-2xl font-bold text-blue-600">{gameState.rounds.length}</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Stories Shared</h4>
                <p className="text-2xl font-bold text-green-600">
                  {gameState.rounds.reduce((acc, round) => 
                    acc + round.players.filter(p => p.story).length, 0
                  )}
                </p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Players</h4>
                <p className="text-2xl font-bold text-purple-600">{gameState.players.length}</p>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Loading...</div>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg p-6 shadow-lg">
        <h1 className="text-3xl font-bold mb-2">The Authenticity Challenge</h1>
        <p className="text-lg opacity-90">
          Share stories, detect deception, and discover deeper truths about each other
        </p>
        <div className="flex items-center gap-4 mt-4 text-sm">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{gameState.players.length} Players</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4" />
            <span>Round {gameState.currentRound}/3</span>
          </div>
        </div>
      </div>

      {renderPhase()}
    </div>
  );
};