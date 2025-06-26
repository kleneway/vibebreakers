"use client";

import React from "react";
import { DepthMeterProps } from "@/lib/types";
import { cn } from "@/lib/utils";

export const DepthMeter: React.FC<DepthMeterProps> = ({
  currentLevel,
  maxLevel,
  levels,
}: DepthMeterProps) => {
  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-sm">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
          Conversation Depth
        </h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Level {currentLevel} of {maxLevel}
        </p>
      </div>

      <div className="space-y-2">
        {levels.map((level, index) => (
          <div
            key={level.level}
            className={cn(
              "flex items-center p-3 rounded-lg border transition-all duration-300",
              currentLevel >= level.level
                ? "border-transparent shadow-sm"
                : "border-neutral-200 dark:border-neutral-600",
              currentLevel === level.level
                ? "scale-105 ring-2 ring-blue-500 ring-opacity-50"
                : "",
            )}
            style={{
              backgroundColor:
                currentLevel >= level.level ? level.color : "transparent",
            }}
          >
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "font-medium text-sm",
                    currentLevel >= level.level
                      ? "text-white"
                      : "text-neutral-800 dark:text-neutral-200",
                  )}
                >
                  {level.name}
                </span>
                <div
                  className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center",
                    currentLevel >= level.level
                      ? "border-white bg-white"
                      : "border-neutral-300 dark:border-neutral-600",
                  )}
                >
                  {currentLevel >= level.level && (
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  )}
                </div>
              </div>
              <p
                className={cn(
                  "text-xs mt-1",
                  currentLevel >= level.level
                    ? "text-white/80"
                    : "text-neutral-600 dark:text-neutral-400",
                )}
              >
                {level.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 bg-neutral-100 dark:bg-neutral-700 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
          style={{ width: `${(currentLevel / maxLevel) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};
