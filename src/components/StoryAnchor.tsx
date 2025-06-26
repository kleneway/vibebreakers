"use client";

import React, { useState } from "react";
import { Button } from "./Button";
import SpeechToTextArea from "./SpeechToTextArea";
import { MemoryPalace, MemoryLocation } from "@/lib/types";
import { Heart, Brain, Eye, Sparkles, MapPin } from "lucide-react";

interface StoryAnchorProps {
  palaces: MemoryPalace[];
  onPalaceUpdate: (palace: MemoryPalace) => void;
}

const EMOTION_SUGGESTIONS = [
  "Joy",
  "Peace",
  "Excitement",
  "Comfort",
  "Wonder",
  "Pride",
  "Love",
  "Security",
  "Adventure",
  "Gratitude",
  "Nostalgia",
  "Hope",
  "Curiosity",
  "Belonging",
  "Freedom",
  "Inspiration",
];

const SIGNIFICANCE_PROMPTS = [
  "This place taught me...",
  "I learned about myself here when...",
  "This location represents...",
  "The most important thing about this place is...",
  "This space changed me because...",
  "What makes this place special is...",
];

export const StoryAnchor: React.FC<StoryAnchorProps> = ({
  palaces,
  onPalaceUpdate,
}) => {
  const [selectedPalaceId, setSelectedPalaceId] = useState<string>("");
  const [selectedLocationIndex, setSelectedLocationIndex] = useState<number>(0);
  const [currentInput, setCurrentInput] = useState<string>("");
  const [isInputLoading, setIsInputLoading] = useState(false);

  const selectedPalace = palaces.find((p) => p.id === selectedPalaceId);
  const selectedLocation = selectedPalace?.locations[selectedLocationIndex];

  const updateLocationField = (
    field: keyof MemoryLocation,
    value: string | number,
  ) => {
    if (!selectedPalace || !selectedLocation) return;

    const updatedPalace = {
      ...selectedPalace,
      locations: selectedPalace.locations.map((loc, index) =>
        index === selectedLocationIndex ? { ...loc, [field]: value } : loc,
      ),
    };

    onPalaceUpdate(updatedPalace);
  };

  const handleSpeechInput = async (text: string) => {
    setCurrentInput(text);
  };

  const applyInputToField = (field: keyof MemoryLocation) => {
    if (currentInput.trim()) {
      updateLocationField(field, currentInput.trim());
      setCurrentInput("");
    }
  };

  const getCompletionStatus = (palace: MemoryPalace) => {
    const totalFields = palace.locations.length * 4; // memory, emotion, significance, sensoryDetail
    const completedFields = palace.locations.reduce((count, loc) => {
      return (
        count +
        (loc.memory ? 1 : 0) +
        (loc.emotion ? 1 : 0) +
        (loc.significance ? 1 : 0) +
        (loc.sensoryDetail ? 1 : 0)
      );
    }, 0);
    return Math.round((completedFields / totalFields) * 100);
  };

  const nextLocation = () => {
    if (!selectedPalace) return;
    const nextIndex =
      (selectedLocationIndex + 1) % selectedPalace.locations.length;
    setSelectedLocationIndex(nextIndex);
  };

  const prevLocation = () => {
    if (!selectedPalace) return;
    const prevIndex =
      selectedLocationIndex === 0
        ? selectedPalace.locations.length - 1
        : selectedLocationIndex - 1;
    setSelectedLocationIndex(prevIndex);
  };

  if (palaces.length === 0) {
    return (
      <div className="text-center py-12">
        <MapPin className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-neutral-600 dark:text-neutral-400 mb-2">
          No Palaces Yet
        </h3>
        <p className="text-neutral-500 dark:text-neutral-500">
          Create your memory palace first to begin adding stories and emotions.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">
          Story-Location Pairing
        </h3>
        <p className="text-neutral-600 dark:text-neutral-400">
          Connect meaningful memories and emotions to each location in your
          palace.
        </p>
      </div>

      {/* Palace Selection */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Select Palace to Work On
        </label>
        <div className="grid md:grid-cols-2 gap-4">
          {palaces.map((palace) => {
            const completion = getCompletionStatus(palace);
            return (
              <button
                key={palace.id}
                onClick={() => {
                  setSelectedPalaceId(palace.id);
                  setSelectedLocationIndex(0);
                }}
                className={`p-4 border-2 rounded-lg transition-all text-left ${
                  selectedPalaceId === palace.id
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-300"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-neutral-800 dark:text-neutral-200">
                    {palace.placeName}
                  </h4>
                  <div className="text-sm text-neutral-500">
                    {completion}% complete
                  </div>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                  by {palace.playerName}
                </p>
                <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${completion}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {selectedPalace && selectedLocation && (
        <div className="space-y-6">
          {/* Location Navigation */}
          <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
            <Button onClick={prevLocation} variant="secondary" size="sm">
              ← Previous
            </Button>
            <div className="text-center">
              <h4 className="font-semibold text-neutral-800 dark:text-neutral-200">
                {selectedLocation.name}
              </h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Location {selectedLocationIndex + 1} of{" "}
                {selectedPalace.locations.length}
              </p>
            </div>
            <Button onClick={nextLocation} variant="secondary" size="sm">
              Next →
            </Button>
          </div>

          {/* Location Description */}
          {selectedLocation.description && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-neutral-700 dark:text-neutral-300">
                {selectedLocation.description}
              </p>
            </div>
          )}

          {/* Memory Input */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-500" />
              <label className="font-medium text-neutral-800 dark:text-neutral-200">
                What memory is connected to this location?
              </label>
            </div>
            <textarea
              value={selectedLocation.memory || ""}
              onChange={(e) => updateLocationField("memory", e.target.value)}
              placeholder="Describe a specific memory that happened here or that this place reminds you of..."
              rows={3}
              className="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200"
            />
          </div>

          {/* Emotion Input */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              <label className="font-medium text-neutral-800 dark:text-neutral-200">
                What emotion does this place evoke?
              </label>
            </div>
            <input
              type="text"
              value={selectedLocation.emotion || ""}
              onChange={(e) => updateLocationField("emotion", e.target.value)}
              placeholder="Describe the feeling this place gives you..."
              className="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200"
            />
            <div className="flex flex-wrap gap-2">
              {EMOTION_SUGGESTIONS.map((emotion) => (
                <button
                  key={emotion}
                  onClick={() => updateLocationField("emotion", emotion)}
                  className="px-3 py-1 text-sm bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-full hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors"
                >
                  {emotion}
                </button>
              ))}
            </div>
          </div>

          {/* Emotional Intensity Slider */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              <label className="font-medium text-neutral-800 dark:text-neutral-200">
                Emotional Intensity: {selectedLocation.emotionalIntensity}/10
              </label>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={selectedLocation.emotionalIntensity || 5}
              onChange={(e) =>
                updateLocationField(
                  "emotionalIntensity",
                  parseInt(e.target.value),
                )
              }
              className="w-full"
            />
            <div className="flex justify-between text-xs text-neutral-500">
              <span>Mild</span>
              <span>Moderate</span>
              <span>Intense</span>
            </div>
          </div>

          {/* Significance Input */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-green-500" />
              <label className="font-medium text-neutral-800 dark:text-neutral-200">
                Why is this location significant to you?
              </label>
            </div>
            <textarea
              value={selectedLocation.significance || ""}
              onChange={(e) =>
                updateLocationField("significance", e.target.value)
              }
              placeholder="What makes this place meaningful? How did it shape you?"
              rows={3}
              className="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200"
            />
            <div className="flex flex-wrap gap-2">
              {SIGNIFICANCE_PROMPTS.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => updateLocationField("significance", prompt)}
                  className="px-3 py-1 text-sm bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full hover:bg-green-200 dark:hover:bg-green-900/40 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Sensory Detail Input */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-500" />
              <label className="font-medium text-neutral-800 dark:text-neutral-200">
                What sensory detail stands out most?
              </label>
            </div>
            <input
              type="text"
              value={selectedLocation.sensoryDetail || ""}
              onChange={(e) =>
                updateLocationField("sensoryDetail", e.target.value)
              }
              placeholder="A sound, smell, texture, or visual that you remember vividly..."
              className="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200"
            />
          </div>

          {/* Speech Input Area */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-medium text-neutral-800 dark:text-neutral-200">
                Use Voice Input
              </span>
            </div>
            <SpeechToTextArea
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onSubmit={handleSpeechInput}
              isLoading={isInputLoading}
              placeholder="Speak or type to capture your thoughts, then apply to a field above..."
            />
            {currentInput && (
              <div className="flex gap-2 flex-wrap">
                <Button
                  onClick={() => applyInputToField("memory")}
                  variant="secondary"
                  size="sm"
                >
                  → Memory
                </Button>
                <Button
                  onClick={() => applyInputToField("emotion")}
                  variant="secondary"
                  size="sm"
                >
                  → Emotion
                </Button>
                <Button
                  onClick={() => applyInputToField("significance")}
                  variant="secondary"
                  size="sm"
                >
                  → Significance
                </Button>
                <Button
                  onClick={() => applyInputToField("sensoryDetail")}
                  variant="secondary"
                  size="sm"
                >
                  → Sensory Detail
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
