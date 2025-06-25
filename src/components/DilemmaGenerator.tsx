"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Era, Choice, Decision } from "./TimeTravelGame";
import { Button } from "./Button";

interface DilemmaGeneratorProps {
  era: Era;
  onChoice: (choice: Choice) => void;
  availableOptions: string[];
  blockedOptions: string[];
  previousDecisions: Decision[];
}

// Dilemma database organized by era and theme
interface DilemmaData {
  scenario: string;
  choices: Choice[];
}

interface DilemmaDatabase {
  [eraId: string]: {
    [theme: string]: DilemmaData;
  };
}

const DILEMMAS: DilemmaDatabase = {
  ancient_rome: {
    "power-struggle": {
      scenario:
        "The Senate has been dissolved and three generals vie for control of Rome. As a citizen with influence, your choice could tip the balance of power.",
      choices: [
        {
          id: "support_strongest",
          text: "Support the strongest general for stability",
          consequences: [
            "Stability achieved but at the cost of democracy",
            "You gain favor with the new ruler",
          ],
          benefitsNextEra: true,
          blocksOptions: [],
          unlockOptions: ["political_influence"],
        },
        {
          id: "support_democratic",
          text: "Rally citizens to restore the Republic",
          consequences: [
            "Chaos continues but democratic ideals survive",
            "You become a symbol of resistance",
          ],
          benefitsNextEra: false,
          blocksOptions: ["authoritarian_rule"],
          unlockOptions: ["democratic_ideals"],
        },
        {
          id: "remain_neutral",
          text: "Stay neutral and protect your family",
          consequences: [
            "Your family survives but Rome burns",
            "Future generations question your courage",
          ],
          benefitsNextEra: false,
          blocksOptions: ["leadership_role"],
          unlockOptions: [],
        },
        {
          id: "flee_rome",
          text: "Flee to the countryside",
          consequences: [
            "Safety for now but you abandon your duty",
            "You lose all influence in Rome",
          ],
          benefitsNextEra: false,
          blocksOptions: ["civic_engagement"],
          unlockOptions: [],
        },
      ],
    },
  },
  medieval_england: {
    survival: {
      scenario:
        "The Black Death has arrived at your village. As a healer, people look to you for guidance on how to survive this plague.",
      choices: [
        {
          id: "traditional_herbs",
          text: "Use traditional herbal remedies",
          consequences: [
            "Some people recover through luck",
            "You maintain trust through familiar methods",
          ],
          benefitsNextEra: false,
          blocksOptions: [],
          unlockOptions: ["traditional_wisdom"],
        },
        {
          id: "experiment_new",
          text: "Experiment with new treatment methods",
          consequences: [
            "Innovation leads to better outcomes",
            "Some call you a heretic",
          ],
          benefitsNextEra: true,
          blocksOptions: ["conservative_approach"],
          unlockOptions: ["scientific_method"],
        },
        {
          id: "focus_prevention",
          text: "Focus on prevention and sanitation",
          consequences: [
            "Fewer people get sick",
            "You save more lives through prevention",
          ],
          benefitsNextEra: true,
          blocksOptions: [],
          unlockOptions: ["public_health"],
        },
        {
          id: "leave_village",
          text: "Leave the village to save yourself",
          consequences: [
            "You survive but many die without your help",
            "Guilt haunts your future decisions",
          ],
          benefitsNextEra: false,
          blocksOptions: ["community_trust"],
          unlockOptions: [],
        },
      ],
    },
  },
  renaissance_italy: {
    innovation: {
      scenario:
        "You've discovered a revolutionary artistic technique, but the Church considers it blasphemous. Meanwhile, a wealthy patron offers funding.",
      choices: [
        {
          id: "church_approval",
          text: "Seek Church approval first",
          consequences: [
            "Art becomes sanitized but accepted",
            "You avoid persecution but limit innovation",
          ],
          benefitsNextEra: false,
          blocksOptions: ["radical_innovation"],
          unlockOptions: ["institutional_support"],
        },
        {
          id: "patron_funding",
          text: "Accept patron funding and create freely",
          consequences: [
            "Art flourishes but creates controversy",
            "You inspire future artists to take risks",
          ],
          benefitsNextEra: true,
          blocksOptions: ["conservative_art"],
          unlockOptions: ["artistic_freedom"],
        },
        {
          id: "underground_art",
          text: "Create in secret with like-minded artists",
          consequences: [
            "Revolution starts quietly",
            "You build a network of innovators",
          ],
          benefitsNextEra: true,
          blocksOptions: [],
          unlockOptions: ["underground_movement"],
        },
        {
          id: "abandon_technique",
          text: "Abandon the technique to avoid conflict",
          consequences: [
            "Innovation is lost to history",
            "You live safely but with regret",
          ],
          benefitsNextEra: false,
          blocksOptions: ["innovative_spirit"],
          unlockOptions: [],
        },
      ],
    },
  },
  industrial_revolution: {
    progress: {
      scenario:
        "Your factory can triple production with new machines, but it will eliminate 200 jobs. The displaced workers have families to feed.",
      choices: [
        {
          id: "implement_gradually",
          text: "Implement gradually with retraining programs",
          consequences: [
            "Slower progress but fewer suffer",
            "Workers adapt to new technologies",
          ],
          benefitsNextEra: true,
          blocksOptions: [],
          unlockOptions: ["worker_education"],
        },
        {
          id: "full_automation",
          text: "Implement full automation immediately",
          consequences: [
            "Maximum efficiency but social unrest",
            "Profits soar but at human cost",
          ],
          benefitsNextEra: true,
          blocksOptions: ["worker_loyalty"],
          unlockOptions: ["industrial_efficiency"],
        },
        {
          id: "worker_ownership",
          text: "Offer workers ownership shares in the factory",
          consequences: [
            "Innovation with shared benefits",
            "You create a new model of industry",
          ],
          benefitsNextEra: true,
          blocksOptions: ["traditional_hierarchy"],
          unlockOptions: ["cooperative_model"],
        },
        {
          id: "reject_machines",
          text: "Reject the new machines entirely",
          consequences: [
            "Jobs saved but competitors advance",
            "You fall behind technological progress",
          ],
          benefitsNextEra: false,
          blocksOptions: ["technological_advancement"],
          unlockOptions: ["worker_preservation"],
        },
      ],
    },
  },
  current_day: {
    connectivity: {
      scenario:
        "You've developed an AI system that could revolutionize education, but it raises serious privacy concerns about children's data.",
      choices: [
        {
          id: "strict_privacy",
          text: "Implement with strict privacy protections",
          consequences: [
            "Limited functionality but ethical",
            "Trust builds slowly but surely",
          ],
          benefitsNextEra: true,
          blocksOptions: ["data_exploitation"],
          unlockOptions: ["ethical_tech"],
        },
        {
          id: "optimize_learning",
          text: "Optimize for learning outcomes using data",
          consequences: [
            "Better education but privacy risks",
            "Massive impact on learning worldwide",
          ],
          benefitsNextEra: true,
          blocksOptions: ["privacy_first"],
          unlockOptions: ["educational_revolution"],
        },
        {
          id: "open_source",
          text: "Make it open source for transparency",
          consequences: [
            "Transparency but unpredictable modifications",
            "Community develops it further",
          ],
          benefitsNextEra: true,
          blocksOptions: ["proprietary_control"],
          unlockOptions: ["open_innovation"],
        },
        {
          id: "shelve_project",
          text: "Shelve the project until regulations exist",
          consequences: [
            "No immediate impact but missed opportunity",
            "Others may develop less ethical versions",
          ],
          benefitsNextEra: false,
          blocksOptions: ["first_mover_advantage"],
          unlockOptions: ["regulatory_compliance"],
        },
      ],
    },
  },
  climate_crisis: {
    adaptation: {
      scenario:
        "Your city must choose how to use its last remaining resources: save the current population or invest in long-term survival infrastructure.",
      choices: [
        {
          id: "save_current",
          text: "Use resources to save current population",
          consequences: [
            "Immediate lives saved but no future planning",
            "Next generation faces worse crisis",
          ],
          benefitsNextEra: false,
          blocksOptions: ["future_planning"],
          unlockOptions: ["humanitarian_priority"],
        },
        {
          id: "future_infrastructure",
          text: "Invest in survival infrastructure",
          consequences: [
            "Current suffering but future survival",
            "Difficult choices enable species survival",
          ],
          benefitsNextEra: true,
          blocksOptions: ["immediate_relief"],
          unlockOptions: ["long_term_planning"],
        },
        {
          id: "balanced_approach",
          text: "Split resources between both needs",
          consequences: [
            "Partial success in both areas",
            "Compromise may not be enough for either",
          ],
          benefitsNextEra: false,
          blocksOptions: [],
          unlockOptions: ["balanced_thinking"],
        },
        {
          id: "seek_external",
          text: "Seek help from other surviving cities",
          consequences: [
            "Cooperation but dependency",
            "Collective survival through unity",
          ],
          benefitsNextEra: true,
          blocksOptions: ["self_reliance"],
          unlockOptions: ["inter_city_cooperation"],
        },
      ],
    },
  },
};

