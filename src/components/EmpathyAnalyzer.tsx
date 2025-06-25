"use client";

import React, { useState, useEffect } from 'react';
import { PlayerPrediction, PlayerResponse, PredictionAccuracy } from '@/lib/types';
import { Button } from './Button';
import { motion, AnimatePresence } from 'framer-motion';

interface EmpathyAnalyzerProps {
  predictions: PlayerPrediction[];
  responses: PlayerResponse[];
  participants: string[];
  onComplete?: () => void;
}

interface AnalysisResult {
  accuracy: PredictionAccuracy[];
  insights: {
    bestPredictor: string;
    mostSurprising: string;
    highestAccuracy: number;
    commonPatterns: string[];
  };
}

export const EmpathyAnalyzer: React.FC<EmpathyAnalyzerProps> = ({
  predictions,
  responses,
  participants,
  onComplete
}) => {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [currentView, setCurrentView] = useState<'accuracy' | 'insights' | 'summary'>('accuracy');
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  useEffect(() => {
    analyzeResults();
  }, [predictions, responses]);

  const analyzeResults = () => {
    setIsAnalyzing(true);
    
    // Simulate analysis time
    setTimeout(() => {
      const accuracy = calculateAccuracy();
      const insights = generateInsights(accuracy);
      
      setAnalysis({
        accuracy,
        insights
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  const calculateAccuracy = (): PredictionAccuracy[] => {
    const accuracyResults: PredictionAccuracy[] = [];

    predictions.forEach(prediction => {
      const actualResponse = responses.find(r => r.playerId === prediction.targetPlayerId);
      
      if (actualResponse) {
        // Simple similarity scoring based on key words and sentiment
        const score = calculateSimilarityScore(prediction.predictedResponse, actualResponse.response);
        const isSurprising = Math.abs(score - (prediction.confidence * 10)) > 30;

        accuracyResults.push({
          playerId: prediction.playerId,
          targetPlayerId: prediction.targetPlayerId,
          prediction: prediction.predictedResponse,
          actualResponse: actualResponse.response,
          accuracyScore: score,
          surprise: isSurprising
        });
      }
    });

    return accuracyResults;
  };

  const calculateSimilarityScore = (prediction: string, actual: string): number => {
    // Simple keyword-based similarity scoring
    const predictionWords = prediction.toLowerCase().split(/\s+/);
    const actualWords = actual.toLowerCase().split(/\s+/);
    
    let matches = 0;
    predictionWords.forEach(word => {
      if (actualWords.some(actualWord => actualWord.includes(word) || word.includes(actualWord))) {
        matches++;
      }
    });
    
    // Score based on word overlap and length similarity
    const overlapScore = (matches / Math.max(predictionWords.length, actualWords.length)) * 100;
    const lengthSimilarity = Math.min(prediction.length, actual.length) / Math.max(prediction.length, actual.length);
    
    return Math.round((overlapScore * 0.7 + lengthSimilarity * 30));
  };

  const generateInsights = (accuracy: PredictionAccuracy[]) => {
    // Find best predictor
    const predictorScores = new Map<string, number[]>();
    accuracy.forEach(result => {
      if (!predictorScores.has(result.playerId)) {
        predictorScores.set(result.playerId, []);
      }
      predictorScores.get(result.playerId)!.push(result.accuracyScore);
    });

    let bestPredictor = '';
    let highestAverage = 0;
    predictorScores.forEach((scores, playerId) => {
      const average = scores.reduce((a, b) => a + b, 0) / scores.length;
      if (average > highestAverage) {
        highestAverage = average;
        bestPredictor = playerId;
      }
    });

    // Find most surprising result
    const surprisingResults = accuracy.filter(r => r.surprise);
    const mostSurprising = surprisingResults.length > 0 ? 
      surprisingResults[0].targetPlayerId : participants[0];

    // Generate common patterns
    const patterns = [
      'People tend to prioritize relationships over rules',
      'Practical solutions are often preferred over idealistic ones',
      'Personal experience strongly influences decision-making',
      'Individual values show more diversity than expected'
    ];

    return {
      bestPredictor,
      mostSurprising,
      highestAccuracy: Math.round(highestAverage),
      commonPatterns: patterns.slice(0, 2)
    };
  };

  const getAccuracyColor = (score: number): string => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    if (score >= 40) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getAccuracyBadge = (score: number): string => {
    if (score >= 80) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    if (score >= 40) return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  };

  if (isAnalyzing) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-aurora-500 mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
            Analyzing Predictions...
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            Comparing your predictions with actual responses
          </p>
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold">Empathy Analysis</h3>
            <p className="text-white/80">
              See how well you understood others
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-white/80">Average Accuracy</div>
            <div className="text-2xl font-bold">
              {analysis.insights.highestAccuracy}%
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="border-b border-slate-200 dark:border-slate-700">
        <div className="flex">
          {[
            { key: 'accuracy', label: 'Accuracy Results' },
            { key: 'insights', label: 'Key Insights' },
            { key: 'summary', label: 'Summary' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setCurrentView(tab.key as any)}
              className={`px-6 py-4 text-sm font-medium transition-colors ${
                currentView === tab.key
                  ? 'border-b-2 border-purple-500 text-purple-600 dark:text-purple-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-8">
        <AnimatePresence mode="wait">
          {currentView === 'accuracy' && (
            <motion.div
              key="accuracy"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h4 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">
                Prediction Accuracy
              </h4>
              <div className="space-y-4">
                {analysis.accuracy.map((result, index) => (
                  <div 
                    key={index}
                    className="bg-slate-50 dark:bg-slate-700 rounded-xl p-6"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h5 className="font-medium text-slate-800 dark:text-white">
                          {result.playerId} predicted {result.targetPlayerId}
                        </h5>
                        {result.surprise && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 mt-1">
                            Surprising!
                          </span>
                        )}
                      </div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getAccuracyBadge(result.accuracyScore)}`}>
                        {result.accuracyScore}% match
                      </span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h6 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                          Prediction:
                        </h6>
                        <p className="text-sm text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-600 p-3 rounded-lg">
                          {result.prediction}
                        </p>
                      </div>
                      <div>
                        <h6 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                          Actual Response:
                        </h6>
                        <p className="text-sm text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-600 p-3 rounded-lg">
                          {result.actualResponse}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {currentView === 'insights' && (
            <motion.div
              key="insights"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h4 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">
                Key Insights
              </h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6">
                    <h5 className="font-medium text-green-800 dark:text-green-200 mb-2">
                      🏆 Best Predictor
                    </h5>
                    <p className="text-green-700 dark:text-green-300">
                      <strong>{analysis.insights.bestPredictor}</strong> showed the highest average accuracy in understanding others.
                    </p>
                  </div>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6">
                    <h5 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                      ⚡ Most Surprising
                    </h5>
                    <p className="text-yellow-700 dark:text-yellow-300">
                      <strong>{analysis.insights.mostSurprising}</strong>'s response was the most unexpected to others.
                    </p>
                  </div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
                  <h5 className="font-medium text-blue-800 dark:text-blue-200 mb-3">
                    🔍 Common Patterns
                  </h5>
                  <ul className="space-y-2 text-blue-700 dark:text-blue-300">
                    {analysis.insights.commonPatterns.map((pattern, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>{pattern}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {currentView === 'summary' && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h4 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">
                Round Summary
              </h4>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                    {analysis.insights.highestAccuracy}%
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">
                    Average prediction accuracy this round
                  </p>
                </div>
                <div className="space-y-4 text-slate-700 dark:text-slate-300">
                  <p>
                    <strong>What this means:</strong> Understanding others' decision-making is complex and requires looking beyond surface-level assumptions.
                  </p>
                  <p>
                    <strong>Key learning:</strong> Even people we know well can surprise us with their responses to ethical and personal dilemmas.
                  </p>
                  <p>
                    <strong>Moving forward:</strong> Use these insights to ask better questions and listen more deeply to understand others' perspectives.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 text-center">
          <Button onClick={onComplete} size="lg">
            Continue to Discussion
          </Button>
        </div>
      </div>
    </div>
  );
};