"use client";

import React, { useState, useRef } from 'react';
import { EmpathyScenario, PlayerPrediction } from '@/lib/types';
import { Button } from './Button';
import { SpeechToTextArea, SpeechToTextAreaRef } from './SpeechToTextArea';
import { motion, AnimatePresence } from 'framer-motion';

interface PredictionInterfaceProps {
  scenario: EmpathyScenario;
  participants: string[];
  currentPlayerId: string;
  onSubmit: (predictions: PlayerPrediction[]) => void;
  onComplete?: () => void;
}

interface PredictionForm {
  targetPlayerId: string;
  predictedResponse: string;
  confidence: number;
  reasoning: string;
}

export const PredictionInterface: React.FC<PredictionInterfaceProps> = ({
  scenario,
  participants,
  currentPlayerId,
  onSubmit,
  onComplete
}) => {
  const [currentTarget, setCurrentTarget] = useState(0);
  const [predictions, setPredictions] = useState<PredictionForm[]>([]);
  const [currentPrediction, setCurrentPrediction] = useState<PredictionForm>({
    targetPlayerId: '',
    predictedResponse: '',
    confidence: 5,
    reasoning: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const speechRef = useRef<SpeechToTextAreaRef>(null);

  // Filter out current player from participants
  const otherParticipants = participants.filter(p => p !== currentPlayerId);

  React.useEffect(() => {
    if (otherParticipants.length > 0 && currentTarget < otherParticipants.length) {
      setCurrentPrediction(prev => ({
        ...prev,
        targetPlayerId: otherParticipants[currentTarget]
      }));
    }
  }, [currentTarget, otherParticipants]);

  const handlePredictionChange = (field: keyof PredictionForm, value: string | number) => {
    setCurrentPrediction(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNextPrediction = () => {
    if (currentPrediction.predictedResponse.trim()) {
      setPredictions(prev => [...prev, currentPrediction]);
      
      if (currentTarget < otherParticipants.length - 1) {
        setCurrentTarget(prev => prev + 1);
        setCurrentPrediction({
          targetPlayerId: '',
          predictedResponse: '',
          confidence: 5,
          reasoning: ''
        });
        speechRef.current?.clear();
      } else {
        handleSubmitAll();
      }
    }
  };

  const handleSubmitAll = async () => {
    setIsSubmitting(true);
    
    const finalPredictions = [...predictions];
    if (currentPrediction.predictedResponse.trim()) {
      finalPredictions.push(currentPrediction);
    }

    const playerPredictions: PlayerPrediction[] = finalPredictions.map(pred => ({
      playerId: currentPlayerId,
      targetPlayerId: pred.targetPlayerId,
      predictedResponse: pred.predictedResponse,
      confidence: pred.confidence,
      reasoning: pred.reasoning
    }));

    onSubmit(playerPredictions);
    
    setTimeout(() => {
      setIsSubmitting(false);
      onComplete?.();
    }, 1000);
  };

  const isCurrentPredictionComplete = currentPrediction.predictedResponse.trim().length > 0;
  const isLastPrediction = currentTarget === otherParticipants.length - 1;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-aurora-500 to-blossom-500 p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold">Make Your Predictions</h3>
            <p className="text-white/80">
              Predict how {otherParticipants[currentTarget]} will respond
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-white/80">Progress</div>
            <div className="text-lg font-bold">
              {currentTarget + 1} of {otherParticipants.length}
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Prediction Progress
            </span>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {Math.round(((currentTarget + (isCurrentPredictionComplete ? 1 : 0)) / otherParticipants.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <motion.div 
              className="bg-gradient-to-r from-aurora-500 to-blossom-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ 
                width: `${((currentTarget + (isCurrentPredictionComplete ? 1 : 0)) / otherParticipants.length) * 100}%`
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Scenario Reminder */}
        <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-4 mb-6">
          <h4 className="font-medium text-slate-800 dark:text-white mb-2">Scenario:</h4>
          <p className="text-sm text-slate-600 dark:text-slate-300">{scenario.description}</p>
        </div>

        <AnimatePresence mode="wait">
          {otherParticipants.length > 0 && currentTarget < otherParticipants.length && (
            <motion.div
              key={currentTarget}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Current Target */}
              <div className="bg-aurora-50 dark:bg-aurora-900/20 rounded-xl p-6 mb-6">
                <h4 className="text-lg font-semibold text-aurora-800 dark:text-aurora-200 mb-2">
                  Predicting for: {otherParticipants[currentTarget]}
                </h4>
                <p className="text-sm text-aurora-700 dark:text-aurora-300">
                  How do you think they will respond to this scenario?
                </p>
              </div>

              {/* Prediction Input */}
              <div className="space-y-6">
                {/* Response Prediction */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Predicted Response *
                  </label>
                  <SpeechToTextArea
                    ref={speechRef}
                    value={currentPrediction.predictedResponse}
                    onChange={(e) => handlePredictionChange('predictedResponse', e.target.value)}
                    placeholder={`How do you think ${otherParticipants[currentTarget]} will respond to this scenario?`}
                    isLoading={false}
                    minHeight="100px"
                    shouldSubmitOnEnter={false}
                  />
                </div>

                {/* Confidence Rating */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Confidence Level: {currentPrediction.confidence}/10
                  </label>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-slate-500">Low</span>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={currentPrediction.confidence}
                      onChange={(e) => handlePredictionChange('confidence', parseInt(e.target.value))}
                      className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700"
                    />
                    <span className="text-sm text-slate-500">High</span>
                  </div>
                  <div className="mt-2 text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-aurora-100 text-aurora-800 dark:bg-aurora-900 dark:text-aurora-200">
                      {currentPrediction.confidence <= 3 ? 'Not very confident' :
                       currentPrediction.confidence <= 6 ? 'Somewhat confident' :
                       currentPrediction.confidence <= 8 ? 'Quite confident' : 'Very confident'}
                    </span>
                  </div>
                </div>

                {/* Optional Reasoning */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Your Reasoning (Optional)
                  </label>
                  <textarea
                    value={currentPrediction.reasoning}
                    onChange={(e) => handlePredictionChange('reasoning', e.target.value)}
                    placeholder="Why do you think they'll respond this way? What do you know about their values or past decisions?"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-aurora-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white resize-none"
                    rows={3}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center mt-8">
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  {predictions.length > 0 && (
                    <span>
                      {predictions.length} prediction{predictions.length !== 1 ? 's' : ''} completed
                    </span>
                  )}
                </div>
                
                <Button
                  onClick={handleNextPrediction}
                  disabled={!isCurrentPredictionComplete || isSubmitting}
                  className="min-w-[120px]"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Submitting...</span>
                    </div>
                  ) : (
                    isLastPrediction ? 'Submit All' : 'Next Person'
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Completed Predictions Summary */}
        {predictions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-600"
          >
            <h4 className="font-semibold text-slate-800 dark:text-white mb-4">
              Completed Predictions:
            </h4>
            <div className="space-y-2">
              {predictions.map((pred, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between py-2 px-3 bg-slate-50 dark:bg-slate-700 rounded-lg"
                >
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {pred.targetPlayerId}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Confidence: {pred.confidence}/10
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};