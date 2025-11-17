import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Debate, DebateState, Expert, DebateMessage, DebateRound, DebateSummary } from '@/types';

interface DebateStore extends DebateState {
  // Actions
  setCurrentDebate: (debate: Debate | null) => void;
  addMessage: (message: DebateMessage) => void;
  updateMessageContent: (expertId: string, round: DebateRound, content: string) => void;
  setCurrentRound: (round: DebateRound) => void;
  completeDebate: () => void;
  addVote: (expertId: string) => void;
  setDebateSummary: (summary: DebateSummary) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setError: (error: string | null) => void;
  saveDebateToHistory: () => void;
  clearCurrentDebate: () => void;
}

export const useDebateStore = create<DebateStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentDebate: null,
      debateHistory: [],
      isGenerating: false,
      error: null,

      // Actions
      setCurrentDebate: (debate) => set({ currentDebate: debate, error: null }),

      addMessage: (message) =>
        set((state) => {
          if (!state.currentDebate) return state;
          
          // Prevent duplicate messages: check if this expert already has a message in this round
          const duplicate = state.currentDebate.messages.find(
            (m) => m.expertId === message.expertId && m.round === message.round
          );
          
          if (duplicate) {
            console.warn(`Duplicate message prevented: ${message.expertId} in ${message.round}`);
            return state; // Don't add duplicate
          }
          
          return {
            currentDebate: {
              ...state.currentDebate,
              messages: [...state.currentDebate.messages, message],
            },
          };
        }),

      updateMessageContent: (expertId, round, content) =>
        set((state) => {
          if (!state.currentDebate) return state;
          
          return {
            currentDebate: {
              ...state.currentDebate,
              messages: state.currentDebate.messages.map((m) =>
                m.expertId === expertId && m.round === round
                  ? { ...m, content }
                  : m
              ),
            },
          };
        }),

      setCurrentRound: (round) =>
        set((state) => {
          if (!state.currentDebate) return state;
          return {
            currentDebate: {
              ...state.currentDebate,
              currentRound: round,
            },
          };
        }),

      completeDebate: () =>
        set((state) => {
          if (!state.currentDebate) return state;
          return {
            currentDebate: {
              ...state.currentDebate,
              isComplete: true,
            },
          };
        }),

      addVote: (expertId) =>
        set((state) => {
          if (!state.currentDebate) return state;
          const votes = state.currentDebate.votes || {};
          return {
            currentDebate: {
              ...state.currentDebate,
              votes: {
                ...votes,
                [expertId]: (votes[expertId] || 0) + 1,
              },
            },
          };
        }),

      setDebateSummary: (summary) =>
        set((state) => {
          if (!state.currentDebate) return state;
          return {
            currentDebate: {
              ...state.currentDebate,
              summary,
            },
          };
        }),

      setIsGenerating: (isGenerating) => set({ isGenerating }),

      setError: (error) => set({ error }),

      saveDebateToHistory: () =>
        set((state) => {
          if (!state.currentDebate) return state;
          return {
            debateHistory: [state.currentDebate, ...state.debateHistory].slice(0, 10), // Keep last 10
          };
        }),

      clearCurrentDebate: () => set({ currentDebate: null, error: null }),
    }),
    {
      name: 'debate-storage',
      partialize: (state) => ({
        debateHistory: state.debateHistory,
      }),
    }
  )
);
