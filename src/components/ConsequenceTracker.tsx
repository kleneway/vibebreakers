"use client";

import { motion } from "framer-motion";
import { Decision } from "./TimeTravelGame";
import { Button } from "./Button";

interface ConsequenceTrackerProps {
  decision: Decision;
  onContinue: () => void;
  isLastEra: boolean;
}

export const ConsequenceTracker: React.FC<ConsequenceTrackerProps> = ({
  decision,
  onContinue,
  isLastEra,
}) => {
  const { choice } = decision;

  const getImpactIcon = (benefitsNextEra: boolean) => {
    return benefitsNextEra ? "✅" : "⚠️";
  };

  const getImpactText = (benefitsNextEra: boolean) => {
    return benefitsNextEra
      ? "This choice will benefit future eras"
      : "This choice may create challenges ahead";
  };

  const getImpactStyle = (benefitsNextEra: boolean) => {
    return benefitsNextEra
      ? "border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/30"
      : "border-orange-300 dark:border-orange-600 bg-orange-50 dark:bg-orange-900/30";
  };

  return (
    <div className="space-y-6">
      {/* Ripple Effect Animation */}
      <div className="relative flex justify-center">
        <motion.div
          className="absolute w-32 h-32 border-4 border-blue-500 rounded-full"
          animate={{
            scale: [1, 2, 3],
            opacity: [1, 0.5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
        <motion.div
          className="absolute w-32 h-32 border-4 border-purple-500 rounded-full"
          animate={{
            scale: [1, 2, 3],
            opacity: [1, 0.5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: 0.5,
            ease: "easeOut",
          }}
        />
        <div className="relative z-10 w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <span className="text-white text-4xl">⏱️</span>
        </div>
      </div>

      {/* Decision Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center"
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          Ripples Through Time
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
          Your choice:{" "}
          <span className="font-semibold text-blue-600 dark:text-blue-400">
            "{choice.text}"
          </span>
        </p>
        <p className="text-gray-500 dark:text-gray-400">
          The consequences of this decision echo through history...
        </p>
      </motion.div>

      {/* Immediate Consequences */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
      >
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
          <span className="mr-2">⚡</span>
          Immediate Impact
        </h3>
        <div className="space-y-3">
          {choice.consequences.map((consequence, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.2 }}
              className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <span className="text-blue-500 text-lg">•</span>
              <p className="text-gray-700 dark:text-gray-300">{consequence}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Future Era Impact */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
        className={`p-6 rounded-lg shadow-lg border-2 ${getImpactStyle(
          choice.benefitsNextEra,
        )}`}
      >
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <span className="mr-2">{getImpactIcon(choice.benefitsNextEra)}</span>
          <span
            className={
              choice.benefitsNextEra
                ? "text-green-800 dark:text-green-200"
                : "text-orange-800 dark:text-orange-200"
            }
          >
            Temporal Consequences
          </span>
        </h3>
        <p
          className={`text-lg ${
            choice.benefitsNextEra
              ? "text-green-700 dark:text-green-300"
              : "text-orange-700 dark:text-orange-300"
          }`}
        >
          {getImpactText(choice.benefitsNextEra)}
        </p>

        {/* Show specific future impacts */}
        <div className="mt-4 space-y-2">
          {choice.unlockOptions.length > 0 && (
            <div className="bg-green-100 dark:bg-green-800 p-3 rounded-lg">
              <p className="font-semibold text-green-800 dark:text-green-200 mb-1">
                Future Opportunities Unlocked:
              </p>
              <div className="flex flex-wrap gap-2">
                {choice.unlockOptions.map((option, index) => (
                  <span
                    key={index}
                    className="bg-green-200 dark:bg-green-700 text-green-800 dark:text-green-200 px-2 py-1 rounded text-sm"
                  >
                    {option.replace(/_/g, " ")}
                  </span>
                ))}
              </div>
            </div>
          )}

          {choice.blocksOptions.length > 0 && (
            <div className="bg-red-100 dark:bg-red-800 p-3 rounded-lg">
              <p className="font-semibold text-red-800 dark:text-red-200 mb-1">
                Future Paths Closed:
              </p>
              <div className="flex flex-wrap gap-2">
                {choice.blocksOptions.map((option, index) => (
                  <span
                    key={index}
                    className="bg-red-200 dark:bg-red-700 text-red-800 dark:text-red-200 px-2 py-1 rounded text-sm"
                  >
                    {option.replace(/_/g, " ")}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Historical Wisdom */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3 }}
        className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-6 rounded-lg shadow-lg"
      >
        <h3 className="text-xl font-semibold mb-3 flex items-center">
          <span className="mr-2">🧠</span>
          Historical Wisdom
        </h3>
        <p className="text-lg opacity-90">
          "Every decision in history creates ripples that reach across time. The
          choices we make today become the foundation upon which future
          generations build their world."
        </p>
        <p className="text-sm opacity-75 mt-2 italic">
          — Wisdom from the Time Travelers
        </p>
      </motion.div>

      {/* Continue Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5 }}
        className="text-center"
      >
        <Button onClick={onContinue} size="lg" className="px-8 py-4">
          {isLastEra ? "Analyze Your Journey" : "Continue to Next Era"}
        </Button>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
          {isLastEra
            ? "Ready to see how your choices shaped history?"
            : "Your journey through time continues..."}
        </p>
      </motion.div>
    </div>
  );
};
