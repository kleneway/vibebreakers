"use client";

import React, { useState } from "react";
import { FutureSelfLetters } from "@/components/FutureSelfLetters";
import { WisdomInsight } from "@/lib/types";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, Users, Sparkles } from "lucide-react";
import Link from "next/link";

const FutureSelfLettersPage: React.FC = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [insights, setInsights] = useState<WisdomInsight[]>([]);

  const handleGameComplete = (gameInsights: WisdomInsight[]) => {
    setInsights(gameInsights);
    setGameComplete(true);
  };

  const startGame = () => {
    setGameStarted(true);
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameComplete(false);
    setInsights([]);
  };

  if (gameStarted) {
    return (
      <FutureSelfLetters
        onGameComplete={handleGameComplete}
        playerNames={["Alex", "Jordan", "Sam", "Taylor"]}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Games
          </Link>

          <div className="flex items-center justify-center mb-6">
            <motion.div
              className="p-4 bg-white dark:bg-gray-800 rounded-full shadow-lg mr-4"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Heart className="w-8 h-8 text-purple-500" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white">
              Future Self Letters
            </h1>
          </div>

          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Write heartfelt letters to your future self, then exchange them
            anonymously with others for mutual inspiration and wisdom. Discover
            the beautiful patterns in our collective hopes and dreams.
          </p>
        </motion.div>

        {/* Game Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-8 mb-12"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full w-fit mb-4">
              <Heart className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              Personal Letters
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Write 2 intimate letters to your future self at different time
              horizons. Use guided prompts to explore your hopes, dreams, and
              wisdom.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full w-fit mb-4">
              <Users className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              Anonymous Exchange
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Letters are shuffled and redistributed anonymously. Read advice
              and encouragement written by others for their future selves.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full w-fit mb-4">
              <Sparkles className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              Collective Wisdom
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Discover common themes and insights from everyone's letters. See
              the beautiful patterns in our shared human experience.
            </p>
          </div>
        </motion.div>

        {/* How to Play */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl mb-12"
        >
          <h2 className="text-2xl font-semibold mb-8 text-center text-gray-800 dark:text-white">
            How to Play
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  1
                </span>
              </div>
              <h3 className="font-semibold mb-2 text-gray-800 dark:text-white">
                Time Frames
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Get assigned 2 random time horizons to write to (6 months to 25
                years).
              </p>
            </div>

            <div className="text-center">
              <div className="p-4 bg-purple-100 dark:bg-purple-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-purple-600 dark:text-purple-400">
                  2
                </span>
              </div>
              <h3 className="font-semibold mb-2 text-gray-800 dark:text-white">
                Write Letters
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Use guided prompts to write authentic, encouraging letters to
                your future self.
              </p>
            </div>

            <div className="text-center">
              <div className="p-4 bg-green-100 dark:bg-green-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-green-600 dark:text-green-400">
                  3
                </span>
              </div>
              <h3 className="font-semibold mb-2 text-gray-800 dark:text-white">
                Exchange
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Letters are shuffled anonymously. Read others' letters for
                inspiration.
              </p>
            </div>

            <div className="text-center">
              <div className="p-4 bg-orange-100 dark:bg-orange-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-orange-600 dark:text-orange-400">
                  4
                </span>
              </div>
              <h3 className="font-semibold mb-2 text-gray-800 dark:text-white">
                Reflect
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Share insights and discover collective wisdom patterns.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Ready to Connect Across Time?
            </h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Join others in this beautiful exercise of self-reflection and
              mutual inspiration. Your words today might be exactly what someone
              else needs to hear.
            </p>

            <motion.button
              onClick={startGame}
              className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-lg font-semibold 
                       text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Your Letter Journey
            </motion.button>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p className="mb-2">📝 Takes about 20-25 minutes to complete</p>
            <p>💝 Best with 3-6 participants for meaningful exchanges</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FutureSelfLettersPage;