export const DilemmaGenerator: React.FC<DilemmaGeneratorProps> = ({
  era,
  onChoice,
  availableOptions,
  blockedOptions,
  previousDecisions,
}) => {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [showingDetails, setShowingDetails] = useState<string | null>(null);

  // Get the appropriate dilemma for this era
  const dilemma =
    DILEMMAS[era.id as keyof typeof DILEMMAS]?.[
      era.theme as keyof (typeof DILEMMAS)[keyof typeof DILEMMAS]
    ];

  if (!dilemma) {
    return (
      <div className="bg-red-100 dark:bg-red-900 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">
          Dilemma Not Found
        </h3>
        <p className="text-red-600 dark:text-red-300">
          No dilemma available for {era.name} with theme {era.theme}
        </p>
      </div>
    );
  }

  const handleChoice = (choice: Choice) => {
    setSelectedChoice(choice.id);
    onChoice(choice);
  };

  const isChoiceAvailable = (choice: Choice) => {
    // Check if choice is blocked by previous decisions
    if (blockedOptions.some((blocked) => choice.id.includes(blocked))) {
      return false;
    }
    return true;
  };

  const getChoiceStyle = (choice: Choice) => {
    if (!isChoiceAvailable(choice)) {
      return "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed";
    }
    if (availableOptions.some((available) => choice.id.includes(available))) {
      return "bg-green-100 dark:bg-green-800 border-green-300 dark:border-green-600 text-green-800 dark:text-green-100";
    }
    return "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700";
  };

  return (
    <div className="space-y-6">
      {/* Era Context */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-2">
          {era.name} - {era.year}
        </h2>
        <p className="text-lg opacity-90">{era.description}</p>
      </div>

      {/* Dilemma Scenario */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
      >
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          The Dilemma
        </h3>
        <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
          {dilemma.scenario}
        </p>
      </motion.div>

      {/* Previous Decisions Impact */}
      {previousDecisions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-200 dark:border-blue-700"
        >
          <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
            Echoes from Your Past
          </h4>
          <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            {availableOptions.length > 0 && (
              <p>✓ Your previous choices have unlocked new possibilities</p>
            )}
            {blockedOptions.length > 0 && (
              <p>⚠ Some paths are closed due to earlier decisions</p>
            )}
          </div>
        </motion.div>
      )}

      {/* Choice Options */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          What will you do?
        </h3>

        <div className="grid gap-4">
          {dilemma.choices.map((choice, index) => (
            <motion.div
              key={choice.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`
                p-4 rounded-lg border-2 transition-all cursor-pointer
                ${getChoiceStyle(choice)}
                ${selectedChoice === choice.id ? "ring-2 ring-blue-500" : ""}
              `}
              onClick={() =>
                isChoiceAvailable(choice) &&
                setShowingDetails(
                  showingDetails === choice.id ? null : choice.id,
                )
              }
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-semibold mb-2">{choice.text}</h4>

                  {/* Choice availability indicators */}
                  <div className="flex gap-2 text-xs">
                    {!isChoiceAvailable(choice) && (
                      <span className="bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-300 px-2 py-1 rounded">
                        Blocked by past decisions
                      </span>
                    )}
                    {availableOptions.some((available) =>
                      choice.id.includes(available),
                    ) && (
                      <span className="bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300 px-2 py-1 rounded">
                        Enhanced by past choices
                      </span>
                    )}
                  </div>

                  {/* Show consequences when hovering/selected */}
                  {showingDetails === choice.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600"
                    >
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Potential consequences:
                      </p>
                      <ul className="text-sm space-y-1">
                        {choice.consequences.map((consequence, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-gray-400 mr-2">•</span>
                            {consequence}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </div>

                {isChoiceAvailable(choice) && (
                  <Button
                    onClick={() => {
                      handleChoice(choice);
                    }}
                    size="sm"
                    variant={
                      selectedChoice === choice.id ? "primary" : "secondary"
                    }
                    className="ml-4"
                  >
                    Choose
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Help text */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        Click on choices to see their potential consequences, then decide your
        path through history.
      </div>
    </div>
  );
};
