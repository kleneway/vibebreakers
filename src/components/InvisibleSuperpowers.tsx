"use client";

import React, { useState } from "react";
import { Timer } from "./Timer";
import { Button } from "./Button";
import { ObservationPrompts } from "./ObservationPrompts";
import { SuperpowerGenerator } from "./SuperpowerGenerator";
import { StrengthStoryteller } from "./StrengthStoryteller";
import { AppreciationCircle } from "./AppreciationCircle";

export type GamePhase =
  | "setup"
  | "observation"
  | "identification"
  | "evidence"
  | "ceremony"
  | "reflection"
  | "complete";

export interface Player {
  id: string;
  name: string;
}

export interface Superpower {
  id: string;
  playerId: string;
  playerName: string;
  assignedBy: string;
  assignedByName: string;
  name: string;
  category: string;
  evidence: string;
  impact: string;
}

interface InvisibleSuperpowersProps {
  players: Player[];
  onGameComplete?: (results: Superpower[]) => void;
}

const PHASE_DURATIONS = {
  setup: 60,
  observation: 180,
  identification: 120,
  evidence: 90,
  ceremony: 180,
  reflection: 180,
};

const PHASE_DESCRIPTIONS = {
  setup: "Getting ready to discover invisible superpowers",
  observation: "Observe others during casual conversation",
  identification: "Identify invisible superpowers in others",
  evidence: "Gather specific evidence for each superpower",
  ceremony: "Bestow superpowers and celebrate strengths",
  reflection: "Reflect on surprises and integration",
  complete: "Game completed - superpowers discovered!",
};

