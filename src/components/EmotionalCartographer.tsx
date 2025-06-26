"use client";

import React, { useState } from "react";
import { Button } from "./Button";
import { MemoryPalace } from "@/lib/types";
import {
  Heart,
  Brain,
  Users,
  Sparkles,
  TrendingUp,
  MessageSquare,
  Plus,
} from "lucide-react";

interface EmotionalCartographerProps {
  palaces: MemoryPalace[];
  insights: string[];
  onConnectionAdd: (
    playerId1: string,
    playerId2: string,
    connection: string,
  ) => void;
  onInsightAdd: (insight: string) => void;
}

const ANALYSIS_CATEGORIES = {
  emotions: "Emotional Patterns",
  themes: "Common Themes",
  contrasts: "Interesting Contrasts",
  growth: "Growth & Change",
  connections: "Shared Experiences",
};

const DISCUSSION_PROMPTS = [
  "Which memory palace resonated most with you and why?",
  "What common emotional themes did you notice across all palaces?",
  "How do different types of places seem to shape people differently?",
  "What surprised you most about someone else's palace?",
  "Which locations across all palaces felt most similar to your own experiences?",
  "How do you think physical spaces influence who we become?",
  "What did you learn about the relationship between memory and emotion?",
  "Which sensory details stood out most to you across all the tours?",
];

