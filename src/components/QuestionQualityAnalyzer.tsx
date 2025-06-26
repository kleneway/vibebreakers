"use client";

import React from "react";
import { QuestionQuality } from "@/lib/types";
import { cn } from "@/lib/utils";
import { TrendingUp, Users, Lightbulb, Award } from "lucide-react";

interface QuestionQualityAnalyzerProps {
  quality: QuestionQuality;
  showDetails?: boolean;
}

export const QuestionQualityAnalyzer: React.FC<
  QuestionQualityAnalyzerProps
> = ({ quality, showDetails = true }: QuestionQualityAnalyzerProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600 dark:text-green-400";
    if (score >= 6) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreBackgroundColor = (score: number) => {
    if (score >= 8) return "bg-green-100 dark:bg-green-900/20";
    if (score >= 6) return "bg-yellow-100 dark:bg-yellow-900/20";
    return "bg-red-100 dark:bg-red-900/20";
  };

  const scoreComponents = [
    {
      icon: TrendingUp,
      label: "Depth Score",
      value: quality.depthScore,
      description: "How deep the question goes",
    },
    {
      icon: Users,
      label: "Building Score",
      value: quality.buildingScore,
      description: "Builds on previous answers",
    },
    {
      icon: Lightbulb,
      label: "Surprise Score",
      value: quality.surpriseScore,
      description: "Unexpected or thought-provoking",
    },
  ];

  return (
    <div className="p-4 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-sm">
      {/* Overall Score */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Award className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
            Question Quality
          </h3>
        </div>
        <div
          className={cn(
            "px-3 py-1 rounded-full text-sm font-bold",
            getScoreBackgroundColor(quality.totalScore),
            getScoreColor(quality.totalScore),
          )}
        >
          {quality.totalScore.toFixed(1)}/10
        </div>
      </div>

      {/* Score Breakdown */}
      {showDetails && (
        <div className="space-y-3 mb-4">
          {scoreComponents.map((component, index) => {
            const Icon = component.icon;
            return (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icon className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">
                    {component.label}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-24 h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full transition-all duration-500",
                        getScoreColor(component.value).replace("text-", "bg-"),
                      )}
                      style={{ width: `${(component.value / 10) * 100}%` }}
                    />
                  </div>
                  <span
                    className={cn(
                      "text-sm font-medium min-w-[2rem] text-right",
                      getScoreColor(component.value),
                    )}
                  >
                    {component.value.toFixed(1)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Feedback */}
      {quality.feedback && (
        <div className="p-3 bg-neutral-50 dark:bg-neutral-900/50 rounded-lg">
          <p className="text-sm text-neutral-700 dark:text-neutral-300">
            {quality.feedback}
          </p>
        </div>
      )}
    </div>
  );
};

// Helper function to analyze question quality
export const analyzeQuestionQuality = (
  question: string,
  previousAnswer?: string,
  depthLevel?: number,
): QuestionQuality => {
  const lowerQuestion = question.toLowerCase();

  // Depth analysis keywords
  const depthKeywords = {
    1: ["what", "which", "who", "when", "where", "favorite"],
    2: ["how", "tell me about", "describe", "experience"],
    3: ["why", "believe", "value", "important", "meaning"],
    4: ["feel", "fear", "worry", "struggle", "challenge", "vulnerable"],
    5: ["identity", "purpose", "life", "meaning", "legacy", "remember"],
  };

  // Calculate depth score
  let depthScore = 1;
  for (let level = 5; level >= 1; level--) {
    if (
      depthKeywords[level as keyof typeof depthKeywords].some((keyword) =>
        lowerQuestion.includes(keyword),
      )
    ) {
      depthScore = Math.max(depthScore, level * 2);
      break;
    }
  }

  // Calculate building score (how well it connects to previous answer)
  let buildingScore = 0;
  if (previousAnswer && previousAnswer.length > 0) {
    buildingScore =
      lowerQuestion.includes("you mentioned") ||
      lowerQuestion.includes("you said") ||
      lowerQuestion.includes("that")
        ? 8
        : 4;
  }

  // Calculate surprise score (complexity and thoughtfulness)
  let surpriseScore = 4;
  if (question.length > 50) surpriseScore += 2;
  if (lowerQuestion.includes("if") || lowerQuestion.includes("imagine"))
    surpriseScore += 2;
  if (lowerQuestion.split(" ").length > 10) surpriseScore += 2;

  const totalScore = (depthScore + buildingScore + surpriseScore) / 3;

  // Generate feedback
  let feedback = "";
  if (totalScore >= 8) {
    feedback = "Excellent question! It shows depth and thoughtfulness.";
  } else if (totalScore >= 6) {
    feedback =
      "Good question. Consider adding more depth or connecting to previous answers.";
  } else {
    feedback =
      "Try asking something deeper or more personal to create meaningful conversation.";
  }

  return {
    depthScore: Math.min(depthScore, 10),
    buildingScore: Math.min(buildingScore, 10),
    surpriseScore: Math.min(surpriseScore, 10),
    totalScore: Math.min(totalScore, 10),
    feedback,
  };
};
