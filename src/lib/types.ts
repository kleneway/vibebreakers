// ==========================================
// SHARED GAME TYPES
// ==========================================

export interface Player {
  id: string;
  name: string;
  isActive: boolean;
  score: number;
  assignedTimeFrames?: TimeFrame[];
  writtenLetters?: Letter[];
  receivedLetters?: Letter[];
  assignedElement?: StoryElement;
  currentQuestion?: string;
  answers?: Array<{
    question: string;
    answer: string;
    depthLevel: number;
    timestamp: number;
  }>;
}

export interface GameState {
  id?: string;
  status: "setup" | "playing" | "finished" | "judging" | "ended";
  phase?:
    | "setup"
    | "timeframe-selection"
    | "letter-writing"
    | "letter-exchange"
    | "reading"
    | "sharing"
    | "complete";
  currentStep?: number;
  totalSteps?: number;
  timeRemaining: number;
  players: Player[];
  currentPlayerIndex: number;
  story: StoryContribution[];
  roundNumber: number;
  maxRounds: number;
  currentPlayer?: number;
}

export interface GameSettings {
  roundDuration: number;
  maxSentenceLength: number;
  minSentenceLength: number;
  maxRounds: number;
}

// ==========================================
// STORY BUILDING SYMPHONY TYPES
// ==========================================

export interface StoryElement {
  id: string;
  type: "character" | "setting" | "plotDevice";
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

// ==========================================
// FUTURE SELF LETTERS TYPES
// ==========================================

export interface TimeFrame {
  id: string;
  label: string;
  value: string;
  description: string;
}

export interface Letter {
  id: string;
  playerId?: string;
  authorId?: string;
  timeFrame: TimeFrame;
  content: string;
  timestamp?: number;
  createdAt?: Date;
  wordCount: number;
  isAnonymous?: boolean;
}

export interface LetterPrompt {
  category: "opening" | "content" | "closing";
  type: string;
  text: string;
}

export interface WisdomInsight {
  id?: string;
  theme: string;
  description?: string;
  frequency: number;
  examples: string[];
  resonance: number;
}

// ==========================================
// QUESTION LADDER TYPES
// ==========================================

export interface QuestionLadderGameState {
  players: QuestionLadderPlayer[];
  currentRound: number;
  activePlayerIndex: number;
  currentDepthLevel: number;
  rounds: QuestionRound[];
  gamePhase: "setup" | "playing" | "finished";
  timeRemaining: number;
  insights: Insight[];
}

export interface QuestionLadderPlayer {
  id: string;
  name: string;
  score: number;
  currentQuestion?: string;
  isActive: boolean;
  answers: Array<{
    question: string;
    answer: string;
    depthLevel: number;
    timestamp: number;
  }>;
}

export interface QuestionRound {
  id: string;
  playerId: string;
  question: string;
  answer: string;
  depthLevel: number;
  timestamp: Date;
  qualityScore: number;
}

export interface QuestionDepthLevel {
  level: number;
  name: string;
  description: string;
  keywords: string[];
  color: string;
}

export interface QuestionQuality {
  depthScore: number;
  buildingScore: number;
  surpriseScore: number;
  totalScore: number;
  feedback: string;
}

export interface ResponseTimerProps {
  totalTime: number;
  timeRemaining: number;
  phase: "answer" | "question";
  onTimeUp: () => void;
}

// ==========================================
// EMPATHY GAME TYPES
// ==========================================

export interface EmpathyScenario {
  id: string;
  title: string;
  description: string;
  category: "ethical" | "social" | "personal" | "resource" | "communication";
  difficulty: number;
}

export interface EmpathyGameState {
  phase:
    | "setup"
    | "scenario"
    | "prediction"
    | "response"
    | "analysis"
    | "discussion"
    | "complete";
  currentScenario: EmpathyScenario | null;
  participants: string[];
  predictions: PlayerPrediction[];
  responses: PlayerResponse[];
  accuracy: PredictionAccuracy[];
  timeRemaining: number;
  roundNumber: number;
  totalRounds: number;
}

export interface PlayerPrediction {
  playerId: string;
  targetPlayerId: string;
  predictedResponse: string;
  confidence: number;
  reasoning?: string;
}

export interface PlayerResponse {
  playerId: string;
  response: string;
  timestamp?: number;
  scenario?: string;
  reasoning?: string;
  emotionalDifficulty?: number;
}

export interface PredictionAccuracy {
  playerId: string;
  targetPlayerId: string;
  prediction: string;
  actualResponse: string;
  accuracyScore: number;
  surprise: boolean;
}

// ==========================================
// MEMORY PALACE TYPES
// ==========================================

export interface MemoryLocation {
  id: string;
  name: string;
  description: string;
  memory: string;
  emotion: string;
  significance: string;
  sensoryDetail: string;
  emotionalIntensity: number;
}

export interface MemoryPalace {
  id: string;
  playerId: string;
  playerName: string;
  placeName: string;
  placeType: "childhood" | "natural" | "community" | "workplace" | "other";
  locations: MemoryLocation[];
  isComplete: boolean;
}

export interface MemoryPalaceGameState {
  phase: "construction" | "pairing" | "exchange" | "exploration" | "reflection";
  timeRemaining: number;
  currentPlayer: number;
  palaces: MemoryPalace[];
  currentPalaceIndex: number;
  currentLocationIndex: number;
  insights: string[];
  connections: Array<{
    playerId1: string;
    playerId2: string;
    connection: string;
  }>;
}

// ==========================================
// INVISIBLE SUPERPOWERS TYPES
// ==========================================

export type GamePhase =
  | "setup"
  | "observation"
  | "identification"
  | "evidence"
  | "ceremony"
  | "reflection"
  | "complete";

export interface Superpower {
  id: string;
  playerId: string;
  playerName: string;
  assignedBy: string;
  assignedByName: string;
  name: string;
  category: string;
  evidence: string;
  impact: string;
}

// ==========================================
// TIME TRAVEL GAME TYPES
// ==========================================

export interface Era {
  id: string;
  name: string;
  year: string;
  description: string;
  theme: string;
  completed: boolean;
}

export interface Choice {
  id: string;
  text: string;
  consequences: string[];
  benefitsNextEra: boolean;
  blocksOptions: string[];
  unlockOptions: string[];
}

export interface Decision {
  eraId: string;
  choice: Choice;
  timestamp: Date;
}

// ==========================================
// INSIGHTS & TRACKING TYPES
// ==========================================

export interface Insight {
  id: string;
  type: "connection" | "revelation" | "empathy" | "breakthrough";
  message: string;
  timestamp: Date;
  participants: string[];
}

export interface DepthLevel {
  level: number;
  name: string;
  description: string;
  color: string;
}

export interface DepthMeterProps {
  currentLevel: number;
  maxLevel: number;
  levels: DepthLevel[];
}