export const EmotionalCartographer: React.FC<EmotionalCartographerProps> = ({
  palaces,
  insights,
  onConnectionAdd,
  onInsightAdd,
}) => {
  const [selectedAnalysis, setSelectedAnalysis] = useState<string>("emotions");
  const [newConnection, setNewConnection] = useState<string>("");
  const [selectedPalaces, setSelectedPalaces] = useState<string[]>([]);
  const [newInsight, setNewInsight] = useState<string>("");
  const [showPrompts, setShowPrompts] = useState(false);

  const analyzeEmotions = () => {
    const emotionCounts: Record<string, number> = {};
    const emotionIntensities: Record<string, number[]> = {};

    palaces.forEach((palace) => {
      palace.locations.forEach((location) => {
        if (location.emotion) {
          const emotion = location.emotion.toLowerCase();
          emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
          emotionIntensities[emotion] = emotionIntensities[emotion] || [];
          emotionIntensities[emotion].push(location.emotionalIntensity || 5);
        }
      });
    });

    return Object.entries(emotionCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([emotion, count]) => ({
        emotion,
        count,
        avgIntensity:
          emotionIntensities[emotion].reduce((a, b) => a + b, 0) /
          emotionIntensities[emotion].length,
      }));
  };

  const analyzeThemes = () => {
    const themes: Record<string, string[]> = {};

    palaces.forEach((palace) => {
      palace.locations.forEach((location) => {
        if (location.significance) {
          const words = location.significance.toLowerCase().split(/\s+/);
          const keyWords = words.filter(
            (word) =>
              word.length > 4 &&
              ![
                "this",
                "that",
                "where",
                "what",
                "when",
                "because",
                "about",
              ].includes(word),
          );

          keyWords.forEach((word) => {
            themes[word] = themes[word] || [];
            themes[word].push(`${palace.playerName}: ${location.name}`);
          });
        }
      });
    });

    return Object.entries(themes)
      .filter(([, locations]) => locations.length > 1)
      .sort(([, a], [, b]) => b.length - a.length)
      .slice(0, 6);
  };

  const analyzeContrasts = () => {
    const contrasts = [];

    // Find palaces with very different emotional patterns
    for (let i = 0; i < palaces.length; i++) {
      for (let j = i + 1; j < palaces.length; j++) {
        const palace1 = palaces[i];
        const palace2 = palaces[j];

        const avg1 =
          palace1.locations.reduce(
            (sum, loc) => sum + (loc.emotionalIntensity || 5),
            0,
          ) / palace1.locations.length;
        const avg2 =
          palace2.locations.reduce(
            (sum, loc) => sum + (loc.emotionalIntensity || 5),
            0,
          ) / palace2.locations.length;

        if (Math.abs(avg1 - avg2) > 2) {
          contrasts.push({
            palace1: palace1.playerName,
            palace2: palace2.playerName,
            contrast:
              avg1 > avg2
                ? `${
                    palace1.playerName
                  }'s palace shows higher emotional intensity (${avg1.toFixed(
                    1,
                  )} vs ${avg2.toFixed(1)})`
                : `${
                    palace2.playerName
                  }'s palace shows higher emotional intensity (${avg2.toFixed(
                    1,
                  )} vs ${avg1.toFixed(1)})`,
          });
        }
      }
    }

    return contrasts;
  };

  const handleConnectionSubmit = () => {
    if (newConnection.trim() && selectedPalaces.length === 2) {
      onConnectionAdd(
        selectedPalaces[0],
        selectedPalaces[1],
        newConnection.trim(),
      );
      setNewConnection("");
      setSelectedPalaces([]);
    }
  };

  const handleInsightSubmit = () => {
    if (newInsight.trim()) {
      onInsightAdd(newInsight.trim());
      setNewInsight("");
    }
  };

  const renderAnalysisContent = () => {
    switch (selectedAnalysis) {
      case "emotions":
        const emotionData = analyzeEmotions();
        return (
          <div className="space-y-4">
            <h4 className="font-semibold text-neutral-800 dark:text-neutral-200 mb-4">
              Most Common Emotions Across All Palaces
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              {emotionData.map(({ emotion, count, avgIntensity }) => (
                <div
                  key={emotion}
                  className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-neutral-800 dark:text-neutral-200 capitalize">
                      {emotion}
                    </span>
                    <span className="text-sm text-neutral-500">
                      {count} locations
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-neutral-600 dark:text-neutral-400">
                      Avg Intensity:
                    </span>
                    <div className="flex gap-1">
                      {[...Array(10)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-3 rounded-sm ${
                            i < avgIntensity
                              ? "bg-red-400"
                              : "bg-neutral-200 dark:bg-neutral-700"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-neutral-600 dark:text-neutral-400">
                      {avgIntensity.toFixed(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "themes":
        const themeData = analyzeThemes();
        return (
          <div className="space-y-4">
            <h4 className="font-semibold text-neutral-800 dark:text-neutral-200 mb-4">
              Recurring Themes in Palace Significance
            </h4>
            <div className="space-y-4">
              {themeData.map(([theme, locations]) => (
                <div
                  key={theme}
                  className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <h5 className="font-medium text-neutral-800 dark:text-neutral-200 capitalize">
                      "{theme}"
                    </h5>
                    <span className="text-sm text-neutral-500">
                      ({locations.length} references)
                    </span>
                  </div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">
                    {locations.slice(0, 3).join(", ")}
                    {locations.length > 3 &&
                      ` and ${locations.length - 3} more...`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "contrasts":
        const contrastData = analyzeContrasts();
        return (
          <div className="space-y-4">
            <h4 className="font-semibold text-neutral-800 dark:text-neutral-200 mb-4">
              Interesting Contrasts Between Palaces
            </h4>
            <div className="space-y-3">
              {contrastData.map((contrast, index) => (
                <div
                  key={index}
                  className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg"
                >
                  <p className="text-neutral-700 dark:text-neutral-300">
                    {contrast.contrast}
                  </p>
                </div>
              ))}
              {contrastData.length === 0 && (
                <p className="text-neutral-500 dark:text-neutral-500 text-center py-8">
                  All palaces show similar emotional intensity patterns.
                </p>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">
          Emotional Cartography
        </h3>
        <p className="text-neutral-600 dark:text-neutral-400">
          Explore patterns, connections, and insights across all memory palaces.
        </p>
      </div>

      {/* Analysis Categories */}
      <div className="flex flex-wrap justify-center gap-2">
        {Object.entries(ANALYSIS_CATEGORIES).map(([key, label]) => (
          <Button
            key={key}
            onClick={() => setSelectedAnalysis(key)}
            variant={selectedAnalysis === key ? "primary" : "secondary"}
            size="sm"
          >
            {label}
          </Button>
        ))}
      </div>

      {/* Analysis Content */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
        {renderAnalysisContent()}
      </div>

      {/* Palace Overview Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {palaces.map((palace) => (
          <div
            key={palace.id}
            className={`p-4 border-2 rounded-lg transition-all cursor-pointer ${
              selectedPalaces.includes(palace.id)
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-300"
            }`}
            onClick={() => {
              if (selectedPalaces.includes(palace.id)) {
                setSelectedPalaces(
                  selectedPalaces.filter((id) => id !== palace.id),
                );
              } else if (selectedPalaces.length < 2) {
                setSelectedPalaces([...selectedPalaces, palace.id]);
              }
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-5 h-5 text-red-500" />
              <h4 className="font-semibold text-neutral-800 dark:text-neutral-200">
                {palace.placeName}
              </h4>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
              by {palace.playerName}
            </p>
            <div className="text-xs text-neutral-500">
              {palace.locations.length} locations • {palace.placeType} space
            </div>
            <div className="mt-2 flex gap-1">
              {palace.locations.slice(0, 5).map((location, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    location.emotionalIntensity >= 7
                      ? "bg-red-400"
                      : location.emotionalIntensity >= 4
                      ? "bg-yellow-400"
                      : "bg-green-400"
                  }`}
                  title={`${location.name}: ${location.emotion} (${location.emotionalIntensity}/10)`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Connection Builder */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
        <h4 className="font-semibold text-neutral-800 dark:text-neutral-200 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-500" />
          Create Connections
        </h4>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
              Select two palaces to compare and connect:
            </p>
            <div className="text-sm text-neutral-500">
              {selectedPalaces.length === 0 &&
                "Click on palaces above to select them"}
              {selectedPalaces.length === 1 && "Select one more palace"}
              {selectedPalaces.length === 2 &&
                `Connecting: ${
                  palaces.find((p) => p.id === selectedPalaces[0])?.playerName
                } & ${
                  palaces.find((p) => p.id === selectedPalaces[1])?.playerName
                }`}
            </div>
          </div>

          {selectedPalaces.length === 2 && (
            <div className="space-y-3">
              <textarea
                value={newConnection}
                onChange={(e) => setNewConnection(e.target.value)}
                placeholder="Describe the connection you see between these two palaces..."
                rows={3}
                className="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200"
              />
              <Button
                onClick={handleConnectionSubmit}
                disabled={!newConnection.trim()}
                variant="primary"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Connection
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Discussion Prompts */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
        <button
          onClick={() => setShowPrompts(!showPrompts)}
          className="flex items-center justify-between w-full mb-4"
        >
          <h4 className="font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-green-500" />
            Discussion Prompts
          </h4>
          <span className="text-neutral-500">{showPrompts ? "−" : "+"}</span>
        </button>

        {showPrompts && (
          <div className="grid md:grid-cols-2 gap-3">
            {DISCUSSION_PROMPTS.map((prompt, index) => (
              <div
                key={index}
                className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-sm text-neutral-700 dark:text-neutral-300 cursor-pointer hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors"
                onClick={() => {
                  navigator.clipboard?.writeText(prompt);
                }}
              >
                {prompt}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Insight Collection */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
        <h4 className="font-semibold text-neutral-800 dark:text-neutral-200 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-500" />
          Collective Insights
        </h4>

        <div className="space-y-4">
          <div className="space-y-2">
            {insights.map((insight, index) => (
              <div
                key={index}
                className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg"
              >
                <p className="text-sm text-neutral-700 dark:text-neutral-300">
                  {insight}
                </p>
              </div>
            ))}
            {insights.length === 0 && (
              <p className="text-neutral-500 dark:text-neutral-500 text-center py-4">
                No insights captured yet. Add your observations below.
              </p>
            )}
          </div>

          <div className="space-y-3">
            <textarea
              value={newInsight}
              onChange={(e) => setNewInsight(e.target.value)}
              placeholder="What insights have you gained from exploring these memory palaces?"
              rows={3}
              className="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200"
            />
            <Button
              onClick={handleInsightSubmit}
              disabled={!newInsight.trim()}
              variant="primary"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Insight
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
