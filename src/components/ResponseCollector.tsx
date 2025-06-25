"use client";

import React, { useState, useRef } from 'react';
import { EmpathyScenario, PlayerResponse } from '@/lib/types';
import { Button } from './Button';
import { SpeechToTextArea, SpeechToTextAreaRef } from './SpeechToTextArea';
import { motion } from 'framer-motion';

interface ResponseCollectorProps {
  scenario: EmpathyScenario;
  currentPlayerId: string;
  onSubmit: (response: PlayerResponse) => void;
  onComplete?: () => void;
}

export const ResponseCollector: React.FC<ResponseCollectorProps> = ({
  scenario,
  currentPlayerId,
  onSubmit,
  onComplete
}) => {
  const [response, setResponse] = useState('');
  const [reasoning, setReasoning] = useState('');
  const [emotionalDifficulty, setEmotionalDifficulty] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const speechRef = useRef<SpeechToTextAreaRef>(null);

  const handleSubmit = async () => {
    if (!response.trim()) return;

    setIsSubmitting(true);

    const playerResponse: PlayerResponse = {
      playerId: currentPlayerId,
      response: response.trim(),
      reasoning: reasoning.trim(),
      emotionalDifficulty
    };

    onSubmit(playerResponse);

    setTimeout(() => {
      setIsSubmitting(false);
      onComplete?.();
    }, 1000);
  };

  const getDifficultyLabel = (difficulty: number): string => {
    if (difficulty <= 2) return 'Very Easy';
    if (difficulty <= 4) return 'Easy';
    if (difficulty <= 6) return 'Moderate';
    if (difficulty <= 8) return 'Difficult';
    return 'Very Difficult';
  };

  const getDifficultyColor = (difficulty: number): string => {
    if (difficulty <= 2) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    if (difficulty <= 4) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    if (difficulty <= 6) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    if (difficulty <= 8) return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blossom-500 to-aurora-500 p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold">Share Your Response</h3>
            <p className="text-white/80">
              How would you handle this situation?
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-white/80">Your Turn</div>
            <div className="text-lg font-bold">{currentPlayerId}</div>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Scenario Reminder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-50 dark:bg-slate-700 rounded-xl p-6 mb-8"
        >
          <h4 className="font-medium text-slate-800 dark:text-white mb-2">
            The Scenario:
          </h4>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            {scenario.description}
          </p>
        </motion.div>

        {/* Response Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-8"
        >
          {/* Main Response */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Your Response *
            </label>
            <div className="mb-2">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                What would you do in this situation? Be specific about your choice and approach.
              </p>
            </div>
            <SpeechToTextArea
              ref={speechRef}
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Describe what you would do and how you would approach this situation..."
              isLoading={false}
              minHeight="120px"
              shouldSubmitOnEnter={false}
            />
          </div>

          {/* Reasoning */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Your Reasoning (Optional)
            </label>
            <div className="mb-2">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                What factors influenced your decision? What values or principles guided you?
              </p>
            </div>
            <textarea
              value={reasoning}
              onChange={(e) => setReasoning(e.target.value)}
              placeholder="Explain your thought process, what factors you considered, and why you chose this approach..."
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blossom-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white resize-none transition-colors"
              rows={4}
            />
          </div>

          {/* Emotional Difficulty */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Emotional Difficulty: {emotionalDifficulty}/10
            </label>
            <div className="mb-3">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                How emotionally challenging was this decision for you?
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-slate-500 w-12 text-center">Easy</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={emotionalDifficulty}
                  onChange={(e) => setEmotionalDifficulty(parseInt(e.target.value))}
                  className="flex-1 h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 slider"
                />
                <span className="text-sm text-slate-500 w-12 text-center">Hard</span>
              </div>
              <div className="text-center">
                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getDifficultyColor(emotionalDifficulty)}`}>
                  {getDifficultyLabel(emotionalDifficulty)}
                </span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <Button
              onClick={handleSubmit}
              disabled={!response.trim() || isSubmitting}
              size="lg"
              className="min-w-[200px]"
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Submitting Response...</span>
                </div>
              ) : (
                'Submit My Response'
              )}
            </Button>
          </div>
        </motion.div>

        {/* Help Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 p-4 bg-blossom-50 dark:bg-blossom-900/20 rounded-xl"
        >
          <h5 className="font-medium text-blossom-800 dark:text-blossom-200 mb-2">
            💡 Tips for a thoughtful response:
          </h5>
          <ul className="text-sm text-blossom-700 dark:text-blossom-300 space-y-1">
            <li>• Be honest about what you would actually do, not what you think you should do</li>
            <li>• Consider both the immediate and long-term consequences</li>
            <li>• Think about which values or principles are most important to you</li>
            <li>• Don't worry about having the "right" answer - authenticity is more valuable</li>
          </ul>
        </motion.div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ec4899, #8b5cf6);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ec4899, #8b5cf6);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
};