"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "./Button";
import { Letter, Player } from "@/lib/types";
import { Shuffle, Mail, Users, ArrowRight } from "lucide-react";

interface LetterExchangeProps {
  letters: Letter[];
  players: Player[];
  onContinue: () => void;
}

export const LetterExchange: React.FC<LetterExchangeProps> = ({
  letters,
  players,
  onContinue,
}) => {
  const [shuffleAnimation, setShuffleAnimation] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    // Start shuffle animation
    setShuffleAnimation(true);

    const timer = setTimeout(() => {
      setShuffleAnimation(false);
      setShowResults(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const totalLetters = letters.length;
  const lettersPerPlayer = Math.floor(totalLetters / players.length);

  return (
    <div className="text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
          Anonymous Letter Exchange
        </h2>

        <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Your letters are being shuffled and redistributed anonymously. You'll
          receive letters that others wrote to their future selves, creating a
          beautiful exchange of wisdom and hope.
        </p>

        {!showResults ? (
          <motion.div className="space-y-8">
            {/* Shuffle Animation */}
            <div className="flex justify-center">
              <motion.div
                animate={shuffleAnimation ? { rotate: 360 } : { rotate: 0 }}
                transition={{
                  duration: 2,
                  repeat: shuffleAnimation ? Infinity : 0,
                  ease: "linear",
                }}
                className="p-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-white"
              >
                <Shuffle className="w-12 h-12" />
              </motion.div>
            </div>

            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-lg text-gray-700 dark:text-gray-300"
              >
                Mixing {totalLetters} heartfelt letters...
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="text-sm text-gray-500 dark:text-gray-400"
              >
                Creating anonymous connections across time...
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Exchange Results */}
            <div
              className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 
                          rounded-xl p-8 max-w-3xl mx-auto"
            >
              <div className="flex items-center justify-center mb-6">
                <div className="p-3 bg-green-500 rounded-full text-white mr-4">
                  <Mail className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                  Exchange Complete!
                </h3>
              </div>

              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                    {totalLetters}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Letters Written
                  </div>
                </div>

                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                    {players.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Participants
                  </div>
                </div>

                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                    {lettersPerPlayer}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Letters per Person
                  </div>
                </div>
              </div>
            </div>

            {/* Exchange Visualization */}
            <div className="max-w-4xl mx-auto">
              <h4 className="text-lg font-semibold mb-6 text-gray-800 dark:text-white">
                How Letters Were Distributed
              </h4>

              <div className="grid gap-4">
                {players.map((player, index) => (
                  <motion.div
                    key={player.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full mr-3">
                        <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        {player.name}
                      </span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <span className="mr-2">
                        Wrote {player.writtenLetters?.length || 0}
                      </span>
                      <ArrowRight className="w-4 h-4 mx-2" />
                      <span className="ml-2">Receives {lettersPerPlayer}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div
              className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 
                          rounded-lg p-6 max-w-2xl mx-auto"
            >
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                Reading Guidelines
              </h4>
              <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1 text-left">
                <li>• Read each letter with an open heart</li>
                <li>• Look for advice that resonates with your own journey</li>
                <li>• Remember these were written with genuine care</li>
                <li>• Identities remain anonymous throughout</li>
              </ul>
            </div>

            <Button onClick={onContinue} size="lg">
              Begin Reading Letters
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
