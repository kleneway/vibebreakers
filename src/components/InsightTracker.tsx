"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Insight } from "@/lib/types";
import { Sparkles, MessageSquare, Heart, Lightbulb } from "lucide-react";

interface InsightTrackerProps {
  insights: Insight[];
  onInsightAdd?: (insight: Omit<Insight, "id">) => void;
}

export const InsightTracker: React.FC<InsightTrackerProps> = ({
  insights,
  onInsightAdd,
}: InsightTrackerProps) => {
  const getInsightConfig = (type: Insight["type"]) => {
    switch (type) {
      case "connection":
        return {
          icon: Heart,
          color: "bg-pink-500",
          bgColor: "bg-pink-50 dark:bg-pink-900/20",
          textColor: "text-pink-700 dark:text-pink-300",
          label: "Connection",
        };
      case "revelation":
        return {
          icon: Sparkles,
          color: "bg-purple-500",
          bgColor: "bg-purple-50 dark:bg-purple-900/20",
          textColor: "text-purple-700 dark:text-purple-300",
          label: "Revelation",
        };
      case "empathy":
        return {
          icon: MessageSquare,
          color: "bg-blue-500",
          bgColor: "bg-blue-50 dark:bg-blue-900/20",
          textColor: "text-blue-700 dark:text-blue-300",
          label: "Empathy",
        };
      case "breakthrough":
        return {
          icon: Lightbulb,
          color: "bg-yellow-500",
          bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
          textColor: "text-yellow-700 dark:text-yellow-300",
          label: "Breakthrough",
        };
    }
  };

  const recentInsights = insights.slice(-3);

  return (
    <div className="p-4 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-sm">
      <div className="flex items-center space-x-2 mb-4">
        <Sparkles className="w-5 h-5 text-indigo-600" />
        <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
          Meaningful Moments
        </h3>
        <div className="ml-auto text-sm text-neutral-600 dark:text-neutral-400">
          {insights.length} insights
        </div>
      </div>

      {insights.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-neutral-100 dark:bg-neutral-700 rounded-full flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-neutral-400" />
          </div>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm">
            Meaningful moments will appear here as the conversation deepens
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {recentInsights.map((insight) => {
            const config = getInsightConfig(insight.type);
            const Icon = config.icon;

            return (
              <div
                key={insight.id}
                className={cn(
                  "p-3 rounded-lg border transition-all duration-300 hover:shadow-sm",
                  config.bgColor,
                )}
              >
                <div className="flex items-start space-x-3">
                  <div
                    className={cn(
                      "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                      config.color,
                    )}
                  >
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span
                        className={cn(
                          "text-xs font-medium uppercase tracking-wide",
                          config.textColor,
                        )}
                      >
                        {config.label}
                      </span>
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">
                        {insight.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-700 dark:text-neutral-300">
                      {insight.message}
                    </p>
                    {insight.participants.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {insight.participants.map((participant, index) => (
                          <span
                            key={index}
                            className="text-xs px-2 py-1 bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 rounded-full"
                          >
                            {participant}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {insights.length > 3 && (
            <div className="text-center pt-2">
              <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium">
                View all {insights.length} insights
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Helper function to automatically detect insights
export const detectInsight = (
  answer: string,
  question: string,
  participantName: string,
  previousRounds: any[],
): Insight | null => {
  const lowerAnswer = answer.toLowerCase();
  const lowerQuestion = question.toLowerCase();

  // Keywords that suggest different types of insights
  const connectionKeywords = [
    "similar",
    "same",
    "relate",
    "understand",
    "connect",
    "agree",
  ];
  const revelationKeywords = [
    "realized",
    "never thought",
    "just understood",
    "epiphany",
    "suddenly",
  ];
  const empathyKeywords = [
    "feel for",
    "imagine how",
    "must be hard",
    "sorry to hear",
  ];
  const breakthroughKeywords = [
    "breakthrough",
    "clarity",
    "makes sense",
    "finally understand",
  ];

  let insightType: Insight["type"] | null = null;
  let message = "";

  // Check for connection
  if (connectionKeywords.some((keyword) => lowerAnswer.includes(keyword))) {
    insightType = "connection";
    message = `${participantName} found a deep connection while sharing their experience`;
  }
  // Check for revelation
  else if (
    revelationKeywords.some((keyword) => lowerAnswer.includes(keyword))
  ) {
    insightType = "revelation";
    message = `${participantName} had a moment of self-discovery`;
  }
  // Check for empathy
  else if (empathyKeywords.some((keyword) => lowerAnswer.includes(keyword))) {
    insightType = "empathy";
    message = `${participantName} showed deep empathy and understanding`;
  }
  // Check for breakthrough
  else if (
    breakthroughKeywords.some((keyword) => lowerAnswer.includes(keyword))
  ) {
    insightType = "breakthrough";
    message = `${participantName} reached a new level of understanding`;
  }

  if (!insightType) return null;

  return {
    id: Math.random().toString(36).substr(2, 9),
    type: insightType,
    message,
    timestamp: new Date(),
    participants: [participantName],
  };
};
