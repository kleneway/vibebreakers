"use client";

import { useState } from "react";

export function HowToPlayAccordion() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <details className="w-full max-w-2xl mx-auto">
      <summary
        className="cursor-pointer p-4 bg-gray-100 dark:bg-gray-800 rounded-lg font-semibold text-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
      >
        How to Play {isOpen ? "▼" : "▶"}
      </summary>
      {isOpen && (
        <div className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-b-lg">
          <div className="space-y-4">
            <section>
              <h3 className="font-bold text-lg mb-2">🎯 Objective</h3>
              <p>
                Teams compete to guess what the emoji prompts represent. First
                team to buzz in gets to answer!
              </p>
            </section>

            <section>
              <h3 className="font-bold text-lg mb-2">📊 Scoring</h3>
              <ul className="list-disc ml-6 space-y-1">
                <li>Correct answer: +1 point</li>
                <li>Wrong answer: -1 point</li>
                <li>
                  Teams are locked out for wrong answers until the next round
                </li>
              </ul>
            </section>

            <section>
              <h3 className="font-bold text-lg mb-2">⌨️ Keyboard Shortcuts</h3>
              <ul className="list-disc ml-6 space-y-1">
                <li>
                  Red Team: Press{" "}
                  <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">
                    1
                  </kbd>
                </li>
                <li>
                  Blue Team: Press{" "}
                  <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">
                    2
                  </kbd>
                </li>
                <li>
                  Green Team: Press{" "}
                  <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">
                    3
                  </kbd>
                </li>
              </ul>
            </section>

            <section>
              <h3 className="font-bold text-lg mb-2">🏆 Winning</h3>
              <p>
                The team with the highest score after all rounds wins! Ties go
                to sudden death rounds.
              </p>
            </section>
          </div>
        </div>
      )}
    </details>
  );
}
