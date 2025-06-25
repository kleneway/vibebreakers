"use client";

import { TeamScoreCard } from "./TeamScoreCard";

interface Scores {
  red: number;
  blue: number;
  green: number;
}

interface ScoreboardProps {
  scores: Scores;
}

export function Scoreboard({ scores }: ScoreboardProps) {
  const teams = [
    { name: "Red", color: "red", score: scores.red, isLockedOut: false },
    { name: "Blue", color: "blue", score: scores.blue, isLockedOut: false },
    { name: "Green", color: "green", score: scores.green, isLockedOut: false },
  ];

  return (
    <div className="flex justify-center gap-4 p-4">
      {teams.map((team) => (
        <TeamScoreCard key={team.name} team={team} />
      ))}
    </div>
  );
}
