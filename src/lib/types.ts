// Empathy Enigma Game Types
export interface EmpathyScenario {
  id: string;
  title: string;
  description: string;
  category: 'ethical' | 'personal' | 'social' | 'resource' | 'communication';
  difficulty: 1 | 2 | 3;
}

export interface PlayerPrediction {
  playerId: string;
  targetPlayerId: string;
  predictedResponse: string;
  confidence: number; // 1-10
  reasoning?: string;
}

export interface PlayerResponse {
  playerId: string;
  response: string;
  reasoning?: string;
  emotionalDifficulty: number; // 1-10
}

export interface PredictionAccuracy {
  playerId: string;
  targetPlayerId: string;
  prediction: string;
  actualResponse: string;
  accuracyScore: number; // 0-100
  surprise: boolean;
}

export interface EmpathyGameState {
  phase: 'setup' | 'scenario' | 'prediction' | 'response' | 'analysis' | 'discussion' | 'complete';
  currentScenario: EmpathyScenario | null;
  participants: string[];
  predictions: PlayerPrediction[];
  responses: PlayerResponse[];
  accuracy: PredictionAccuracy[];
  timeRemaining: number;
  roundNumber: number;
  totalRounds: number;
}

export interface DiscussionPrompt {
  id: string;
  question: string;
  type: 'values' | 'surprise' | 'pattern' | 'insight';
  basedOn: 'accuracy' | 'responses' | 'predictions' | 'emotions';
}