export function InvisibleSuperpowers({
  players,
  onGameComplete,
}: InvisibleSuperpowersProps) {
  const [currentPhase, setCurrentPhase] = useState<GamePhase>("setup");
  const [timeRemaining, setTimeRemaining] = useState(PHASE_DURATIONS.setup);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [superpowers, setSuperpowers] = useState<Superpower[]>([]);
  const [currentCeremonyIndex, setCurrentCeremonyIndex] = useState(0);
  const [gameResults, setGameResults] = useState<Superpower[]>([]);

  const handleTimerComplete = () => {
    setIsTimerActive(false);
    advancePhase();
  };

  const advancePhase = () => {
    switch (currentPhase) {
      case "setup":
        setCurrentPhase("observation");
        setTimeRemaining(PHASE_DURATIONS.observation);
        break;
      case "observation":
        setCurrentPhase("identification");
        setTimeRemaining(PHASE_DURATIONS.identification);
        break;
      case "identification":
        setCurrentPhase("evidence");
        setTimeRemaining(PHASE_DURATIONS.evidence);
        break;
      case "evidence":
        setCurrentPhase("ceremony");
        setTimeRemaining(PHASE_DURATIONS.ceremony);
        setCurrentCeremonyIndex(0);
        break;
      case "ceremony":
        if (currentCeremonyIndex < players.length - 1) {
          setCurrentCeremonyIndex((prev) => prev + 1);
          setTimeRemaining(PHASE_DURATIONS.ceremony);
        } else {
          setCurrentPhase("reflection");
          setTimeRemaining(PHASE_DURATIONS.reflection);
        }
        break;
      case "reflection":
        setCurrentPhase("complete");
        setGameResults(superpowers);
        onGameComplete?.(superpowers);
        break;
    }
  };

  const startPhase = () => {
    setIsTimerActive(true);
  };

  const handleSuperpowersUpdate = (newSuperpowers: Superpower[]) => {
    setSuperpowers(newSuperpowers);
  };

  const renderPhaseContent = () => {
    switch (currentPhase) {
      case "setup":
        return (
          <div className="text-center space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-4">
                🦸‍♀️ Invisible Superpowers
              </h2>
              <p className="text-blue-800 dark:text-blue-200 mb-4">
                Discover and celebrate the subtle but powerful strengths that
                make each person unique.
              </p>
              <div className="text-left space-y-2 text-sm text-blue-700 dark:text-blue-300">
                <p>
                  <strong>Phase 1:</strong> Observe others during casual
                  conversation (3 min)
                </p>
                <p>
                  <strong>Phase 2:</strong> Identify invisible superpowers (2
                  min)
                </p>
                <p>
                  <strong>Phase 3:</strong> Gather evidence for each superpower
                  (1.5 min)
                </p>
                <p>
                  <strong>Phase 4:</strong> Superpower bestowal ceremony (3 min
                  per person)
                </p>
                <p>
                  <strong>Phase 5:</strong> Reflection and integration (3 min)
                </p>
              </div>
            </div>
            <Button
              onClick={startPhase}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Begin Discovery
            </Button>
          </div>
        );

      case "observation":
        return (
          <ObservationPrompts players={players} isActive={isTimerActive} />
        );

      case "identification":
        return (
          <SuperpowerGenerator
            players={players}
            onSuperpowersUpdate={handleSuperpowersUpdate}
            isActive={isTimerActive}
          />
        );

      case "evidence":
        return (
          <StrengthStoryteller
            players={players}
            superpowers={superpowers}
            onSuperpowersUpdate={handleSuperpowersUpdate}
            isActive={isTimerActive}
          />
        );

      case "ceremony":
        return (
          <AppreciationCircle
            players={players}
            superpowers={superpowers}
            currentPlayerIndex={currentCeremonyIndex}
            isActive={isTimerActive}
            onNext={advancePhase}
          />
        );

      case "reflection":
        return (
          <div className="space-y-6">
            <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-green-900 dark:text-green-100 mb-4">
                💭 Reflection & Integration
              </h3>
              <div className="space-y-4 text-green-800 dark:text-green-200">
                <p className="font-medium">Discussion prompts:</p>
                <ul className="space-y-2 text-sm">
                  <li>• Which superpower surprised you the most?</li>
                  <li>• How might you consciously use these strengths?</li>
                  <li>
                    • Which superpowers complement each other in the group?
                  </li>
                  <li>
                    • What patterns do you notice across all the superpowers?
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <h4 className="font-bold text-purple-900 dark:text-purple-100 mb-2">
                Discovered Superpowers Summary:
              </h4>
              <div className="grid gap-2 text-sm">
                {players.map((player) => {
                  const playerSuperpowers = superpowers.filter(
                    (sp) => sp.playerId === player.id,
                  );
                  return (
                    <div
                      key={player.id}
                      className="text-purple-800 dark:text-purple-200"
                    >
                      <strong>{player.name}:</strong>{" "}
                      {playerSuperpowers.map((sp) => sp.name).join(", ")}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case "complete":
        return (
          <div className="text-center space-y-6">
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-8 rounded-lg">
              <h2 className="text-3xl font-bold text-purple-900 dark:text-purple-100 mb-4">
                🌟 Superpowers Discovered!
              </h2>
              <p className="text-purple-800 dark:text-purple-200 mb-6">
                Everyone now knows their invisible superpowers. Use them wisely!
              </p>
              <div className="text-left space-y-3">
                {players.map((player) => {
                  const playerSuperpowers = gameResults.filter(
                    (sp) => sp.playerId === player.id,
                  );
                  return (
                    <div
                      key={player.id}
                      className="bg-white dark:bg-gray-800 p-4 rounded-lg"
                    >
                      <h4 className="font-bold text-purple-900 dark:text-purple-100">
                        {player.name}'s Superpowers:
                      </h4>
                      {playerSuperpowers.map((sp) => (
                        <div
                          key={sp.id}
                          className="text-sm text-purple-700 dark:text-purple-300 mt-1"
                        >
                          <strong>{sp.name}</strong> - {sp.evidence}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Invisible Superpowers
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {PHASE_DESCRIPTIONS[currentPhase]}
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center space-x-2">
        {(
          [
            "setup",
            "observation",
            "identification",
            "evidence",
            "ceremony",
            "reflection",
          ] as GamePhase[]
        ).map((phase, index) => (
          <div
            key={phase}
            className={`w-3 h-3 rounded-full ${
              currentPhase === phase
                ? "bg-blue-600"
                : [
                    "setup",
                    "observation",
                    "identification",
                    "evidence",
                    "ceremony",
                    "reflection",
                  ].indexOf(currentPhase) > index
                ? "bg-green-600"
                : "bg-gray-300 dark:bg-gray-600"
            }`}
          />
        ))}
      </div>

      {/* Timer */}
      {currentPhase !== "setup" && currentPhase !== "complete" && (
        <div className="flex justify-center">
          <Timer
            duration={timeRemaining}
            isActive={isTimerActive}
            onTimeUp={handleTimerComplete}
            size="lg"
          />
        </div>
      )}

      {/* Phase Content */}
      <div className="min-h-[400px]">{renderPhaseContent()}</div>

      {/* Manual Controls */}
      {currentPhase !== "setup" && currentPhase !== "complete" && (
        <div className="flex justify-center space-x-4">
          {!isTimerActive && (
            <Button
              onClick={startPhase}
              className="bg-green-600 hover:bg-green-700"
            >
              Start Phase
            </Button>
          )}
          <Button onClick={advancePhase} variant="secondary">
            Skip to Next Phase
          </Button>
        </div>
      )}
    </div>
  );
}
