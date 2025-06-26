"use client";

interface BuzzTeam {
  name: string;
  color: string;
  shortcut: number;
}

interface BuzzButtonProps {
  team: BuzzTeam;
  isDisabled: boolean;
  onBuzz: (teamName: string) => void;
}

export function BuzzButton({ team, isDisabled, onBuzz }: BuzzButtonProps) {
  const colorClasses = {
    red: "bg-red-500 hover:bg-red-600 border-red-600",
    blue: "bg-blue-500 hover:bg-blue-600 border-blue-600",
    green: "bg-green-500 hover:bg-green-600 border-green-600",
  };

  const bgColor =
    colorClasses[team.color as keyof typeof colorClasses] ||
    "bg-gray-500 hover:bg-gray-600 border-gray-600";

  const handleClick = () => {
    if (!isDisabled) {
      onBuzz(team.name);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      className={`
        ${bgColor}
        text-white
        font-bold
        py-4
        px-8
        rounded-lg
        border-2
        text-xl
        transition-all
        ${
          isDisabled
            ? "opacity-50 cursor-not-allowed"
            : "hover:scale-105 active:scale-95"
        }
      `}
    >
      {team.name}
      <div className="text-sm mt-1">Press {team.shortcut}</div>
    </button>
  );
}
