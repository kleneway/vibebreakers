"use client";

interface HeaderProps {
  sessionName: string;
  round: number;
  totalRounds: number;
}

export function Header({ sessionName, round, totalRounds }: HeaderProps) {
  const getRoundDisplay = () => {
    if (round > totalRounds) {
      return "Sudden Death";
    }
    return `Round ${round} / ${totalRounds}`;
  };

  return (
    <header className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 text-center">
      <h1 className="text-2xl md:text-4xl font-bold mb-2">{sessionName}</h1>
      <p className="text-lg md:text-xl">{getRoundDisplay()}</p>
    </header>
  );
}
