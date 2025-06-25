"use client";

import React, { useState, useEffect } from 'react';
import { Clock, Play, Pause, RotateCcw } from 'lucide-react';

interface TimerProps {
  duration: number; // in seconds
  onTimeUp?: () => void;
  autoStart?: boolean;
  showControls?: boolean;
}

export const Timer: React.FC<TimerProps> = ({
  duration,
  onTimeUp,
  autoStart = true,
  showControls = true
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsFinished(true);
            onTimeUp?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, onTimeUp]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    return ((duration - timeLeft) / duration) * 100;
  };

  const getStatusColor = () => {
    if (isFinished) return 'text-red-600 dark:text-red-400';
    if (timeLeft <= 10) return 'text-orange-600 dark:text-orange-400';
    if (timeLeft <= 30) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  const getProgressColor = () => {
    if (timeLeft <= 10) return 'bg-red-500';
    if (timeLeft <= 30) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const handlePlayPause = () => {
    if (isFinished) return;
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setTimeLeft(duration);
    setIsRunning(false);
    setIsFinished(false);
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 shadow-lg border">
      <div className="flex items-center gap-3 mb-3">
        <Clock className="w-5 h-5 text-gray-500" />
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
          Timer
        </span>
      </div>

      <div className="space-y-3">
        {/* Time Display */}
        <div className="text-center">
          <div className={`text-3xl font-bold ${getStatusColor()}`}>
            {formatTime(timeLeft)}
          </div>
          {isFinished && (
            <div className="text-sm text-red-600 dark:text-red-400 font-medium">
              Time's up!
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-1000 ${getProgressColor()}`}
            style={{ width: `${getProgress()}%` }}
          />
        </div>

        {/* Controls */}
        {showControls && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={handlePlayPause}
              disabled={isFinished}
              className={`flex items-center gap-1 px-3 py-2 rounded text-sm font-medium transition-colors ${
                isFinished
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                  : isRunning
                  ? 'bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-900/20 dark:text-orange-400'
                  : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-4 h-4" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  {isFinished ? 'Finished' : 'Start'}
                </>
              )}
            </button>

            <button
              onClick={handleReset}
              className="flex items-center gap-1 px-3 py-2 rounded text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        )}

        {/* Status Messages */}
        <div className="text-center text-xs text-gray-500 dark:text-gray-400">
          {isRunning && (
            <span className="flex items-center justify-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Timer is running
            </span>
          )}
          {!isRunning && !isFinished && timeLeft < duration && (
            <span>Timer paused</span>
          )}
          {isFinished && (
            <span className="text-red-500 dark:text-red-400">
              Timer completed
            </span>
          )}
        </div>
      </div>
    </div>
  );
};