// Story Building Symphony Game Types
export interface StoryElement {
  id: string;
  type: 'character' | 'setting' | 'plotDevice';
  text: string;
}

export interface StoryContribution {
  id: string;
  playerId: string;
  playerName: string;
  sentence: string;
  storyElement: StoryElement;
  timestamp: number;
  order: number;
}

export interface Player {
  id: string;
  name: string;
  isActive: boolean;
  score: number;
  assignedElement?: StoryElement;
}

export interface GameState {
  id: string;
  status: 'setup' | 'playing' | 'finished';
  players: Player[];
  currentPlayerIndex: number;
  story: StoryContribution[];
  roundNumber: number;
  timeRemaining: number;
  maxRounds: number;
}

export interface GameSettings {
  roundDuration: number; // in seconds
  maxSentenceLength: number;
  minSentenceLength: number;
  maxRounds: number;
}