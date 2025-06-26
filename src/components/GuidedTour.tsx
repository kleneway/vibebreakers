"use client";

import React, { useState } from "react";
import { Button } from "./Button";
import { MemoryPalace, Player } from "@/lib/types";
import {
  MapPin,
  Heart,
  Brain,
  Eye,
  Sparkles,
  Users,
  ChevronRight,
  MessageCircle,
} from "lucide-react";

interface GuidedTourProps {
  currentPalace: MemoryPalace;
  currentPlayer: Player;
  onLocationChange: (index: number) => void;
  onInsightAdd: (insight: string) => void;
}

const QUESTION_PROMPTS = [
  "What made that corner feel safe to you?",
  "How has your relationship with this place changed over time?",
  "What would you want to tell your younger self in that room?",
  "What sounds do you associate with this space?",
  "Who else shared this space with you?",
  "What did you learn about yourself here?",
  "How did this place influence who you became?",
  "What would someone else notice about this place that you might not?",
  "What time of day was this place most meaningful to you?",
  "If this place could talk, what would it say to you?",
];

export const GuidedTour: React.FC<GuidedTourProps> = ({
  currentPalace,
  currentPlayer,
  onLocationChange,
  onInsightAdd,
}) => {
  const [currentLocationIndex, setCurrentLocationIndex] = useState(0);
  const [showQuestions, setShowQuestions] = useState(false);
  const [newInsight, setNewInsight] = useState("");
  const [tourMode, setTourMode] = useState<"guided" | "free">("guided");

  if (!currentPalace) {
    return (
      <div className="text-center py-12">
        <MapPin className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-neutral-600 dark:text-neutral-400 mb-2">
          No Palace Available
        </h3>
        <p className="text-neutral-500 dark:text-neutral-500">
          Waiting for palace to be selected for the tour.
        </p>
      </div>
    );
  }

  const currentLocation = currentPalace.locations[currentLocationIndex];
  const isLastLocation =
    currentLocationIndex === currentPalace.locations.length - 1;

  const nextLocation = () => {
    const nextIndex = Math.min(
      currentLocationIndex + 1,
      currentPalace.locations.length - 1,
    );
    setCurrentLocationIndex(nextIndex);
    onLocationChange(nextIndex);
  };

  const prevLocation = () => {
    const prevIndex = Math.max(currentLocationIndex - 1, 0);
    setCurrentLocationIndex(prevIndex);
    onLocationChange(prevIndex);
  };

  const jumpToLocation = (index: number) => {
    setCurrentLocationIndex(index);
    onLocationChange(index);
  };

  const handleInsightSubmit = () => {
    if (newInsight.trim()) {
      onInsightAdd(newInsight.trim());
      setNewInsight("");
    }
  };

  const getEmotionalColor = (intensity: number) => {
    if (intensity >= 8) return "bg-red-500";
    if (intensity >= 6) return "bg-orange-500";
    if (intensity >= 4) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="space-y-6">
      {/* Tour Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">
          Guided Palace Tour
        </h3>
        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
          {currentPlayer.name} is guiding you through:{" "}
          <strong>{currentPalace.placeName}</strong>
        </p>

        {/* Tour Mode Toggle */}
        <div className="flex justify-center gap-2 mb-6">
          <Button
            onClick={() => setTourMode("guided")}
            variant={tourMode === "guided" ? "primary" : "secondary"}
            size="sm"
          >
            Guided Tour
          </Button>
          <Button
            onClick={() => setTourMode("free")}
            variant={tourMode === "free" ? "primary" : "secondary"}
            size="sm"
          >
            Free Exploration
          </Button>
        </div>
      </div>

      {/* Location Overview */}
      <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
            Palace Overview
          </h4>
          <span className="text-sm text-neutral-500">
            {currentPalace.locations.length} locations
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {currentPalace.locations.map((location, index) => (
            <button
              key={location.id}
              onClick={() => jumpToLocation(index)}
              className={`p-3 rounded-lg text-sm font-medium transition-all ${
                index === currentLocationIndex
                  ? "bg-blue-500 text-white"
                  : index < currentLocationIndex
                  ? "bg-green-500 text-white"
                  : "bg-white dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-600"
              }`}
            >
              <div className="truncate">{location.name}</div>
              {index === currentLocationIndex && (
                <ChevronRight className="w-4 h-4 mx-auto mt-1" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Current Location Display */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Location Content */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
            {/* Location Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <MapPin className="w-6 h-6 text-blue-500" />
                <div>
                  <h4 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200">
                    {currentLocation.name}
                  </h4>
                  <p className="text-sm text-neutral-500">
                    Location {currentLocationIndex + 1} of{" "}
                    {currentPalace.locations.length}
                  </p>
                </div>
              </div>

              {/* Emotional Intensity Indicator */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  Intensity
                </span>
                <div className="flex gap-1">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-6 rounded-sm ${
                        i < currentLocation.emotionalIntensity
                          ? getEmotionalColor(
                              currentLocation.emotionalIntensity,
                            )
                          : "bg-neutral-200 dark:bg-neutral-700"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Location Description */}
            {currentLocation.description && (
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-neutral-700 dark:text-neutral-300">
                  {currentLocation.description}
                </p>
              </div>
            )}

            {/* Memory Content */}
            <div className="space-y-6">
              {/* Memory */}
              {currentLocation.memory && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-500" />
                    <h5 className="font-semibold text-neutral-800 dark:text-neutral-200">
                      Memory
                    </h5>
                  </div>
                  <p className="text-neutral-700 dark:text-neutral-300 pl-7">
                    {currentLocation.memory}
                  </p>
                </div>
              )}

              {/* Emotion */}
              {currentLocation.emotion && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    <h5 className="font-semibold text-neutral-800 dark:text-neutral-200">
                      Emotion
                    </h5>
                  </div>
                  <p className="text-neutral-700 dark:text-neutral-300 pl-7">
                    {currentLocation.emotion}
                  </p>
                </div>
              )}

              {/* Significance */}
              {currentLocation.significance && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-green-500" />
                    <h5 className="font-semibold text-neutral-800 dark:text-neutral-200">
                      Significance
                    </h5>
                  </div>
                  <p className="text-neutral-700 dark:text-neutral-300 pl-7">
                    {currentLocation.significance}
                  </p>
                </div>
              )}

              {/* Sensory Detail */}
              {currentLocation.sensoryDetail && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-blue-500" />
                    <h5 className="font-semibold text-neutral-800 dark:text-neutral-200">
                      Sensory Detail
                    </h5>
                  </div>
                  <p className="text-neutral-700 dark:text-neutral-300 pl-7">
                    {currentLocation.sensoryDetail}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center mt-6">
            <Button
              onClick={prevLocation}
              disabled={currentLocationIndex === 0}
              variant="secondary"
            >
              ← Previous Location
            </Button>

            <span className="text-sm text-neutral-500">
              {currentLocationIndex + 1} / {currentPalace.locations.length}
            </span>

            <Button
              onClick={nextLocation}
              disabled={isLastLocation}
              variant="primary"
            >
              Next Location →
            </Button>
          </div>
        </div>

        {/* Interaction Sidebar */}
        <div className="space-y-6">
          {/* Question Prompts */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 border border-neutral-200 dark:border-neutral-700">
            <button
              onClick={() => setShowQuestions(!showQuestions)}
              className="flex items-center justify-between w-full mb-4"
            >
              <h5 className="font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-blue-500" />
                Question Prompts
              </h5>
              <span className="text-neutral-500">
                {showQuestions ? "−" : "+"}
              </span>
            </button>

            {showQuestions && (
              <div className="space-y-2">
                {QUESTION_PROMPTS.slice(0, 5).map((question, index) => (
                  <div
                    key={index}
                    className="p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg text-sm text-neutral-700 dark:text-neutral-300 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-600 transition-colors"
                    onClick={() => {
                      // Copy question to clipboard or show it prominently
                      navigator.clipboard?.writeText(question);
                    }}
                  >
                    {question}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Insight Capture */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 border border-neutral-200 dark:border-neutral-700">
            <h5 className="font-semibold text-neutral-800 dark:text-neutral-200 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              Capture Insights
            </h5>
            <div className="space-y-3">
              <textarea
                value={newInsight}
                onChange={(e) => setNewInsight(e.target.value)}
                placeholder="What insights or connections are you discovering about this place?"
                rows={3}
                className="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-sm"
              />
              <Button
                onClick={handleInsightSubmit}
                disabled={!newInsight.trim()}
                variant="primary"
                size="sm"
                className="w-full"
              >
                Add Insight
              </Button>
            </div>
          </div>

          {/* Tour Progress */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 border border-neutral-200 dark:border-neutral-700">
            <h5 className="font-semibold text-neutral-800 dark:text-neutral-200 mb-4">
              Tour Progress
            </h5>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600 dark:text-neutral-400">
                  Locations Visited
                </span>
                <span className="font-medium">
                  {currentLocationIndex + 1} / {currentPalace.locations.length}
                </span>
              </div>
              <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{
                    width: `${
                      ((currentLocationIndex + 1) /
                        currentPalace.locations.length) *
                      100
                    }%`,
                  }}
                />
              </div>
              {isLastLocation && (
                <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                  🎉 Tour complete! Ready for the next palace.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
