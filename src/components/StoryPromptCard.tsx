"use client";

import { StoryContribution, StoryElement } from "@/lib/types";
import { Button } from "./Button";
import { Book, Sparkles } from "lucide-react";

interface StoryPromptCardProps {
  story: StoryContribution[];
  currentElement?: StoryElement;
  currentPlayerName?: string;
  isActivePlayer?: boolean;
  onExportStory?: () => void;
}

export const StoryPromptCard: React.FC<StoryPromptCardProps> = ({
  story,
  currentElement,
  currentPlayerName,
  isActivePlayer = false,
  onExportStory
}) => {
  const getElementTypeIcon = (type: string) => {
    switch (type) {
      case 'character':
        return '👤';
      case 'setting':
        return '🏞️';
      case 'plotDevice':
        return '✨';
      default:
        return '📝';
    }
  };

  const getElementTypeColor = (type: string) => {
    switch (type) {
      case 'character':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'setting':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'plotDevice':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Book className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Our Story</h2>
        </div>
        {story.length > 0 && onExportStory && (
          <Button variant="secondary" size="sm" onClick={onExportStory}>
            Export Story
          </Button>
        )}
      </div>

      {/* Story Content */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 min-h-32">
        {story.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            <Sparkles className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-lg">Your story begins here...</p>
            <p className="text-sm">The first player will start our adventure!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {story.map((contribution, index) => (
              <div key={contribution.id} className="flex space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {contribution.playerName}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getElementTypeColor(contribution.storyElement.type)}`}>
                      {getElementTypeIcon(contribution.storyElement.type)} {contribution.storyElement.text}
                    </span>
                  </div>
                  <p className="text-gray-900 dark:text-white leading-relaxed">
                    {contribution.sentence}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Current Player Prompt */}
      {currentElement && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-lg p-4 border-l-4 border-blue-500">
          <div className="flex items-center space-x-2 mb-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {isActivePlayer ? "Your Turn!" : `${currentPlayerName}'s Turn`}
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {isActivePlayer ? "Incorporate this element:" : "They must incorporate:"}
            </span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getElementTypeColor(currentElement.type)}`}>
              {getElementTypeIcon(currentElement.type)} {currentElement.text}
            </span>
          </div>
          {isActivePlayer && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              💡 Try to connect your sentence to what came before while naturally including your element!
            </p>
          )}
        </div>
      )}
    </div>
  );
};