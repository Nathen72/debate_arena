// Core debate types
export interface Expert {
  id: string;
  name: string;
  expertise: string;
  position: 'pro' | 'con' | 'neutral';
  avatar: string; // emoji or image url
  personality: string;
  background: string;
  isReal: boolean; // true if based on real person, false if fictional
  notableWorks?: string; // notable works, books, quotes (for real people)
}

export interface DebateTopic {
  id: string;
  title: string;
  description: string;
  category: string;
}

export type DebateRound = 'opening' | 'arguments' | 'rebuttals' | 'closing';

export interface DebateMessage {
  expertId: string;
  round: DebateRound;
  content: string;
  timestamp: Date;
}

export interface DebateSummary {
  summary: string; // Concise summary of main arguments from each expert
  verdict: string; // Neutral moderator verdict highlighting most compelling reasoning
  keyTakeaways: string[]; // Key points from the debate
}

export interface Debate {
  id: string;
  topic: DebateTopic;
  experts: Expert[];
  messages: DebateMessage[];
  currentRound: DebateRound;
  isComplete: boolean;
  votes?: Record<string, number>; // expertId -> vote count
  summary?: DebateSummary; // AI-generated summary and verdict
  createdAt: Date;
  selectedModel?: string; // OpenRouter model ID (if using OpenRouter)
}

export interface DebateState {
  currentDebate: Debate | null;
  debateHistory: Debate[];
  isGenerating: boolean;
  error: string | null;
}

// AI Provider types
export type AIProvider = 'openai' | 'anthropic' | 'openrouter';

export interface OpenRouterModel {
  id: string;
  name: string;
  description: string;
  pricing?: {
    prompt: string;
    completion: string;
  };
}

export interface AIConfig {
  provider: AIProvider;
  apiKey: string;
  model?: string; // For OpenRouter model selection
}
