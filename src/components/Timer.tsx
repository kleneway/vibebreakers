"use client";

import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface TimerProps {
  duration: number; // in seconds
  onTimeUp: () => void;
  isActive: boolean;
  onReset?: () => void;
  size?: "sm" | "md" | "lg";
  showProgress?: boolean;
}

export const Timer: React.FC<TimerProps> = ({
  duration,
  onTimeUp,
  isActive,
  onReset,
  size = "md",
  showProgress = true,
}) => {
  const [timeRemaining, setTimeRemaining] = useState(duration);

  useEffect(() => {
    setTimeRemaining(duration);
  }, [duration]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            onTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeRemaining, onTimeUp]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getProgressPercentage = (): number => {
    return ((duration - timeRemaining) / duration) * 100;
  };

  const getColorClass = (): string => {
    const percentage = (timeRemaining / duration) * 100;
    if (percentage > 50) return "text-green-600 dark:text-green-400";
    if (percentage > 20) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getProgressColorClass = (): string => {
    const percentage = (timeRemaining / duration) * 100;
    if (percentage > 50) return "bg-green-500";
    if (percentage > 20) return "bg-yellow-500";
    return "bg-red-500";
  };

  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl",
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <div
        className={`flex items-center space-x-2 ${getColorClass()} ${
          sizeClasses[size]
        } font-mono font-bold`}
      >
        <Clock size={iconSizes[size]} />
        <span>{formatTime(timeRemaining)}</span>
      </div>

      {showProgress && (
        <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-1000 ${getProgressColorClass()}`}
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>
      )}

      {timeRemaining === 0 && (
        <div className="text-red-600 dark:text-red-400 font-semibold animate-pulse">
          Time's Up!
        </div>
      )}
    </div>
  );
};
