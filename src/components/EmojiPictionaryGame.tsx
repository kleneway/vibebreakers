"use client";

import React, { useState, useEffect } from "react";
import { Shuffle, Clock, Users, Trophy } from "lucide-react";

interface EmojiPrompt {
  emojis: string;
  answer: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
}

const emojiPrompts: EmojiPrompt[] = [
  {
    emojis: "🎬🍿",
    answer: "Movie Theater",
    category: "Places",
    difficulty: "easy",
  },
  { emojis: "🌧️🌈", answer: "Rainbow", category: "Nature", difficulty: "easy" },
  {
    emojis: "🏠❤️",
    answer: "Home Sweet Home",
    category: "Sayings",
    difficulty: "medium",
  },
  {
    emojis: "🐱‍👤🔪",
    answer: "Cat Burglar",
    category: "Professions",
    difficulty: "medium",
  },
  {
    emojis: "🌙🚶‍♂️",
    answer: "Moonwalk",
    category: "Actions",
    difficulty: "medium",
  },
  {
    emojis: "🦋🥊",
    answer: "Float like a butterfly",
    category: "Sayings",
    difficulty: "hard",
  },
  {
    emojis: "🎸⭐",
    answer: "Rockstar",
    category: "Professions",
    difficulty: "easy",
  },
  {
    emojis: "🔥🎯",
    answer: "On Fire",
    category: "Sayings",
    difficulty: "medium",
  },
];

export default function EmojiPictionaryGame() {
  const [currentPrompt, setCurrentPrompt] = useState<EmojiPrompt | null>(null);
  const [userGuess, setUserGuess] = useState("");
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      endGame();
    }
  }, [gameStarted, timeLeft]);

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setStreak(0);
    setTimeLeft(60);
    generateNewPrompt();
  };

  const generateNewPrompt = () => {
    const randomPrompt =
      emojiPrompts[Math.floor(Math.random() * emojiPrompts.length)];
    setCurrentPrompt(randomPrompt);
    setUserGuess("");
    setShowAnswer(false);
    setIsCorrect(null);
  };

  const submitGuess = () => {
    if (!currentPrompt || !userGuess.trim()) return;

    const isGuessCorrect =
      userGuess.toLowerCase().trim() === currentPrompt.answer.toLowerCase();
    setIsCorrect(isGuessCorrect);
    setShowAnswer(true);

    if (isGuessCorrect) {
      const points =
        currentPrompt.difficulty === "easy"
          ? 10
          : currentPrompt.difficulty === "medium"
          ? 20
          : 30;
      setScore(score + points + streak * 5);
      setStreak(streak + 1);
    } else {
      setStreak(0);
    }

    setTimeout(() => {
      generateNewPrompt();
    }, 2000);
  };

  const skipPrompt = () => {
    setStreak(0);
    generateNewPrompt();
  };

  const endGame = () => {
    setGameStarted(false);
    setTimeLeft(0);
  };

  const resetGame = () => {
    setGameStarted(false);
    setScore(0);
    setStreak(0);
    setTimeLeft(60);
    setCurrentPrompt(null);
    setUserGuess("");
    setShowAnswer(false);
    setIsCorrect(null);
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
          <div className="text-6xl mb-6">🎭🎯</div>
          <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-white">
            Emoji Pictionary
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Decode the emojis to guess the word or phrase! You have 60 seconds
            to score as many points as possible.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-purple-100 dark:bg-purple-800 p-4 rounded-lg">
              <Clock className="w-8 h-8 text-purple-600 dark:text-purple-300 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-800 dark:text-white">
                60 Seconds
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Race against time
              </p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-800 p-4 rounded-lg">
              <Trophy className="w-8 h-8 text-blue-600 dark:text-blue-300 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-800 dark:text-white">
                Score Points
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Build streaks for bonus
              </p>
            </div>
            <div className="bg-green-100 dark:bg-green-800 p-4 rounded-lg">
              <Users className="w-8 h-8 text-green-600 dark:text-green-300 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-800 dark:text-white">
                Multiple Categories
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Places, sayings, and more
              </p>
            </div>
          </div>

          <button
            onClick={startGame}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Start Game 🚀
          </button>
        </div>
      </div>
    );
  }

  if (timeLeft === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">
            Game Over!
          </h2>
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-800 dark:to-pink-800 p-6 rounded-xl mb-6">
            <div className="text-4xl font-bold text-purple-600 dark:text-purple-300 mb-2">
              {score}
            </div>
            <div className="text-lg text-gray-700 dark:text-gray-300">
              Final Score
            </div>
          </div>
          <button
            onClick={resetGame}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl mr-4"
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-300">
                Score: {score}
              </div>
              {streak > 0 && (
                <div className="bg-orange-100 dark:bg-orange-800 px-3 py-1 rounded-full">
                  <span className="text-orange-600 dark:text-orange-300 text-sm font-semibold">
                    🔥 Streak: {streak}
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Clock className="w-5 h-5" />
              <span
                className={timeLeft <= 10 ? "text-red-500 animate-pulse" : ""}
              >
                {timeLeft}s
              </span>
            </div>
          </div>
        </div>

        {/* Game Area */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          {currentPrompt && (
            <>
              <div className="text-center mb-8">
                <div className="text-8xl mb-4 leading-none">
                  {currentPrompt.emojis}
                </div>
                <div className="flex justify-center gap-2 mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      currentPrompt.difficulty === "easy"
                        ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200"
                        : currentPrompt.difficulty === "medium"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200"
                        : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200"
                    }`}
                  >
                    {currentPrompt.difficulty.toUpperCase()}
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200">
                    {currentPrompt.category}
                  </span>
                </div>
              </div>

              {showAnswer ? (
                <div className="text-center">
                  <div className={`text-6xl mb-4 ${isCorrect ? "🎉" : "😔"}`}>
                    {isCorrect ? "🎉" : "😔"}
                  </div>
                  <div
                    className={`text-2xl font-bold mb-2 ${
                      isCorrect
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {isCorrect ? "Correct!" : "Not quite!"}
                  </div>
                  <div className="text-xl text-gray-700 dark:text-gray-300 mb-4">
                    The answer was:{" "}
                    <span className="font-bold">{currentPrompt.answer}</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <input
                      type="text"
                      value={userGuess}
                      onChange={(e) => setUserGuess(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && submitGuess()}
                      placeholder="Enter your guess..."
                      className="flex-1 px-4 py-3 text-lg border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:border-purple-500 dark:bg-gray-700 dark:text-white focus:outline-none"
                    />
                    <button
                      onClick={submitGuess}
                      disabled={!userGuess.trim()}
                      className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl transition-all duration-200"
                    >
                      Submit
                    </button>
                  </div>

                  <div className="flex justify-center">
                    <button
                      onClick={skipPrompt}
                      className="flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                    >
                      <Shuffle className="w-4 h-4" />
                      Skip this one
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
