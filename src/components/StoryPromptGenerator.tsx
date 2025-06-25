"use client";

import React, { useEffect, useMemo } from 'react';
import { StoryPrompt } from '@/lib/types';
import { Shuffle, Lightbulb } from 'lucide-react';

interface StoryPromptGeneratorProps {
  vulnerability: 'low' | 'medium' | 'high';
  onPromptGenerated: (prompt: StoryPrompt) => void;
}

export const StoryPromptGenerator: React.FC<StoryPromptGeneratorProps> = ({
  vulnerability,
  onPromptGenerated
}) => {
  const prompts = useMemo(() => ({
    low: [
      {
        id: 'low-1',
        text: "A time you were embarrassingly wrong about something",
        category: 'low' as const,
        examples: ["Confidently giving wrong directions", "Mispronouncing a word for years", "Believing a myth that turned out false"]
      },
      {
        id: 'low-2', 
        text: "Your weirdest childhood fear",
        category: 'low' as const,
        examples: ["Being afraid of escalators", "Thinking monsters lived in the drain", "Fear of automatic toilets"]
      },
      {
        id: 'low-3',
        text: "A skill you pretend to have but don't",
        category: 'low' as const,
        examples: ["Cooking elaborate meals", "Understanding wine", "Being good with technology"]
      },
      {
        id: 'low-4',
        text: "The most ridiculous thing you believed as a child",
        category: 'low' as const,
        examples: ["Teachers lived at school", "Cartoons were real", "Adults always knew what they were doing"]
      }
    ],
    medium: [
      {
        id: 'med-1',
        text: "A moment you realized you'd grown up",
        category: 'medium' as const,
        examples: ["Making your first major decision alone", "Comforting a parent", "Realizing you were responsible for someone else"]
      },
      {
        id: 'med-2',
        text: "Something you believed about friendship that turned out to be wrong",
        category: 'medium' as const,
        examples: ["Thinking friends never disagree", "Believing friendship meant never being alone", "Assuming good friends read your mind"]
      },
      {
        id: 'med-3',
        text: "A time you disappointed someone you cared about",
        category: 'medium' as const,
        examples: ["Missing an important event", "Breaking a promise", "Not being there when needed"]
      },
      {
        id: 'med-4',
        text: "A moment when you had to choose between what was easy and what was right",
        category: 'medium' as const,
        examples: ["Standing up to a bully", "Admitting a mistake", "Defending someone unpopular"]
      }
    ],
    high: [
      {
        id: 'high-1',
        text: "A fear you've never told anyone",
        category: 'high' as const,
        examples: ["Fear of not being lovable", "Fear of wasting your life", "Fear of being truly seen"]
      },
      {
        id: 'high-2',
        text: "Something you're still learning to forgive yourself for",
        category: 'high' as const,
        examples: ["A mistake that hurt someone", "Time you wasted", "Words you can't take back"]
      },
      {
        id: 'high-3',
        text: "A way you're different from who you used to be",
        category: 'high' as const,
        examples: ["How loss changed you", "What hardship taught you", "How love transformed you"]
      },
      {
        id: 'high-4',
        text: "Something you wish you could tell your younger self",
        category: 'high' as const,
        examples: ["About self-worth", "About taking risks", "About the nature of happiness"]
      }
    ]
  }), []);

  const selectedPrompt = useMemo(() => {
    const categoryPrompts = prompts[vulnerability];
    return categoryPrompts[Math.floor(Math.random() * categoryPrompts.length)];
  }, [vulnerability, prompts]);

  useEffect(() => {
    onPromptGenerated(selectedPrompt);
  }, [selectedPrompt, onPromptGenerated]);

  const getVulnerabilityColor = (level: string) => {
    switch (level) {
      case 'low': return 'from-green-500 to-emerald-500';
      case 'medium': return 'from-yellow-500 to-orange-500';
      case 'high': return 'from-red-500 to-pink-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const getVulnerabilityDescription = (level: string) => {
    switch (level) {
      case 'low': return 'Light & Playful - Surface-level sharing that breaks the ice';
      case 'medium': return 'Personal & Meaningful - Stories that reveal your values and growth';
      case 'high': return 'Deep & Vulnerable - Intimate sharing that builds profound connection';
      default: return '';
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-yellow-500" />
        <h3 className="text-xl font-semibold">Story Prompt</h3>
      </div>
      
      <div className={`bg-gradient-to-r ${getVulnerabilityColor(vulnerability)} text-white rounded-lg p-4 mb-4`}>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-medium uppercase tracking-wide opacity-90">
            {vulnerability} vulnerability
          </span>
        </div>
        <p className="text-sm opacity-80 mb-3">
          {getVulnerabilityDescription(vulnerability)}
        </p>
        <h4 className="text-lg font-semibold">
          "{selectedPrompt.text}"
        </h4>
      </div>

      {selectedPrompt.examples && selectedPrompt.examples.length > 0 && (
        <div className="bg-gray-50 dark:bg-neutral-700 rounded-lg p-4">
          <h5 className="font-medium text-sm text-gray-600 dark:text-gray-300 mb-2 flex items-center gap-1">
            <Shuffle className="w-4 h-4" />
            Example approaches (optional inspiration):
          </h5>
          <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
            {selectedPrompt.examples.map((example, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-gray-400 mt-1">•</span>
                <span>{example}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          <strong>Remember:</strong> You have 90 seconds to share your story. Focus on the emotion and meaning 
          rather than every detail. Be authentic - whether you're telling the truth or crafting a believable fiction!
        </p>
      </div>
    </div>
  );
};