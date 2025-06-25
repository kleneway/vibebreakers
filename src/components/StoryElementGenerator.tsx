"use client";

import { StoryElement } from "@/lib/types";

// Pre-defined story elements from the game plan
const STORY_ELEMENTS = {
  characters: [
    "a mysterious librarian",
    "a talking houseplant", 
    "a retired superhero",
    "a time-traveling chef",
    "a fortune-telling cat",
    "an absent-minded inventor",
    "a singing mailman",
    "a vampire barista",
    "a shape-shifting teacher",
    "a ghost detective"
  ],
  settings: [
    "in a floating coffee shop",
    "inside a giant's pocket", 
    "at the world's last bookstore",
    "on a cloud factory",
    "in a upside-down house",
    "at a midnight grocery store",
    "inside a living tree",
    "on a train between dimensions",
    "in a library of forgotten dreams",
    "at a school for lost memories"
  ],
  plotDevices: [
    "a magic coin that grants terrible wishes",
    "a door that only opens for honest people",  
    "a mirror that shows the future",
    "a pen that writes stories that come true",
    "a clock that runs backwards during lies",
    "a map that changes based on your mood",
    "a phone that calls your past self",
    "a key that unlocks any secret",
    "a compass that points to what you've lost",
    "a book that rewrites itself"
  ]
};

export class StoryElementGenerator {
  private usedElements: Set<string> = new Set();

  generateRandomElement(): StoryElement {
    const types: Array<keyof typeof STORY_ELEMENTS> = ['characters', 'settings', 'plotDevices'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    const elementsOfType = STORY_ELEMENTS[randomType];
    
    // Filter out already used elements
    const availableElements = elementsOfType.filter(element => !this.usedElements.has(element));
    
    // If all elements of this type are used, reset the used set for this type
    if (availableElements.length === 0) {
      // Reset only elements of this type
      elementsOfType.forEach(element => this.usedElements.delete(element));
      availableElements.push(...elementsOfType);
    }
    
    const randomElement = availableElements[Math.floor(Math.random() * availableElements.length)];
    this.usedElements.add(randomElement);
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      type: randomType === 'characters' ? 'character' : 
            randomType === 'settings' ? 'setting' : 'plotDevice',
      text: randomElement
    };
  }

  generateElementsForPlayers(playerCount: number): StoryElement[] {
    const elements: StoryElement[] = [];
    for (let i = 0; i < playerCount; i++) {
      elements.push(this.generateRandomElement());
    }
    return elements;
  }

  reset(): void {
    this.usedElements.clear();
  }
}

// Utility class for generating story elements - no React component needed