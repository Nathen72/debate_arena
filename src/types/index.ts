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

export interface Debate {
  id: string;
  topic: DebateTopic;
  experts: Expert[];
  messages: DebateMessage[];
  currentRound: DebateRound;
  isComplete: boolean;
  votes?: Record<string, number>; // expertId -> vote count
  createdAt: Date;
}

export interface DebateState {
  currentDebate: Debate | null;
  debateHistory: Debate[];
  isGenerating: boolean;
  error: string | null;
}

// AI Provider types
export type AIProvider = 'openai' | 'anthropic' | 'openrouter';

export interface AIConfig {
  provider: AIProvider;
  apiKey: string;
}
