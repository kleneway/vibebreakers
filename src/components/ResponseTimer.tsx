"use client";

import React, { useEffect } from "react";
import { ResponseTimerProps } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Clock, MessageCircle, HelpCircle } from "lucide-react";

export const ResponseTimer: React.FC<ResponseTimerProps> = ({
  totalTime,
  timeRemaining,
  phase,
  onTimeUp,
}: ResponseTimerProps) => {
  const progress = (timeRemaining / totalTime) * 100;
  const isLowTime = timeRemaining <= 10;
  const isVeryLowTime = timeRemaining <= 5;

  useEffect(() => {
    if (timeRemaining === 0) {
      onTimeUp();
    }
  }, [timeRemaining, onTimeUp]);

  const getPhaseConfig = () => {
    switch (phase) {
      case "answer":
        return {
          icon: MessageCircle,
          title: "Answer Time",
          subtitle: "Share your response",
          color: "bg-blue-500",
          ringColor: "ring-blue-500",
        };
      case "question":
        return {
          icon: HelpCircle,
          title: "Question Time",
          subtitle: "Ask your question",
          color: "bg-purple-500",
          ringColor: "ring-purple-500",
        };
      default:
        return {
          icon: Clock,
          title: "Timer",
          subtitle: "Get ready",
          color: "bg-neutral-500",
          ringColor: "ring-neutral-500",
        };
    }
  };

  const config = getPhaseConfig();
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center space-y-4 p-6 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-sm">
      {/* Timer Circle */}
      <div
        className={cn(
          "relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300",
          config.color,
          isLowTime && "animate-pulse",
          isVeryLowTime && `ring-4 ${config.ringColor} ring-opacity-50`,
        )}
      >
        <Icon className="w-8 h-8 text-white" />

        {/* Progress Ring */}
        <svg className="absolute inset-0 w-24 h-24 -rotate-90">
          <circle
            cx="48"
            cy="48"
            r="44"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="4"
            fill="none"
          />
          <circle
            cx="48"
            cy="48"
            r="44"
            stroke="white"
            strokeWidth="4"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 44}`}
            strokeDashoffset={`${2 * Math.PI * 44 * (1 - progress / 100)}`}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
      </div>

      {/* Timer Display */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
          {config.title}
        </h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
          {config.subtitle}
        </p>
        <div
          className={cn(
            "text-3xl font-bold transition-colors duration-300",
            isVeryLowTime
              ? "text-red-500"
              : isLowTime
              ? "text-orange-500"
              : "text-neutral-800 dark:text-neutral-200",
          )}
        >
          {timeRemaining}s
        </div>
      </div>

      {/* Phase Indicator */}
      <div className="flex items-center space-x-2 text-sm text-neutral-600 dark:text-neutral-400">
        <div
          className={cn(
            "w-2 h-2 rounded-full",
            phase === "answer"
              ? config.color
              : "bg-neutral-300 dark:bg-neutral-600",
          )}
        />
        <span className={phase === "answer" ? "font-medium" : ""}>Answer</span>
        <div className="w-4 h-px bg-neutral-300 dark:bg-neutral-600" />
        <div
          className={cn(
            "w-2 h-2 rounded-full",
            phase === "question"
              ? config.color
              : "bg-neutral-300 dark:bg-neutral-600",
          )}
        />
        <span className={phase === "question" ? "font-medium" : ""}>
          Question
        </span>
      </div>
    </div>
  );
};
