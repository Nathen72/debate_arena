import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, ThumbsUp, Home, History } from 'lucide-react';
import { useDebateStore } from '@/stores/debateStore';
import type { Debate, Expert } from '@/types';

interface VotingPanelProps {
  debate: Debate;
  onComplete: () => void;
}

export function VotingPanel({ debate, onComplete }: VotingPanelProps) {
  const { addVote, saveDebateToHistory } = useDebateStore();
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState<string | null>(null);

  const handleVote = (expertId: string) => {
    if (hasVoted) return;

    addVote(expertId);
    setSelectedExpert(expertId);
    setHasVoted(true);
    saveDebateToHistory();
  };

  const handleFinish = () => {
    if (!hasVoted) {
      saveDebateToHistory();
    }
    onComplete();
  };

  // Calculate vote percentages
  const totalVotes = Object.values(debate.votes || {}).reduce((a, b) => a + b, 0) || 1;
  const expertVotes = debate.experts.map((expert) => ({
    expert,
    votes: debate.votes?.[expert.id] || 0,
    percentage: ((debate.votes?.[expert.id] || 0) / totalVotes) * 100,
  }));

  // Sort by votes
  expertVotes.sort((a, b) => b.votes - a.votes);
  const winner = expertVotes[0]!; // Safe: array always has at least one expert

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-block mb-4"
          >
            <Trophy className="w-16 h-16 text-primary-500" />
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-vintage-ink mb-4">
            The Debate Has Concluded
          </h2>
          <p className="text-xl text-vintage-brown">
            {hasVoted
              ? "Thank you for your vote!"
              : "Who made the most convincing argument?"}
          </p>
        </motion.div>

        {/* Voting/Results */}
        <div className="space-y-4 mb-12">
          {expertVotes.map((item, index) => {
            const isSelected = selectedExpert === item.expert.id;
            const isWinner = item.expert.id === winner.expert.id && hasVoted;

            return (
              <motion.button
                key={item.expert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={!hasVoted ? { scale: 1.02, x: 8 } : {}}
                whileTap={!hasVoted ? { scale: 0.98 } : {}}
                onClick={() => handleVote(item.expert.id)}
                disabled={hasVoted}
                className={`w-full text-left card-vintage p-6 transition-all ${
                  hasVoted
                    ? isSelected
                      ? 'border-primary-500 bg-primary-50'
                      : ''
                    : 'hover:border-primary-400 cursor-pointer'
                } ${isWinner ? 'ring-4 ring-primary-300' : ''}`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-4xl">{item.expert.avatar}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-display font-bold text-vintage-ink">
                        {item.expert.name}
                      </h3>
                      {isWinner && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="px-3 py-1 bg-primary-500 text-white text-sm font-bold rounded-full"
                        >
                          Most Convincing
                        </motion.span>
                      )}
                    </div>
                    <p className="text-sm text-vintage-brown">
                      {item.expert.expertise}
                    </p>
                  </div>
                  {!hasVoted && (
                    <ThumbsUp className="w-6 h-6 text-vintage-brown" />
                  )}
                </div>

                {hasVoted && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-vintage-brown font-medium">
                        Votes: {item.votes}
                      </span>
                      <span className="text-vintage-ink font-bold">
                        {item.percentage.toFixed(0)}%
                      </span>
                    </div>
                    <div className="h-3 bg-vintage-tan rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percentage}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-primary-500"
                      />
                    </div>
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex gap-4 justify-center"
        >
          <button onClick={handleFinish} className="btn-secondary">
            <Home className="w-5 h-5 inline mr-2" />
            New Debate
          </button>
        </motion.div>

        {/* Debate Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 text-center"
        >
          <div className="inline-block px-6 py-3 bg-vintage-paper rounded-xl border-2 border-vintage-tan">
            <p className="text-vintage-brown text-sm">
              <History className="w-4 h-4 inline mr-2" />
              This debate has been saved to your history
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
