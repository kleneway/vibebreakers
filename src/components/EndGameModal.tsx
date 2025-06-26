"use client";

interface EndGameModalProps {
  winner?: string;
  isTie: boolean;
  onPlayAgain: () => void;
}

export function EndGameModal({
  winner,
  isTie,
  onPlayAgain,
}: EndGameModalProps) {
  const confetti = "🎉🎊✨🎈🎆🎇🌟⭐";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        {isTie ? (
          <>
            <div className="text-6xl mb-4">🤝</div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              It's a Tie!
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Time for a Sudden Death round!
            </p>
            <button
              onClick={onPlayAgain}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all hover:scale-105 active:scale-95"
            >
              Start Sudden Death
            </button>
          </>
        ) : (
          <>
            <div className="text-4xl mb-4">
              {confetti.split("").map((emoji, i) => (
                <span
                  key={i}
                  className="inline-block animate-bounce"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {emoji}
                </span>
              ))}
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Team {winner} Wins!
            </h2>
            <div className="text-8xl mb-6">🏆</div>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Congratulations on an amazing game!
            </p>
            <button
              onClick={onPlayAgain}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all hover:scale-105 active:scale-95"
            >
              Play Again
            </button>
          </>
        )}
      </div>
    </div>
  );
}
