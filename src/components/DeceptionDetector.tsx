"use client";

import React, { useState, useEffect } from 'react';
import { Player, GameRound, Vote } from '@/lib/types';
import { Button } from './Button';
import { Search, Target, CheckCircle, AlertCircle } from 'lucide-react';

interface DeceptionDetectorProps {
  round: GameRound;
  players: Player[];
  onVotingComplete: () => void;
}

export const DeceptionDetector: React.FC<DeceptionDetectorProps> = ({
  round,
  players,
  onVotingComplete
}) => {
  const [votes, setVotes] = useState<Vote[]>([]);
  const [currentVoter, setCurrentVoter] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(30);

  // Initialize first voter
  useEffect(() => {
    if (!currentVoter && players.length > 0) {
      setCurrentVoter(players[0].id);
    }
  }, [currentVoter, players]);

  // Timer countdown
  useEffect(() => {
    if (timeRemaining > 0 && !showResults) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && !showResults) {
      handleTimeUp();
    }
  }, [timeRemaining, showResults]);

  const handleTimeUp = () => {
    // Auto-submit votes for players who haven't voted
    const missingVotes = players
      .filter(p => !votes.find(v => v.voterId === p.id))
      .map(p => ({
        voterId: p.id,
        suspectedLiarId: players[Math.floor(Math.random() * players.length)].id,
        confidence: Math.floor(Math.random() * 5) + 3, // Random 3-7
        reasoning: 'Time ran out - random guess'
      }));

    setVotes(prev => [...prev, ...missingVotes]);
    setShowResults(true);
  };

  const handleVote = (voterId: string, suspectedLiarId: string, confidence: number, reasoning?: string) => {
    const newVote: Vote = {
      voterId,
      suspectedLiarId,
      confidence,
      reasoning
    };

    setVotes(prev => [...prev.filter(v => v.voterId !== voterId), newVote]);

    // Move to next voter
    const currentIndex = players.findIndex(p => p.id === currentVoter);
    const nextIndex = currentIndex + 1;
    
    if (nextIndex < players.length) {
      setCurrentVoter(players[nextIndex].id);
    } else {
      setShowResults(true);
    }
  };

  const calculateResults = () => {
    const suspicionCounts: Record<string, { votes: number; totalConfidence: number; voters: string[] }> = {};
    
    players.forEach(player => {
      suspicionCounts[player.id] = { votes: 0, totalConfidence: 0, voters: [] };
    });

    votes.forEach(vote => {
      suspicionCounts[vote.suspectedLiarId].votes += 1;
      suspicionCounts[vote.suspectedLiarId].totalConfidence += vote.confidence;
      suspicionCounts[vote.suspectedLiarId].voters.push(
        players.find(p => p.id === vote.voterId)?.name || 'Unknown'
      );
    });

    return Object.entries(suspicionCounts)
      .map(([playerId, data]) => ({
        player: players.find(p => p.id === playerId)!,
        ...data,
        avgConfidence: data.votes > 0 ? data.totalConfidence / data.votes : 0
      }))
      .sort((a, b) => b.votes - a.votes || b.avgConfidence - a.avgConfidence);
  };

  const getAccuracyScore = () => {
    const correctVotes = votes.filter(vote => {
      const suspected = players.find(p => p.id === vote.suspectedLiarId);
      return suspected?.isLiar;
    });
    return Math.round((correctVotes.length / votes.length) * 100);
  };

  if (showResults) {
    const results = calculateResults();
    const accuracy = getAccuracyScore();
    
    return (
      <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-green-500" />
          <h3 className="text-xl font-semibold">Deception Detection Results</h3>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4">
            <h4 className="font-semibold text-lg mb-2">Group Accuracy</h4>
            <div className="flex items-center gap-4">
              <div className="text-3xl font-bold text-blue-600">{accuracy}%</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {votes.filter(v => players.find(p => p.id === v.suspectedLiarId)?.isLiar).length} out of {votes.length} correct votes
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">Suspicion Rankings</h4>
            {results.map((result, index) => (
              <div key={result.player.id} className="border rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                    <div>
                      <span className="font-medium">{result.player.name}</span>
                      <div className="flex items-center gap-2 mt-1">
                        {result.player.isLiar ? (
                          <div className="flex items-center gap-1 text-red-600">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-sm">Was Lying</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-sm">Told Truth</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold">{result.votes} votes</div>
                    {result.votes > 0 && (
                      <div className="text-sm text-gray-500">
                        Avg confidence: {result.avgConfidence.toFixed(1)}/10
                      </div>
                    )}
                  </div>
                </div>
                {result.votes > 0 && (
                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    Suspected by: {result.voters.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
            <h5 className="font-medium text-purple-800 dark:text-purple-200 mb-2">
              What Made Stories Believable?
            </h5>
            <ul className="text-sm text-purple-700 dark:text-purple-300 space-y-1">
              <li>• Specific, embarrassing details that felt authentic</li>
              <li>• Emotional consistency throughout the story</li>
              <li>• Natural pauses and self-corrections</li>
              <li>• Stories that fit the person's known personality</li>
            </ul>
          </div>

          <div className="flex justify-center">
            <Button onClick={onVotingComplete}>
              Continue to Discussion
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const currentVoterPlayer = players.find(p => p.id === currentVoter);
  const votingOptions = players.filter(p => p.id !== currentVoter);

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-blue-500" />
          <h3 className="text-xl font-semibold">Detect the Deception</h3>
        </div>
        <div className="text-sm text-gray-500">
          Time remaining: {timeRemaining}s
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
            {currentVoterPlayer?.name}, who do you think was lying?
          </h4>
          <p className="text-sm text-blue-600 dark:text-blue-300">
            Think about inconsistencies, details that seemed too perfect, or stories that didn't quite fit the person.
          </p>
        </div>

        <div className="space-y-3">
          {votingOptions.map(player => (
            <VotingCard
              key={player.id}
              player={player}
              onVote={(confidence, reasoning) => 
                handleVote(currentVoter!, player.id, confidence, reasoning)
              }
            />
          ))}
        </div>

        <div className="text-center text-sm text-gray-500">
          {votes.length} of {players.length} players have voted
        </div>
      </div>
    </div>
  );
};

interface VotingCardProps {
  player: Player;
  onVote: (confidence: number, reasoning?: string) => void;
}

const VotingCard: React.FC<VotingCardProps> = ({ player, onVote }) => {
  const [confidence, setConfidence] = useState(5);
  const [reasoning, setReasoning] = useState('');
  const [showReasoning, setShowReasoning] = useState(false);

  return (
    <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h5 className="font-medium">{player.name}</h5>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            "{player.story}"
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-2">
            Confidence they were lying (1-10):
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={confidence}
            onChange={(e) => setConfidence(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1 - Definitely truthful</span>
            <span className="font-medium">{confidence}</span>
            <span>10 - Definitely lying</span>
          </div>
        </div>

        <div>
          <button
            type="button"
            onClick={() => setShowReasoning(!showReasoning)}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            {showReasoning ? 'Hide' : 'Add'} reasoning (optional)
          </button>
          {showReasoning && (
            <textarea
              value={reasoning}
              onChange={(e) => setReasoning(e.target.value)}
              placeholder="Why do you suspect this person? What seemed off about their story?"
              className="w-full mt-2 p-2 text-sm border rounded resize-none"
              rows={2}
            />
          )}
        </div>

        <Button
          size="sm"
          onClick={() => onVote(confidence, reasoning)}
          className="w-full"
        >
          Vote for {player.name}
        </Button>
      </div>
    </div>
  );
};