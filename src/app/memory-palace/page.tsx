"use client";

import React from "react";
import { MemoryPalaceExchange } from "@/components/MemoryPalaceExchange";
import { Player } from "@/lib/types";

const SAMPLE_PLAYERS: Player[] = [
  { id: "player1", name: "Alice", isActive: true, score: 0 },
  { id: "player2", name: "Bob", isActive: true, score: 0 },
  { id: "player3", name: "Charlie", isActive: true, score: 0 },
  { id: "player4", name: "Diana", isActive: true, score: 0 },
];

export default function MemoryPalacePage() {
  const handleGameComplete = (insights: string[]) => {
    console.log("Game completed with insights:", insights);
    // Here you could save the insights or navigate to a results page
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-neutral-50 dark:from-neutral-900 dark:to-neutral-950">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-neutral-800 dark:text-neutral-200 mb-4">
            Memory Palace Exchange
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
            Welcome to Game 10 from the Vibebreakers collection! Create detailed
            mental maps of meaningful places, then guide others through these
            spaces while sharing the stories and emotions connected to each
            location.
          </p>
        </div>

        <MemoryPalaceExchange
          players={SAMPLE_PLAYERS}
          onGameComplete={handleGameComplete}
        />
      </div>
    </div>
  );
}
