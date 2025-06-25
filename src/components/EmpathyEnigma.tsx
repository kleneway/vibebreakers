"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { EmpathyGameState, EmpathyScenario, PlayerPrediction, PlayerResponse } from '@/lib/types';
import { ScenarioPresenter } from './ScenarioPresenter';
import { PredictionInterface } from './PredictionInterface';
import { ResponseCollector } from './ResponseCollector';
import { EmpathyAnalyzer } from './EmpathyAnalyzer';
import { Button } from './Button';
import { motion, AnimatePresence } from 'framer-motion';

interface EmpathyEnigmaProps {
  participants: string[];
  onGameComplete?: (results: any) => void;
}

const SCENARIOS: EmpathyScenario[] = [
  {
    id: '1',
    title: 'The Found Wallet Dilemma',
    description: 'You find a wallet with $500 cash and an ID. The address is 20 minutes away, you\'re late for an important meeting, and there\'s no phone number. What do you do?',
    category: 'ethical',
    difficulty: 2
  },
  {
    id: '2',
    title: 'The Surprise Party Secret',
    description: 'Your best friend asks you to lie to their partner about their whereabouts. You know they\'re planning a surprise party. How do you handle this?',
    category: 'social',
    difficulty: 1
  },
  {
    id: '3',
    title: 'Dream Job vs Family Care',
    description: 'You\'re offered a dream job that requires moving across the country, but your aging parent needs daily care. What factors do you consider most important?',
    category: 'personal',
    difficulty: 3
  },
  {
    id: '4',
    title: 'Group Project Deadline Crisis',
    description: 'Your team member hasn\'t contributed to a critical project due tomorrow. You could do their work yourself or report them to your supervisor. What do you choose?',
    category: 'social',
    difficulty: 2
  },
  {
    id: '5',
    title: 'Financial Windfall Decision',
    description: 'You unexpectedly inherit $50,000. You have student loans, your friend needs help with medical bills, and you\'ve wanted to travel. How do you allocate this money?',
    category: 'resource',
    difficulty: 2
  }
];

const PHASE_DURATIONS = {
  scenario: 60, // 1 minute
  prediction: 120, // 2 minutes
  response: 90, // 1.5 minutes
  analysis: 180, // 3 minutes
  discussion: 240 // 4 minutes
};

