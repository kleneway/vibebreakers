"use client";

interface Team {
  name: string;
  color: string;
  score: number;
  isLockedOut: boolean;
}

interface TeamScoreCardProps {
  team: Team;
}

export function TeamScoreCard({ team }: TeamScoreCardProps) {
  const colorClasses = {
    red: "bg-red-500 border-red-600",
    blue: "bg-blue-500 border-blue-600",
    green: "bg-green-500 border-green-600",
  };

  const bgColor =
    colorClasses[team.color as keyof typeof colorClasses] ||
    "bg-gray-500 border-gray-600";

  return (
    <div
      className={`
        ${bgColor} 
        text-white 
        rounded-lg 
        p-4 
        text-center 
        border-2
        ${team.isLockedOut ? "opacity-50" : ""}
      `}
    >
      <h3 className="text-lg font-bold mb-2">{team.name}</h3>
      <div className="text-2xl font-bold">{team.score}</div>
      {team.isLockedOut && (
        <div className="text-sm mt-1 opacity-75">🔒 Locked Out</div>
      )}
    </div>
  );
}
