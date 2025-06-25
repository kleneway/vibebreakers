"use client";

import React, { useState, useEffect } from "react";

interface TimerProps {
  duration: number; // duration in seconds
  isActive: boolean;
  onComplete: () => void;
  size?: "small" | "medium" | "large";
}

export const Timer: React.FC<TimerProps> = ({ 
  duration, 
  isActive, 
  onComplete, 
  size = "medium" 
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            onComplete();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, onComplete]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = (): number => {
    return ((duration - timeLeft) / duration) * 100;
  };

  const getColorClass = (): string => {
    const percentRemaining = (timeLeft / duration) * 100;
    if (percentRemaining > 50) return "text-green-600 border-green-500";
    if (percentRemaining > 20) return "text-yellow-600 border-yellow-500";
    return "text-red-600 border-red-500";
  };

  const getSizeClasses = (): string => {
    switch (size) {
      case "small":
        return "w-16 h-16 text-sm";
      case "large":
        return "w-32 h-32 text-2xl";
      default:
        return "w-24 h-24 text-lg";
    }
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className={`${getSizeClasses()} ${getColorClass()} relative rounded-full border-4 flex items-center justify-center font-bold bg-white dark:bg-gray-800`}>
        {/* Progress circle */}
        <svg 
          className="absolute inset-0 w-full h-full transform -rotate-90" 
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray={`${getProgress() * 2.827} 282.7`}
            className="opacity-20"
          />
        </svg>
        
        {/* Time display */}
        <span className="z-10">{formatTime(timeLeft)}</span>
      </div>
      
      {/* Status indicator */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {isActive ? (timeLeft === 0 ? "Time's up!" : "Timer running") : "Timer paused"}
      </div>
    </div>
  );
};