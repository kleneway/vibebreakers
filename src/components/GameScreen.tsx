"use client";

import { Header } from "./Header";
import { PromptDisplay } from "./PromptDisplay";
import { Scoreboard } from "./Scoreboard";
import { Timer } from "./Timer";
import { BuzzControlPanel } from "./BuzzControlPanel";

interface GameScreenProps {
  sessionName: string;
  round: number;
  totalRounds: number;
  scores: {
    red: number;
    blue: number;
    green: number;
  };
  secondsLeft: number;
  currentPrompt: string;
  lockedOutTeams: string[];
  onBuzz: (teamName: string) => void;
}

export function GameScreen({
  sessionName,
  round,
  totalRounds,
  scores,
  secondsLeft,
  currentPrompt,
  lockedOutTeams,
  onBuzz,
}: GameScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <Header
        sessionName={sessionName}
        round={round}
        totalRounds={totalRounds}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <Scoreboard scores={scores} />

          <div className="text-center">
            <div className="text-3xl font-mono font-bold text-blue-600 dark:text-blue-400">
              🕒 {secondsLeft}
            </div>
          </div>

          <PromptDisplay emoji={currentPrompt} />

          <BuzzControlPanel lockedOutTeams={lockedOutTeams} onBuzz={onBuzz} />
        </div>
      </div>
    </div>
  );
}
