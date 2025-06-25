"use client";

import { BuzzButton } from "./BuzzButton";

interface BuzzControlPanelProps {
  lockedOutTeams: string[];
  onBuzz: (teamName: string) => void;
}

export function BuzzControlPanel({
  lockedOutTeams,
  onBuzz,
}: BuzzControlPanelProps) {
  const teams = [
    { name: "Red", color: "red", shortcut: 1 },
    { name: "Blue", color: "blue", shortcut: 2 },
    { name: "Green", color: "green", shortcut: 3 },
  ];

  return (
    <div className="flex justify-center gap-4 p-6">
      {teams.map((team) => (
        <BuzzButton
          key={team.name}
          team={team}
          isDisabled={lockedOutTeams.includes(team.name)}
          onBuzz={onBuzz}
        />
      ))}
    </div>
  );
}
