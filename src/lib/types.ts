// Game 4: Authenticity Challenge Types
export interface Player {
  id: string;
  name: string;
  isLiar?: boolean;
  story?: string;
  hasShared?: boolean;
}

export interface StoryPrompt {
  id: string;
  text: string;
  category: 'low' | 'medium' | 'high';
  examples?: string[];
}

export interface Vote {
  voterId: string;
  suspectedLiarId: string;
  confidence: number; // 1-10
  reasoning?: string;
}

export interface GameRound {
  roundNumber: number;
  vulnerability: 'low' | 'medium' | 'high';
  prompt: StoryPrompt;
  players: Player[];
  votes: Vote[];
  revealed: boolean;
}

export interface AuthenticityGameState {
  players: Player[];
  currentRound: number;
  rounds: GameRound[];
  phase: 'setup' | 'assignment' | 'sharing' | 'voting' | 'discussion' | 'finished';
  currentSpeaker?: string;
  timeRemaining?: number;
}