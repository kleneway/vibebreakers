"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "./Button";
import { Player } from "@/lib/types";
import { Clock, Calendar, Sparkles } from "lucide-react";

interface TimeFrameSelectorProps {
  player: Player;
  onContinue: () => void;
}

export const TimeFrameSelector: React.FC<TimeFrameSelectorProps> = ({
  player,
  onContinue,
}) => {
  const getTimeFrameIcon = (timeFrame: string) => {
    if (timeFrame.includes("6 months") || timeFrame.includes("2 years")) {
      return <Clock className="w-8 h-8" />;
    } else if (
      timeFrame.includes("5 years") ||
      timeFrame.includes("10 years")
    ) {
      return <Calendar className="w-8 h-8" />;
    } else {
      return <Sparkles className="w-8 h-8" />;
    }
  };

  const getTimeFrameColor = (index: number) => {
    const colors = [
      "from-blue-500 to-blue-600",
      "from-purple-500 to-purple-600",
      "from-green-500 to-green-600",
      "from-orange-500 to-orange-600",
      "from-pink-500 to-pink-600",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
          {player.name}, Your Time Horizons
        </h2>

        <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          You've been randomly assigned these time horizons for your letters.
          Each represents a different stage of your future journey where wisdom
          and perspective will vary.
        </p>

        <div className="grid gap-6 mb-8 max-w-2xl mx-auto">
          {player.assignedTimeFrames?.map((timeFrame, index) => (
            <motion.div
              key={timeFrame.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.3, duration: 0.5 }}
              className={`p-6 bg-gradient-to-r ${getTimeFrameColor(
                index,
              )} rounded-xl text-white shadow-lg`}
            >
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-white/20 rounded-full mr-4">
                  {getTimeFrameIcon(timeFrame.value)}
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-semibold">
                    {timeFrame.label} from now
                  </h3>
                  <p className="text-white/90 text-sm">
                    {timeFrame.description}
                  </p>
                </div>
              </div>

              <div className="bg-white/10 rounded-lg p-4 mt-4">
                <p className="text-sm text-white/90">
                  You'll write a letter to who you'll be in{" "}
                  <strong>{timeFrame.value}</strong>. Think about the advice,
                  encouragement, and wisdom you'd want to share with that future
                  version of yourself.
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-8"
        >
          <h3 className="font-semibold text-gray-800 dark:text-white mb-3">
            Writing Tips:
          </h3>
          <ul className="text-left text-gray-600 dark:text-gray-300 space-y-2 max-w-md mx-auto">
            <li>• Write as if talking to a close friend</li>
            <li>• Include both encouragement and honest advice</li>
            <li>• Share what you hope they'll remember about this time</li>
            <li>• Don't worry about perfection - authenticity matters more</li>
          </ul>
        </motion.div>

        <Button onClick={onContinue} size="lg">
          Start Writing Letters
        </Button>
      </motion.div>
    </div>
  );
};
