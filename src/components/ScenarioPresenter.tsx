"use client";

import React, { useState } from 'react';
import { EmpathyScenario } from '@/lib/types';
import { Button } from './Button';
import { motion } from 'framer-motion';

interface ScenarioPresenterProps {
  scenario: EmpathyScenario;
  onReady?: () => void;
}

const getCategoryIcon = (category: string): string => {
  switch (category) {
    case 'ethical': return '⚖️';
    case 'personal': return '💭';
    case 'social': return '👥';
    case 'resource': return '💰';
    case 'communication': return '💬';
    default: return '🤔';
  }
};

const getCategoryColor = (category: string): string => {
  switch (category) {
    case 'ethical': return 'from-purple-500 to-purple-600';
    case 'personal': return 'from-blue-500 to-blue-600';
    case 'social': return 'from-green-500 to-green-600';
    case 'resource': return 'from-yellow-500 to-yellow-600';
    case 'communication': return 'from-pink-500 to-pink-600';
    default: return 'from-gray-500 to-gray-600';
  }
};

const getDifficultyStars = (difficulty: number): string => {
  return '⭐'.repeat(difficulty) + '☆'.repeat(3 - difficulty);
};

export const ScenarioPresenter: React.FC<ScenarioPresenterProps> = ({
  scenario,
  onReady
}) => {
  const [understood, setUnderstood] = useState(false);

  return (
    <motion.div 
      className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className={`bg-gradient-to-r ${getCategoryColor(scenario.category)} p-6 text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">{getCategoryIcon(scenario.category)}</span>
            <div>
              <h3 className="text-xl font-bold">{scenario.title}</h3>
              <p className="text-white/80 capitalize">{scenario.category} Dilemma</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-white/80">Difficulty</div>
            <div className="text-lg">{getDifficultyStars(scenario.difficulty)}</div>
          </div>
        </div>
      </div>

      {/* Scenario Content */}
      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h4 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
            The Situation:
          </h4>
          <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-6 mb-6">
            <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed">
              {scenario.description}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h4 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
            Think About:
          </h4>
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div className="bg-aurora-50 dark:bg-aurora-900/20 rounded-lg p-4">
              <h5 className="font-medium text-aurora-800 dark:text-aurora-200 mb-2">
                Your Response
              </h5>
              <p className="text-sm text-aurora-700 dark:text-aurora-300">
                What would you do in this situation? What factors would influence your decision?
              </p>
            </div>
            <div className="bg-blossom-50 dark:bg-blossom-900/20 rounded-lg p-4">
              <h5 className="font-medium text-blossom-800 dark:text-blossom-200 mb-2">
                Others' Responses
              </h5>
              <p className="text-sm text-blossom-700 dark:text-blossom-300">
                How might others approach this differently? What might drive their decisions?
              </p>
            </div>
          </div>
        </motion.div>

        {/* Understanding Check */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-slate-100 dark:bg-slate-700 rounded-xl p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <input
              type="checkbox"
              id="understood"
              checked={understood}
              onChange={(e) => setUnderstood(e.target.checked)}
              className="w-5 h-5 text-aurora-600 bg-gray-100 border-gray-300 rounded focus:ring-aurora-500 dark:focus:ring-aurora-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label 
              htmlFor="understood" 
              className="text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              I understand the scenario and am ready to make predictions
            </label>
          </div>
          
          {onReady && (
            <Button 
              onClick={onReady}
              disabled={!understood}
              className={`transition-all duration-200 ${!understood ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Ready to Predict Others' Responses
            </Button>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};