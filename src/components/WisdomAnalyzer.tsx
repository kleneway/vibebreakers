"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "./Button";
import { Letter, WisdomInsight } from "@/lib/types";
import {
  Brain,
  TrendingUp,
  Heart,
  Users,
  Sparkles,
  BookOpen,
} from "lucide-react";

interface WisdomAnalyzerProps {
  letters: Letter[];
  onAnalysisComplete: (insights: WisdomInsight[]) => void;
}

export const WisdomAnalyzer: React.FC<WisdomAnalyzerProps> = ({
  letters,
  onAnalysisComplete,
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [insights, setInsights] = useState<WisdomInsight[]>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    // Simulate analysis process
    const analyzeLetters = () => {
      setTimeout(() => {
        const generatedInsights = generateWisdomInsights(letters);
        setInsights(generatedInsights);
        setIsAnalyzing(false);
        setShowResults(true);
        onAnalysisComplete(generatedInsights);
      }, 2500);
    };

    analyzeLetters();
  }, [letters, onAnalysisComplete]);

  const generateWisdomInsights = (letterList: Letter[]): WisdomInsight[] => {
    // This is a simplified analysis - in a real implementation,
    // this would use NLP or AI to analyze the content
    const insights: WisdomInsight[] = [];

    // Analyze common themes based on keywords
    const themeKeywords = {
      "Self-Compassion": [
        "gentle",
        "kind",
        "forgive",
        "patient",
        "understanding",
        "compassion",
      ],
      "Growth & Learning": [
        "learn",
        "grow",
        "develop",
        "evolve",
        "change",
        "improve",
      ],
      Relationships: [
        "love",
        "friendship",
        "family",
        "connection",
        "together",
        "support",
      ],
      "Dreams & Goals": [
        "dream",
        "goal",
        "achieve",
        "accomplish",
        "success",
        "ambition",
      ],
      Gratitude: [
        "grateful",
        "thankful",
        "appreciate",
        "blessing",
        "cherish",
        "value",
      ],
      "Courage & Resilience": [
        "brave",
        "courage",
        "strong",
        "overcome",
        "persevere",
        "resilient",
      ],
      "Present Moment": [
        "now",
        "today",
        "moment",
        "present",
        "mindful",
        "aware",
      ],
      "Hope & Optimism": [
        "hope",
        "optimistic",
        "positive",
        "bright",
        "future",
        "possible",
      ],
    };

    Object.entries(themeKeywords).forEach(([theme, keywords]) => {
      let frequency = 0;
      const examples: string[] = [];

      letterList.forEach((letter) => {
        const content = letter.content.toLowerCase();
        keywords.forEach((keyword) => {
          if (content.includes(keyword)) {
            frequency++;
            // Extract a sentence containing the keyword
            const sentences = letter.content.split(/[.!?]+/);
            const sentenceWithKeyword = sentences.find((sentence) =>
              sentence.toLowerCase().includes(keyword),
            );
            if (sentenceWithKeyword && examples.length < 3) {
              examples.push(sentenceWithKeyword.trim() + ".");
            }
          }
        });
      });

      if (frequency > 0) {
        insights.push({
          theme,
          frequency,
          examples: [...new Set(examples)], // Remove duplicates
          resonance: Math.min(frequency / letterList.length, 1), // Normalize to 0-1
        });
      }
    });

    // Sort by frequency and take top insights
    return insights.sort((a, b) => b.frequency - a.frequency).slice(0, 6);
  };

  const getThemeIcon = (theme: string) => {
    switch (theme) {
      case "Self-Compassion":
        return <Heart className="w-6 h-6" />;
      case "Growth & Learning":
        return <TrendingUp className="w-6 h-6" />;
      case "Relationships":
        return <Users className="w-6 h-6" />;
      case "Dreams & Goals":
        return <Sparkles className="w-6 h-6" />;
      case "Gratitude":
        return <BookOpen className="w-6 h-6" />;
      case "Courage & Resilience":
        return <Brain className="w-6 h-6" />;
      default:
        return <Heart className="w-6 h-6" />;
    }
  };

  const getThemeColor = (index: number) => {
    const colors = [
      "from-pink-500 to-rose-500",
      "from-blue-500 to-indigo-500",
      "from-green-500 to-emerald-500",
      "from-purple-500 to-violet-500",
      "from-orange-500 to-red-500",
      "from-cyan-500 to-blue-500",
    ];
    return colors[index % colors.length];
  };

  const totalWords = letters.reduce(
    (sum, letter) => sum + (letter.wordCount || 0),
    0,
  );
  const averageWordsPerLetter = Math.round(totalWords / letters.length);

  return (
    <div className="text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
          Collective Wisdom Analysis
        </h2>

        {isAnalyzing ? (
          <motion.div className="space-y-8">
            <div className="flex justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="p-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white"
              >
                <Brain className="w-12 h-12" />
              </motion.div>
            </div>

            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-lg text-gray-700 dark:text-gray-300"
              >
                Analyzing {letters.length} letters for wisdom patterns...
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="text-sm text-gray-500 dark:text-gray-400"
              >
                Identifying common themes and meaningful insights...
              </motion.div>
            </div>
          </motion.div>
        ) : showResults ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Summary Stats */}
            <div
              className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 
                          rounded-xl p-8 max-w-4xl mx-auto"
            >
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
                Letter Collection Summary
              </h3>

              <div className="grid md:grid-cols-4 gap-6 text-center">
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                    {letters.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Total Letters
                  </div>
                </div>

                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                    {totalWords.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Words of Wisdom
                  </div>
                </div>

                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-pink-600 dark:text-pink-400 mb-2">
                    {averageWordsPerLetter}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Avg. Words/Letter
                  </div>
                </div>

                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                    {insights.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Key Themes
                  </div>
                </div>
              </div>
            </div>

            {/* Wisdom Themes */}
            <div className="max-w-6xl mx-auto">
              <h3 className="text-xl font-semibold mb-8 text-gray-800 dark:text-white">
                Common Wisdom Themes
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                {insights.map((insight, index) => (
                  <motion.div
                    key={insight.theme}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-6 bg-gradient-to-r ${getThemeColor(
                      index,
                    )} rounded-xl text-white`}
                  >
                    <div className="flex items-center mb-4">
                      <div className="p-3 bg-white/20 rounded-full mr-4">
                        {getThemeIcon(insight.theme)}
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold">
                          {insight.theme}
                        </h4>
                        <div className="text-white/80 text-sm">
                          Mentioned {insight.frequency} times
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/10 rounded-lg p-4">
                      <h5 className="font-medium mb-2 text-white/90">
                        Sample Insights:
                      </h5>
                      <div className="space-y-2">
                        {insight.examples.slice(0, 2).map((example, i) => (
                          <div key={i} className="text-sm text-white/80 italic">
                            "{example}"
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm text-white/80 mb-1">
                        <span>Resonance Level</span>
                        <span>{Math.round(insight.resonance * 100)}%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div
                          className="bg-white rounded-full h-2 transition-all duration-1000"
                          style={{ width: `${insight.resonance * 100}%` }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Reflection Questions */}
            <div
              className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 
                          border border-yellow-200 dark:border-yellow-800 rounded-xl p-8 max-w-4xl mx-auto"
            >
              <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-4">
                Questions for Reflection
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-left">
                <div className="space-y-2">
                  <div className="text-sm text-yellow-700 dark:text-yellow-300">
                    • Which theme resonates most with your own journey?
                  </div>
                  <div className="text-sm text-yellow-700 dark:text-yellow-300">
                    • What surprised you about the collective wisdom?
                  </div>
                  <div className="text-sm text-yellow-700 dark:text-yellow-300">
                    • How might you apply these insights to your daily life?
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-yellow-700 dark:text-yellow-300">
                    • What themes were missing that you expected to see?
                  </div>
                  <div className="text-sm text-yellow-700 dark:text-yellow-300">
                    • How do these patterns reflect our shared human experience?
                  </div>
                  <div className="text-sm text-yellow-700 dark:text-yellow-300">
                    • What would you add to this collective wisdom?
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                This analysis reveals the beautiful patterns in our collective
                hopes, dreams, and wisdom. Each letter contributes to a larger
                tapestry of human experience and growth.
              </p>

              <Button
                onClick={() => {
                  // In a real implementation, this might export results or return to menu
                  window.location.reload();
                }}
                size="lg"
              >
                Start New Game
              </Button>
            </div>
          </motion.div>
        ) : null}
      </motion.div>
    </div>
  );
};
