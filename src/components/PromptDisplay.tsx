"use client";

interface PromptDisplayProps {
  emoji: string;
}

export function PromptDisplay({ emoji }: PromptDisplayProps) {
  return (
    <div className="text-6xl md:text-8xl text-center p-8 select-none">
      {emoji}
    </div>
  );
}
