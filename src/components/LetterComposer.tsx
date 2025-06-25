"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./Button";
import { Player, TimeFrame, Letter, LetterPrompt } from "@/lib/types";
import { Heart, Clock, Lightbulb, Target, Smile, Star } from "lucide-react";

interface LetterComposerProps {
  player: Player;
  timeFrames: TimeFrame[];
  onLetterComplete: (letter: Letter) => void;
  timeRemaining: number;
}

const LETTER_PROMPTS: LetterPrompt[] = [
  // Opening prompts
  {
    category: "opening",
    type: "dreams",
    text: "Dear Future You, I hope when you read this...",
  },
  {
    category: "opening",
    type: "relationships",
    text: "Right now you're probably...",
  },
  {
    category: "opening",
    type: "growth",
    text: "I want you to remember that today...",
  },

  // Content prompts - Dreams & Goals
  {
    category: "content",
    type: "dreams",
    text: "What I hope you've accomplished by now is...",
  },
  {
    category: "content",
    type: "dreams",
    text: "The dream I'm working toward that I hope you've achieved...",
  },
  {
    category: "content",
    type: "dreams",
    text: "I hope you've found the courage to...",
  },

  // Content prompts - Relationships
  {
    category: "content",
    type: "relationships",
    text: "I hope you've learned about love and friendship...",
  },
  {
    category: "content",
    type: "relationships",
    text: "The relationships I hope you've nurtured...",
  },
  {
    category: "content",
    type: "relationships",
    text: "I hope you've surrounded yourself with people who...",
  },

  // Content prompts - Personal Growth
  {
    category: "content",
    type: "growth",
    text: "I hope you've become the kind of person who...",
  },
  {
    category: "content",
    type: "growth",
    text: "The fears I hope you've overcome...",
  },
  {
    category: "content",
    type: "growth",
    text: "I hope you've learned to be gentle with yourself about...",
  },

  // Content prompts - Challenges
  {
    category: "content",
    type: "challenges",
    text: "If you're struggling with [current challenge], remember...",
  },
  {
    category: "content",
    type: "challenges",
    text: "The difficult situation I'm facing now taught me...",
  },
  {
    category: "content",
    type: "challenges",
    text: "When things get hard, I hope you remember...",
  },

  // Content prompts - Gratitude
  {
    category: "content",
    type: "gratitude",
    text: "I hope you haven't forgotten to appreciate...",
  },
  {
    category: "content",
    type: "gratitude",
    text: "The simple joys I hope you still find time for...",
  },
  {
    category: "content",
    type: "gratitude",
    text: "I'm grateful for this moment because...",
  },

  // Content prompts - Wisdom
  {
    category: "content",
    type: "wisdom",
    text: "Something I've learned that I don't want you to forget...",
  },
  {
    category: "content",
    type: "wisdom",
    text: "The most important thing I want you to remember...",
  },
  {
    category: "content",
    type: "wisdom",
    text: "A piece of advice that changed my perspective...",
  },

  // Closing prompts
  {
    category: "closing",
    type: "growth",
    text: "Be gentle with yourself about...",
  },
  { category: "closing", type: "wisdom", text: "I'm proud of you for..." },
  {
    category: "closing",
    type: "relationships",
    text: "Remember that past you believed in you, and...",
  },
];

