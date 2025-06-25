"use client";

interface VerdictModalProps {
  teamName: string;
  onVerdict: (isCorrect: boolean) => void;
}

export function VerdictModal({ teamName, onVerdict }: VerdictModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Judge Answer
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Was Team{" "}
            <span className="font-bold text-purple-600">{teamName}</span>'s
            answer correct?
          </p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => onVerdict(true)}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-lg text-lg transition-all hover:scale-105 active:scale-95"
          >
            ✅ Yes
          </button>
          <button
            onClick={() => onVerdict(false)}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-6 rounded-lg text-lg transition-all hover:scale-105 active:scale-95"
          >
            ❌ No
          </button>
        </div>
      </div>
    </div>
  );
}
