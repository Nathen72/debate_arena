import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ArrowRight, Trophy } from 'lucide-react';
import { generateDebateResponseStream } from '@/lib/ai-service';
import { useDebateStore } from '@/stores/debateStore';
import { DebateMessage } from './DebateMessage';
import { VotingPanel } from './VotingPanel';
import type { Debate, DebateRound, Expert } from '@/types';

interface DebateViewProps {
  debate: Debate;
  onComplete: () => void;
}

const ROUNDS: { key: DebateRound; label: string; description: string }[] = [
  { key: 'opening', label: 'Opening Statements', description: 'Experts introduce their positions' },
  { key: 'arguments', label: 'Main Arguments', description: 'Core reasoning and evidence' },
  { key: 'rebuttals', label: 'Rebuttals', description: 'Addressing opposing views' },
  { key: 'closing', label: 'Closing Statements', description: 'Final thoughts and conclusions' },
];

export function DebateView({ debate, onComplete }: DebateViewProps) {
  const { addMessage, updateMessageContent, setCurrentRound, completeDebate, currentDebate } = useDebateStore();
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [currentExpertIndex, setCurrentExpertIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showVoting, setShowVoting] = useState(false);
  const generatingRef = useRef<Set<string>>(new Set()); // Track expertId-round combinations being generated

  const currentRound = ROUNDS[currentRoundIndex];
  const isLastRound = currentRoundIndex === ROUNDS.length - 1;
  const isLastExpert = currentExpertIndex === debate.experts.length - 1;

  const generateNextResponse = async () => {
    if (isGenerating || !currentRound) return;

    const expert = debate.experts[currentExpertIndex];
    if (!expert) return;

    // Create unique key for this expert-round combination
    const generationKey = `${expert.id}-${currentRound.key}`;

    // Check if we're already generating for this expert-round combination
    if (generatingRef.current.has(generationKey)) {
      console.log(`Already generating for ${expert.name} in ${currentRound.key}, skipping`);
      return;
    }

    // Check if this expert already has a message in the current round
    // Use the store's current debate state to get the most up-to-date messages
    const currentDebateState = currentDebate || debate;
    const existingMessage = currentDebateState.messages.find(
      (m) => m.expertId === expert.id && m.round === currentRound.key
    );
    if (existingMessage) {
      // Expert already spoke in this round, move to next expert
      if (isLastExpert) {
        if (isLastRound) {
          completeDebate();
          setTimeout(() => setShowVoting(true), 1000);
        } else {
          setTimeout(() => {
            const nextIndex = currentRoundIndex + 1;
            setCurrentRoundIndex(nextIndex);
            setCurrentExpertIndex(0);
            const nextRound = ROUNDS[nextIndex];
            if (nextRound) {
              setCurrentRound(nextRound.key);
            }
          }, 1500);
        }
      } else {
        setTimeout(() => {
          setCurrentExpertIndex(currentExpertIndex + 1);
        }, 1000);
      }
      return;
    }

    // Mark as generating
    generatingRef.current.add(generationKey);
    setIsGenerating(true);

    try {
      // Get previous messages for context (use current debate state)
      const previousMessages = currentDebateState.messages
        .filter((m) => m.round === currentRound.key)
        .map((m) => {
          const exp = debate.experts.find((e) => e.id === m.expertId);
          return `${exp?.name}: ${m.content}`;
        });

      // Get other experts for context
      const otherExperts = debate.experts.filter((e) => e.id !== expert.id);

      // Create initial empty message for streaming (before we start)
      const finalDebateState = currentDebate || debate;
      const stillExists = finalDebateState.messages.find(
        (m) => m.expertId === expert.id && m.round === currentRound.key
      );
      
      if (!stillExists) {
        // Create message with empty content initially for streaming
        addMessage({
          expertId: expert.id,
          round: currentRound.key,
          content: '',
          timestamp: new Date(),
        });
      }

      // Accumulate content as chunks arrive
      let accumulatedContent = '';

      const response = await generateDebateResponseStream(
        expert,
        debate.topic,
        currentRound.key,
        (chunk: string) => {
          // Accumulate content and update message in real-time
          accumulatedContent += chunk;
          updateMessageContent(expert.id, currentRound.key, accumulatedContent);
        },
        previousMessages,
        otherExperts
      );

      // Final update with cleaned text (handles any post-processing)
      if (response !== accumulatedContent) {
        updateMessageContent(expert.id, currentRound.key, response);
      }

      // Move to next expert or round
      if (isLastExpert) {
        if (isLastRound) {
          // Debate complete
          completeDebate();
          setTimeout(() => setShowVoting(true), 1000);
        } else {
          // Next round
          setTimeout(() => {
            const nextIndex = currentRoundIndex + 1;
            setCurrentRoundIndex(nextIndex);
            setCurrentExpertIndex(0);
            const nextRound = ROUNDS[nextIndex];
            if (nextRound) {
              setCurrentRound(nextRound.key);
            }
          }, 1500);
        }
      } else {
        // Next expert in same round
        setTimeout(() => {
          setCurrentExpertIndex(currentExpertIndex + 1);
        }, 1000);
      }
    } catch (error) {
      console.error('Error generating response:', error);
    } finally {
      // Remove from generating set
      generatingRef.current.delete(generationKey);
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    // Auto-generate first response when component mounts
    // Only if there are no messages and we're not already generating
    if (debate.messages.length === 0 && !isGenerating && currentRound) {
      const expert = debate.experts[currentExpertIndex];
      if (expert) {
        const generationKey = `${expert.id}-${currentRound.key}`;
        // Check both the ref and existing messages
        const hasMessage = debate.messages.some(
          (m) => m.expertId === expert.id && m.round === currentRound.key
        );
        const isGenerating = generatingRef.current.has(generationKey);
        
        if (!hasMessage && !isGenerating) {
          setTimeout(() => generateNextResponse(), 500);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleContinue = () => {
    generateNextResponse();
  };

  // Get messages for current round
  const currentRoundMessages = currentRound
    ? debate.messages.filter((m) => m.round === currentRound.key)
    : [];

  if (showVoting) {
    return <VotingPanel debate={debate} onComplete={onComplete} />;
  }

  if (!currentRound) {
    return null;
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-vintage-ink mb-2">
            {debate.topic.title}
          </h2>
          <p className="text-vintage-brown">{debate.topic.description}</p>
        </motion.div>

        {/* Round Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {ROUNDS.map((round, index) => (
              <div
                key={round.key}
                className={`flex-1 ${index < ROUNDS.length - 1 ? 'mr-2' : ''}`}
              >
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    index < currentRoundIndex
                      ? 'bg-primary-500'
                      : index === currentRoundIndex
                      ? 'bg-primary-400'
                      : 'bg-vintage-tan'
                  }`}
                />
                <p
                  className={`text-xs mt-2 font-medium text-center ${
                    index <= currentRoundIndex
                      ? 'text-vintage-ink'
                      : 'text-vintage-brown'
                  }`}
                >
                  {round.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Current Round Info */}
        <motion.div
          key={currentRound.key}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card-vintage p-6 mb-8 text-center"
        >
          <h3 className="text-2xl font-display font-bold text-vintage-ink mb-2">
            {currentRound.label}
          </h3>
          <p className="text-vintage-brown">{currentRound.description}</p>
        </motion.div>

        {/* Messages */}
        <div className="space-y-6 mb-8">
          <AnimatePresence>
            {currentRoundMessages.map((message, index) => {
              const expert = debate.experts.find((e) => e.id === message.expertId);
              if (!expert) return null;
              return (
                <DebateMessage
                  key={`${message.expertId}-${message.round}-${message.timestamp.getTime()}-${index}`}
                  expert={expert}
                  content={message.content}
                  index={index}
                />
              );
            })}
          </AnimatePresence>
        </div>

        {/* Continue Button or Loading */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          {isGenerating ? (
            <div className="inline-flex items-center gap-3 px-6 py-4 bg-vintage-paper rounded-xl border-2 border-vintage-tan">
              <Loader2 className="w-5 h-5 animate-spin text-primary-500" />
              <span className="font-medium text-vintage-ink">
                {debate.experts[currentExpertIndex]?.name || 'An expert'} is speaking...
              </span>
            </div>
          ) : (
            <button
              onClick={handleContinue}
              className="btn-primary text-lg group"
            >
              {isLastExpert && isLastRound ? (
                <>
                  <Trophy className="w-5 h-5 inline mr-2" />
                  See Results
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-5 h-5 inline ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          )}
        </motion.div>
      </div>
    </div>
  );
}
