"use client";

import { motion } from "framer-motion";
import { Era } from "./TimeTravelGame";

interface EraSelectorProps {
  eras: Era[];
  currentIndex: number;
}

export const EraSelector: React.FC<EraSelectorProps> = ({
  eras,
  currentIndex,
}) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
        Your Journey Through Time
      </h3>

      <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
        {eras.map((era, index) => (
          <motion.div
            key={era.id}
            className={`
              relative px-3 py-2 sm:px-4 sm:py-3 rounded-lg text-center min-w-[120px] sm:min-w-[140px]
              ${
                index === currentIndex
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                  : index < currentIndex
                  ? "bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 border border-green-300 dark:border-green-600"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600"
              }
            `}
            animate={{
              scale: index === currentIndex ? 1.05 : 1,
              opacity: index === currentIndex ? 1 : 0.8,
            }}
            transition={{ duration: 0.3 }}
          >
            {/* Era Number Badge */}
            <div
              className={`
              absolute -top-2 -left-2 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center
              ${
                index === currentIndex
                  ? "bg-yellow-400 text-yellow-900"
                  : index < currentIndex
                  ? "bg-green-500 text-white"
                  : "bg-gray-400 text-white"
              }
            `}
            >
              {index + 1}
            </div>

            {/* Era Content */}
            <div className="text-sm sm:text-base font-semibold">{era.name}</div>
            <div className="text-xs sm:text-sm opacity-75 mt-1">{era.year}</div>

            {/* Status Indicator */}
            {index < currentIndex && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-2 h-2 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}

            {index === currentIndex && (
              <motion.div
                className="absolute -bottom-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
              />
            )}
          </motion.div>
        ))}
      </div>

      {/* Current Era Description */}
      {currentIndex >= 0 && currentIndex < eras.length && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-center"
        >
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
            {eras[currentIndex].description}
          </p>
        </motion.div>
      )}

      {/* Progress Bar */}
      <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <motion.div
          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{
            width: `${((currentIndex + 1) / eras.length) * 100}%`,
          }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
};
