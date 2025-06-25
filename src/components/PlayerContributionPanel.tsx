"use client";

import { useState, useRef } from "react";
import { StoryElement, GameSettings } from "@/lib/types";
import { Button } from "./Button";
import { SpeechToTextArea, SpeechToTextAreaRef } from "./SpeechToTextArea";
import { Send, RotateCcw } from "lucide-react";

interface PlayerContributionPanelProps {
  currentElement: StoryElement;
  playerName: string;
  settings: GameSettings;
  onSubmit: (sentence: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export const PlayerContributionPanel: React.FC<
  PlayerContributionPanelProps
> = ({
  currentElement,
  playerName,
  settings,
  onSubmit,
  isLoading = false,
  disabled = false,
}) => {
  const [sentence, setSentence] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const speechRef = useRef<SpeechToTextAreaRef>(null);

  const validateSentence = (text: string): string[] => {
    const errors: string[] = [];
    const trimmed = text.trim();

    if (!trimmed) {
      errors.push("Please enter a sentence");
      return errors;
    }

    if (trimmed.length < settings.minSentenceLength) {
      errors.push(
        `Sentence must be at least ${settings.minSentenceLength} characters`,
      );
    }

    if (trimmed.length > settings.maxSentenceLength) {
      errors.push(
        `Sentence must be no more than ${settings.maxSentenceLength} characters`,
      );
    }

    // Check if sentence ends with proper punctuation
    const lastChar = trimmed[trimmed.length - 1];
    if (![".", "!", "?"].includes(lastChar)) {
      errors.push("Sentence must end with proper punctuation (., !, or ?)");
    }

    // Check if the sentence contains multiple sentences (basic check)
    const sentenceEnders = trimmed.match(/[.!?]/g);
    if (sentenceEnders && sentenceEnders.length > 1) {
      errors.push("Please contribute only one sentence at a time");
    }

    // Basic check if element is incorporated (simple keyword search)
    const elementWords = currentElement.text.toLowerCase().split(/\s+/);
    const sentenceWords = trimmed.toLowerCase().split(/\s+/);
    const hasElementWord = elementWords.some((word) =>
      sentenceWords.some(
        (sentenceWord) =>
          sentenceWord.includes(word) || word.includes(sentenceWord),
      ),
    );

    if (!hasElementWord) {
      errors.push(
        `Try to incorporate "${currentElement.text}" into your sentence`,
      );
    }

    return errors;
  };

  const handleSubmit = async () => {
    const validationErrors = validateSentence(sentence);
    setErrors(validationErrors);

    if (validationErrors.length === 0) {
      onSubmit(sentence.trim());
      setSentence("");
      speechRef.current?.clear();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSentence(e.target.value);
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleReset = () => {
    setSentence("");
    setErrors([]);
    speechRef.current?.clear();
  };

  const getElementTypeIcon = (type: string) => {
    switch (type) {
      case "character":
        return "👤";
      case "setting":
        return "🏞️";
      case "plotDevice":
        return "✨";
      default:
        return "📝";
    }
  };

  const getElementTypeColor = (type: string) => {
    switch (type) {
      case "character":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-200";
      case "setting":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200";
      case "plotDevice":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 border-gray-200";
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-4">
      {/* Player Header */}
      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          {playerName}'s Turn
        </h3>
        <div
          className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getElementTypeColor(
            currentElement.type,
          )}`}
        >
          <span className="mr-2">
            {getElementTypeIcon(currentElement.type)}
          </span>
          <span>Incorporate: "{currentElement.text}"</span>
        </div>
      </div>

      {/* Input Area */}
      <div className="space-y-3">
        <div className="relative">
          <SpeechToTextArea
            ref={speechRef}
            value={sentence}
            onChange={handleInputChange}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            placeholder={`Write one sentence that incorporates "${currentElement.text}"...`}
            minHeight="80px"
            shouldSubmitOnEnter={false}
          />
        </div>

        {/* Character Count */}
        <div className="flex justify-between items-center text-sm">
          <span
            className={`${
              sentence.length < settings.minSentenceLength
                ? "text-red-500"
                : sentence.length > settings.maxSentenceLength
                ? "text-red-500"
                : "text-green-500"
            }`}
          >
            {sentence.length} / {settings.minSentenceLength}-
            {settings.maxSentenceLength} characters
          </span>
          <span className="text-gray-500 dark:text-gray-400">
            One sentence only
          </span>
        </div>

        {/* Validation Errors */}
        {errors.length > 0 && (
          <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-3">
            <ul className="space-y-1">
              {errors.map((error, index) => (
                <li
                  key={index}
                  className="text-red-700 dark:text-red-300 text-sm flex items-start"
                >
                  <span className="mr-2">•</span>
                  <span>{error}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button
            onClick={handleSubmit}
            disabled={disabled || isLoading || !sentence.trim()}
            className="flex-1"
            variant="primary"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Adding to Story...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <Send className="w-4 h-4 mr-2" />
                Add to Story
              </span>
            )}
          </Button>

          <Button
            onClick={handleReset}
            disabled={disabled || isLoading}
            variant="secondary"
            size="md"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Helpful Tips */}
      <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4 text-sm">
        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
          💡 Tips for Great Storytelling:
        </h4>
        <ul className="space-y-1 text-blue-800 dark:text-blue-200">
          <li>• Connect your sentence to what came before</li>
          <li>• Naturally weave in your assigned element</li>
          <li>• Add detail that moves the story forward</li>
          <li>• Leave room for the next player to continue</li>
        </ul>
      </div>
    </div>
  );
};