export const EmpathyEnigma: React.FC<EmpathyEnigmaProps> = ({
  participants,
  onGameComplete
}) => {
  const [gameState, setGameState] = useState<EmpathyGameState>({
    phase: 'setup',
    currentScenario: null,
    participants,
    predictions: [],
    responses: [],
    accuracy: [],
    timeRemaining: 0,
    roundNumber: 1,
    totalRounds: 3
  });

  const [currentPlayerId, setCurrentPlayerId] = useState<string>('');

  const startGame = useCallback(() => {
    const randomScenario = SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)];
    setGameState(prev => ({
      ...prev,
      phase: 'scenario',
      currentScenario: randomScenario,
      timeRemaining: PHASE_DURATIONS.scenario
    }));
  }, []);

  const nextPhase = useCallback(() => {
    setGameState(prev => {
      switch (prev.phase) {
        case 'scenario':
          return {
            ...prev,
            phase: 'prediction',
            timeRemaining: PHASE_DURATIONS.prediction
          };
        case 'prediction':
          return {
            ...prev,
            phase: 'response',
            timeRemaining: PHASE_DURATIONS.response
          };
        case 'response':
          return {
            ...prev,
            phase: 'analysis',
            timeRemaining: PHASE_DURATIONS.analysis
          };
        case 'analysis':
          return {
            ...prev,
            phase: 'discussion',
            timeRemaining: PHASE_DURATIONS.discussion
          };
        case 'discussion':
          if (prev.roundNumber < prev.totalRounds) {
            const nextScenario = SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)];
            return {
              ...prev,
              phase: 'scenario',
              currentScenario: nextScenario,
              roundNumber: prev.roundNumber + 1,
              predictions: [],
              responses: [],
              accuracy: [],
              timeRemaining: PHASE_DURATIONS.scenario
            };
          } else {
            return {
              ...prev,
              phase: 'complete',
              timeRemaining: 0
            };
          }
        default:
          return prev;
      }
    });
  }, []);

  const handlePredictionSubmit = useCallback((predictions: PlayerPrediction[]) => {
    setGameState(prev => ({
      ...prev,
      predictions: [...prev.predictions, ...predictions]
    }));
  }, []);

  const handleResponseSubmit = useCallback((response: PlayerResponse) => {
    setGameState(prev => ({
      ...prev,
      responses: [...prev.responses, response]
    }));
  }, []);

  // Timer countdown
  useEffect(() => {
    if (gameState.timeRemaining > 0) {
      const timer = setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          timeRemaining: prev.timeRemaining - 1
        }));
      }, 1000);

      return () => clearTimeout(timer);
    } else if (gameState.timeRemaining === 0 && gameState.phase !== 'setup' && gameState.phase !== 'complete') {
      nextPhase();
    }
  }, [gameState.timeRemaining, gameState.phase, nextPhase]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseTitle = (): string => {
    switch (gameState.phase) {
      case 'setup': return 'Welcome to Empathy Enigma';
      case 'scenario': return 'Understanding the Scenario';
      case 'prediction': return 'Predicting Others\' Responses';
      case 'response': return 'Sharing Your Response';
      case 'analysis': return 'Analyzing Predictions';
      case 'discussion': return 'Group Discussion';
      case 'complete': return 'Game Complete';
      default: return '';
    }
  };

  const getPhaseDescription = (): string => {
    switch (gameState.phase) {
      case 'setup': return 'Get ready to explore how well you understand others\' decision-making processes.';
      case 'scenario': return 'Read and understand the current dilemma. Think about how you and others might respond.';
      case 'prediction': return 'Predict how other participants will respond to this scenario.';
      case 'response': return 'Share your own response to the scenario and explain your reasoning.';
      case 'analysis': return 'See how well you predicted others\' responses and discover surprising insights.';
      case 'discussion': return 'Discuss the results and explore what you learned about each other.';
      case 'complete': return 'Thank you for playing! Reflect on the insights you\'ve gained.';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-aurora-50 via-white to-blossom-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1 
            className="text-4xl font-bold text-slate-800 dark:text-white mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Empathy Enigma
          </motion.h1>
          <motion.p 
            className="text-lg text-slate-600 dark:text-slate-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Round {gameState.roundNumber} of {gameState.totalRounds}
          </motion.p>
        </div>

        {/* Phase Header */}
        <motion.div 
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 mb-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-800 dark:text-white">
                {getPhaseTitle()}
              </h2>
              <p className="text-slate-600 dark:text-slate-300 mt-1">
                {getPhaseDescription()}
              </p>
            </div>
            {gameState.timeRemaining > 0 && (
              <div className="text-right">
                <div className="text-3xl font-mono font-bold text-aurora-600 dark:text-aurora-400">
                  {formatTime(gameState.timeRemaining)}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Time Remaining
                </div>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <motion.div 
              className="bg-gradient-to-r from-aurora-500 to-blossom-500 h-2 rounded-full"
              style={{ 
                width: `${((gameState.roundNumber - 1) * 5 + ['setup', 'scenario', 'prediction', 'response', 'analysis', 'discussion'].indexOf(gameState.phase)) / (gameState.totalRounds * 5) * 100}%`
              }}
              initial={{ width: 0 }}
              animate={{ 
                width: `${((gameState.roundNumber - 1) * 5 + ['setup', 'scenario', 'prediction', 'response', 'analysis', 'discussion'].indexOf(gameState.phase)) / (gameState.totalRounds * 5) * 100}%`
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>

        {/* Game Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={gameState.phase}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {gameState.phase === 'setup' && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 text-center">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">
                    Participants ({participants.length})
                  </h3>
                  <div className="flex flex-wrap justify-center gap-2">
                    {participants.map((participant, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-aurora-100 dark:bg-aurora-900 text-aurora-800 dark:text-aurora-200 rounded-full text-sm"
                      >
                        {participant}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <h4 className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-3">
                    How to Play:
                  </h4>
                  <div className="text-left space-y-2 text-slate-600 dark:text-slate-400">
                    <p>1. <strong>Scenario:</strong> Read a complex dilemma together</p>
                    <p>2. <strong>Predict:</strong> Guess how others will respond</p>
                    <p>3. <strong>Respond:</strong> Share your own decision</p>
                    <p>4. <strong>Analyze:</strong> See how well you predicted others</p>
                    <p>5. <strong>Discuss:</strong> Explore insights and surprises</p>
                  </div>
                </div>

                <Button onClick={startGame} size="lg">
                  Start Game
                </Button>
              </div>
            )}

            {gameState.phase === 'scenario' && gameState.currentScenario && (
              <ScenarioPresenter 
                scenario={gameState.currentScenario}
                onReady={nextPhase}
              />
            )}

            {gameState.phase === 'prediction' && gameState.currentScenario && (
              <PredictionInterface
                scenario={gameState.currentScenario}
                participants={participants}
                currentPlayerId={currentPlayerId}
                onSubmit={handlePredictionSubmit}
                onComplete={nextPhase}
              />
            )}

            {gameState.phase === 'response' && gameState.currentScenario && (
              <ResponseCollector
                scenario={gameState.currentScenario}
                currentPlayerId={currentPlayerId}
                onSubmit={handleResponseSubmit}
                onComplete={nextPhase}
              />
            )}

            {gameState.phase === 'analysis' && (
              <EmpathyAnalyzer
                predictions={gameState.predictions}
                responses={gameState.responses}
                participants={participants}
                onComplete={nextPhase}
              />
            )}

            {gameState.phase === 'discussion' && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-6">
                  Discussion Time
                </h3>
                <div className="space-y-4 text-slate-600 dark:text-slate-400">
                  <p>Take this time to discuss:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Which predictions surprised you the most?</li>
                    <li>What did you learn about others' decision-making?</li>
                    <li>How do different backgrounds influence responses?</li>
                    <li>What values seemed to drive different choices?</li>
                  </ul>
                </div>
                <div className="mt-8 text-center">
                  <Button onClick={nextPhase}>
                    {gameState.roundNumber < gameState.totalRounds ? 'Next Round' : 'Finish Game'}
                  </Button>
                </div>
              </div>
            )}

            {gameState.phase === 'complete' && (
              <div className="bg-gradient-to-r from-aurora-100 to-blossom-100 dark:from-aurora-900 dark:to-blossom-900 rounded-2xl shadow-lg p-8 text-center">
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
                  🎉 Game Complete!
                </h3>
                <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">
                  Thank you for exploring empathy and understanding together.
                </p>
                <div className="text-slate-600 dark:text-slate-400">
                  <p>Key takeaways from today's session:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Understanding others requires looking beyond surface reactions</li>
                    <li>Different life experiences shape how we approach decisions</li>
                    <li>Empathy grows through genuine curiosity about others' perspectives</li>
                  </ul>
                </div>
                {onGameComplete && (
                  <Button onClick={() => onGameComplete(gameState)} className="mt-6">
                    Save Results
                  </Button>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};