"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Decision, Era } from "./TimeTravelGame";
import { Button } from "./Button";

interface TemporalReportProps {
  decisions: Decision[];
  eras: Era[];
  onComplete: () => void;
}

interface DecisionPattern {
  riskTaking: number;
  altruism: number;
  innovation: number;
  collaboration: number;
  longTermThinking: number;
}

interface PersonalityInsight {
  title: string;
  description: string;
  score: number;
  icon: string;
}

export const TemporalReport: React.FC<TemporalReportProps> = ({
  decisions,
  eras,
  onComplete,
}) => {
  const [currentSection, setCurrentSection] = useState(0);

  // Analyze decision patterns
  const analyzeDecisionPatterns = (): DecisionPattern => {
    let riskTaking = 0;
    let altruism = 0;
    let innovation = 0;
    let collaboration = 0;
    let longTermThinking = 0;

    decisions.forEach((decision) => {
      const choice = decision.choice;

      // Risk-taking analysis
      if (
        choice.id.includes("experiment") ||
        choice.id.includes("radical") ||
        choice.id.includes("underground") ||
        choice.id.includes("open_source")
      ) {
        riskTaking += 1;
      }

      // Altruism analysis
      if (
        choice.id.includes("help") ||
        choice.id.includes("save") ||
        choice.id.includes("protect") ||
        choice.id.includes("prevention") ||
        choice.id.includes("worker") ||
        choice.id.includes("privacy")
      ) {
        altruism += 1;
      }

      // Innovation analysis
      if (
        choice.benefitsNextEra &&
        (choice.id.includes("new") ||
          choice.id.includes("experiment") ||
          choice.id.includes("innovation"))
      ) {
        innovation += 1;
      }

      // Collaboration analysis
      if (
        choice.id.includes("cooperation") ||
        choice.id.includes("democratic") ||
        choice.id.includes("ownership") ||
        choice.id.includes("open") ||
        choice.id.includes("seek_external")
      ) {
        collaboration += 1;
      }

      // Long-term thinking analysis
      if (
        choice.benefitsNextEra ||
        choice.id.includes("future") ||
        choice.id.includes("infrastructure") ||
        choice.id.includes("education")
      ) {
        longTermThinking += 1;
      }
    });

    const totalDecisions = decisions.length;
    return {
      riskTaking: (riskTaking / totalDecisions) * 100,
      altruism: (altruism / totalDecisions) * 100,
      innovation: (innovation / totalDecisions) * 100,
      collaboration: (collaboration / totalDecisions) * 100,
      longTermThinking: (longTermThinking / totalDecisions) * 100,
    };
  };

  const generatePersonalityInsights = (
    patterns: DecisionPattern,
  ): PersonalityInsight[] => {
    const insights: PersonalityInsight[] = [
      {
        title: "The Trailblazer",
        description:
          "You tend to take calculated risks and embrace new possibilities, even when the outcome is uncertain.",
        score: patterns.riskTaking,
        icon: "🚀",
      },
      {
        title: "The Guardian",
        description:
          "Your decisions consistently prioritize the wellbeing of others and the greater good.",
        score: patterns.altruism,
        icon: "🛡️",
      },
      {
        title: "The Innovator",
        description:
          "You embrace change and progress, often choosing paths that advance human knowledge and capability.",
        score: patterns.innovation,
        icon: "💡",
      },
      {
        title: "The Collaborator",
        description:
          "You believe in the power of collective action and shared decision-making.",
        score: patterns.collaboration,
        icon: "🤝",
      },
      {
        title: "The Visionary",
        description:
          "Your choices reflect deep consideration for long-term consequences and future generations.",
        score: patterns.longTermThinking,
        icon: "🔮",
      },
    ];

    return insights.sort((a, b) => b.score - a.score);
  };

  const getHistoricalArchetype = (patterns: DecisionPattern): string => {
    const dominant = Math.max(
      patterns.riskTaking,
      patterns.altruism,
      patterns.innovation,
      patterns.collaboration,
      patterns.longTermThinking,
    );

    if (patterns.innovation === dominant) return "Renaissance Polymath";
    if (patterns.altruism === dominant) return "Humanitarian Leader";
    if (patterns.riskTaking === dominant) return "Revolutionary Pioneer";
    if (patterns.collaboration === dominant) return "Democratic Statesman";
    if (patterns.longTermThinking === dominant) return "Wise Sage";
    return "Balanced Diplomat";
  };

  const calculateOverallImpact = (): number => {
    const beneficialChoices = decisions.filter(
      (d) => d.choice.benefitsNextEra,
    ).length;
    return (beneficialChoices / decisions.length) * 100;
  };

  const patterns = analyzeDecisionPatterns();
  const insights = generatePersonalityInsights(patterns);
  const archetype = getHistoricalArchetype(patterns);
  const overallImpact = calculateOverallImpact();

  const sections = [
    {
      title: "Decision Timeline",
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
            Your journey through time and the choices that shaped history
          </p>
          {decisions.map((decision, index) => {
            const era = eras.find((e) => e.id === decision.eraId);
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border-l-4 border-blue-500"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-lg text-gray-900 dark:text-white">
                    {era?.name} - {era?.year}
                  </h4>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      decision.choice.benefitsNextEra
                        ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                        : "bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100"
                    }`}
                  >
                    {decision.choice.benefitsNextEra
                      ? "Beneficial"
                      : "Challenging"}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 italic">
                  "{decision.choice.text}"
                </p>
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Impact: {decision.choice.consequences[0]}
                </div>
              </motion.div>
            );
          })}
        </div>
      ),
    },
    {
      title: "Personality Analysis",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Your Historical Archetype
            </h3>
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-6 rounded-lg shadow-lg">
              <div className="text-4xl mb-2">👑</div>
              <h4 className="text-xl font-semibold">{archetype}</h4>
              <p className="opacity-90 mt-2">
                Based on your decision patterns across the ages
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            {insights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{insight.icon}</span>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {insight.title}
                    </h4>
                  </div>
                  <span className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-sm">
                    {Math.round(insight.score)}%
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {insight.description}
                </p>
                <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${insight.score}%` }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: "Temporal Impact",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Your Legacy Across Time
            </h3>

            {/* Overall Impact Score */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative w-32 h-32 mx-auto mb-6"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-2xl font-bold">
                    {Math.round(overallImpact)}%
                  </div>
                  <div className="text-xs">Positive Impact</div>
                </div>
              </div>
            </motion.div>

            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {overallImpact >= 75
                ? "Your decisions created overwhelmingly positive ripples through time, benefiting countless future generations."
                : overallImpact >= 50
                ? "Your balanced approach created more positive than negative outcomes across history."
                : "Your cautious decisions prioritized immediate stability, though they may have limited long-term progress."}
            </p>
          </div>

          {/* Ripple Effects Visualization */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-700">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <span className="mr-2">🌊</span>
              Ripple Effects Through History
            </h4>

            <div className="space-y-4">
              {decisions.map((decision, index) => {
                const era = eras.find((e) => e.id === decision.eraId);
                const nextEra = eras[index + 1];

                return (
                  nextEra && (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-20 text-center">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {era?.year}
                        </div>
                      </div>
                      <div className="flex-1 flex items-center">
                        <div
                          className={`w-4 h-4 rounded-full ${
                            decision.choice.benefitsNextEra
                              ? "bg-green-500"
                              : "bg-orange-500"
                          }`}
                        />
                        <div
                          className={`flex-1 h-1 ${
                            decision.choice.benefitsNextEra
                              ? "bg-green-300"
                              : "bg-orange-300"
                          }`}
                        />
                        <div className="w-2 h-2 bg-gray-400 rounded-full" />
                      </div>
                      <div className="flex-shrink-0 w-20 text-center">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {nextEra?.year}
                        </div>
                      </div>
                    </div>
                  )
                );
              })}
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Temporal Analysis Report
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Understanding your decision patterns across the ages
        </p>
      </div>

      {/* Navigation */}
      <div className="flex justify-center space-x-4 mb-8">
        {sections.map((section, index) => (
          <button
            key={index}
            onClick={() => setCurrentSection(index)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              currentSection === index
                ? "bg-blue-500 text-white shadow-lg"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            {section.title}
          </button>
        ))}
      </div>

      {/* Content */}
      <motion.div
        key={currentSection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="min-h-[400px]"
      >
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
            {sections[currentSection].title}
          </h2>
          {sections[currentSection].content}
        </div>
      </motion.div>

      {/* Complete Button */}
      <div className="text-center">
        <Button onClick={onComplete} size="lg" className="px-8 py-4">
          Complete Journey
        </Button>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
          Thank you for traveling through time with us
        </p>
      </div>
    </div>
  );
};