export const LetterComposer: React.FC<LetterComposerProps> = ({
  player,
  timeFrames,
  onLetterComplete,
  timeRemaining,
}) => {
  const [currentTimeFrameIndex, setCurrentTimeFrameIndex] = useState(0);
  const [letterContent, setLetterContent] = useState("");
  const [selectedPrompts, setSelectedPrompts] = useState<LetterPrompt[]>([]);
  const [currentStep, setCurrentStep] = useState<
    "prompts" | "writing" | "review"
  >("prompts");
  const [wordCount, setWordCount] = useState(0);

  const currentTimeFrame = timeFrames[currentTimeFrameIndex];

  useEffect(() => {
    // Select random prompts for this letter
    const openingPrompts = LETTER_PROMPTS.filter(
      (p) => p.category === "opening",
    );
    const contentPrompts = LETTER_PROMPTS.filter(
      (p) => p.category === "content",
    );
    const closingPrompts = LETTER_PROMPTS.filter(
      (p) => p.category === "closing",
    );

    const selectedOpening =
      openingPrompts[Math.floor(Math.random() * openingPrompts.length)];
    const selectedContent = contentPrompts
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    const selectedClosing =
      closingPrompts[Math.floor(Math.random() * closingPrompts.length)];

    setSelectedPrompts([selectedOpening, ...selectedContent, selectedClosing]);
  }, [currentTimeFrameIndex]);

  useEffect(() => {
    const words = letterContent
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
    setWordCount(words.length);
  }, [letterContent]);

  const getPromptIcon = (type: string) => {
    switch (type) {
      case "dreams":
        return <Target className="w-5 h-5" />;
      case "relationships":
        return <Heart className="w-5 h-5" />;
      case "growth":
        return <Star className="w-5 h-5" />;
      case "challenges":
        return <Clock className="w-5 h-5" />;
      case "gratitude":
        return <Smile className="w-5 h-5" />;
      case "wisdom":
        return <Lightbulb className="w-5 h-5" />;
      default:
        return <Heart className="w-5 h-5" />;
    }
  };

  const handleStartWriting = () => {
    setCurrentStep("writing");
  };

  const handleReviewLetter = () => {
    if (letterContent.trim().length < 50) {
      alert("Please write at least a few sentences for your letter.");
      return;
    }
    setCurrentStep("review");
  };

  const handleSubmitLetter = () => {
    const letter: Letter = {
      id: `letter-${Date.now()}-${Math.random()}`,
      timeFrame: currentTimeFrame,
      content: letterContent.trim(),
      authorId: player.id,
      wordCount: wordCount,
      createdAt: new Date(),
    };

    onLetterComplete(letter);

    // Reset for next letter or finish
    if (currentTimeFrameIndex < timeFrames.length - 1) {
      setCurrentTimeFrameIndex(currentTimeFrameIndex + 1);
      setLetterContent("");
      setCurrentStep("prompts");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, "0")}`;
  };

  const getWordCountColor = () => {
    if (wordCount < 50) return "text-red-500";
    if (wordCount < 100) return "text-orange-500";
    if (wordCount < 200) return "text-green-500";
    if (wordCount < 400) return "text-blue-500";
    return "text-purple-500";
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-white">
          Letter {currentTimeFrameIndex + 1} of {timeFrames.length}
        </h2>
        <h3 className="text-xl text-gray-600 dark:text-gray-300 mb-4">
          Writing to your {currentTimeFrame.label} future self
        </h3>

        <div className="flex justify-center items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
          <span>Time: {formatTime(timeRemaining)}</span>
          <span className={`font-semibold ${getWordCountColor()}`}>
            {wordCount} words
          </span>
          {wordCount >= 50 && wordCount <= 400 && (
            <span className="text-green-600 dark:text-green-400">
              ✓ Good length
            </span>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {currentStep === "prompts" && (
          <motion.div
            key="prompts"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center"
          >
            <h3 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
              Your Letter Prompts
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Use these prompts as inspiration for your letter. You don't need
              to use them all - let your authentic voice guide the writing.
            </p>

            <div className="grid gap-4 mb-8">
              {selectedPrompts.map((prompt, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-left"
                >
                  <div className="flex-shrink-0 p-2 bg-white dark:bg-gray-600 rounded-full mr-4">
                    {getPromptIcon(prompt.type)}
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1 capitalize">
                      {prompt.category} • {prompt.type}
                    </div>
                    <div className="text-gray-800 dark:text-gray-200">
                      "{prompt.text}"
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <Button onClick={handleStartWriting} size="lg">
              Start Writing Your Letter
            </Button>
          </motion.div>
        )}

        {currentStep === "writing" && (
          <motion.div
            key="writing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Writing Area */}
              <div className="lg:col-span-2">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                  Dear {currentTimeFrame.label} Future Me...
                </h3>

                <textarea
                  value={letterContent}
                  onChange={(e) => setLetterContent(e.target.value)}
                  placeholder="Start writing your letter here... Be authentic, encouraging, and honest."
                  className="w-full h-96 p-4 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           resize-none text-base leading-relaxed"
                  autoFocus
                />

                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Recommended: 200-400 words
                  </div>
                  <Button
                    onClick={handleReviewLetter}
                    disabled={letterContent.trim().length < 50}
                    variant={
                      letterContent.trim().length >= 50
                        ? "primary"
                        : "secondary"
                    }
                  >
                    Review Letter
                  </Button>
                </div>
              </div>

              {/* Prompt Reference */}
              <div className="lg:col-span-1">
                <h4 className="text-md font-semibold mb-4 text-gray-800 dark:text-white">
                  Prompt Inspiration
                </h4>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {selectedPrompts.map((prompt, index) => (
                    <div
                      key={index}
                      className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer
                               hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors"
                      onClick={() => {
                        if (!letterContent.includes(prompt.text)) {
                          setLetterContent(
                            (prev) =>
                              prev + (prev ? "\n\n" : "") + prompt.text + " ",
                          );
                        }
                      }}
                    >
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 capitalize">
                        {prompt.type}
                      </div>
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        "{prompt.text}"
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Click any prompt to add it to your letter
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {currentStep === "review" && (
          <motion.div
            key="review"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center"
          >
            <h3 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
              Review Your Letter
            </h3>

            <div
              className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 
                          rounded-xl p-8 mb-8 text-left max-w-3xl mx-auto"
            >
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Letter to your {currentTimeFrame.label} future self •{" "}
                {wordCount} words
              </div>
              <div className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                {letterContent}
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <Button
                onClick={() => setCurrentStep("writing")}
                variant="secondary"
              >
                Edit Letter
              </Button>
              <Button onClick={handleSubmitLetter}>
                {currentTimeFrameIndex < timeFrames.length - 1
                  ? "Next Letter"
                  : "Complete Letters"}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
