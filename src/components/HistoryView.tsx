import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, ArrowLeft, Calendar, Trophy, Sparkles, ChevronRight } from 'lucide-react';
import { useDebateStore } from '@/stores/debateStore';
import { AppShell } from './AppShell';
import type { Debate, DebateRound } from '@/types';

interface HistoryViewProps {
  onBack: () => void;
  onViewDebate?: (debate: Debate) => void;
}

const ROUND_LABELS: Record<DebateRound, string> = {
  opening: 'Opening Statements',
  arguments: 'Main Arguments',
  rebuttals: 'Rebuttals',
  closing: 'Closing Statements',
};

export function HistoryView({ onBack, onViewDebate }: HistoryViewProps) {
  const { debateHistory } = useDebateStore();
  const [selectedDebate, setSelectedDebate] = useState<Debate | null>(null);

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getWinner = (debate: Debate) => {
    if (!debate.votes || Object.keys(debate.votes).length === 0) return null;
    const expertVotes = debate.experts.map((expert) => ({
      expert,
      votes: debate.votes?.[expert.id] || 0,
    }));
    expertVotes.sort((a, b) => b.votes - a.votes);
    return expertVotes[0]?.expert || null;
  };

  if (selectedDebate) {
    const winner = getWinner(selectedDebate);
    const messagesByRound = selectedDebate.messages.reduce(
      (acc, msg) => {
        if (!acc[msg.round]) acc[msg.round] = [];
        acc[msg.round].push(msg);
        return acc;
      },
      {} as Record<DebateRound, typeof selectedDebate.messages>
    );

    return (
      <AppShell currentStep="voting" showProgress={false}>
        <div className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={() => setSelectedDebate(null)}
                className="btn-secondary"
              >
                <ArrowLeft className="w-5 h-5 inline mr-2" />
                Back to History
              </button>
            </div>

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold text-vintage-ink mb-2">
                {selectedDebate.topic.title}
              </h2>
              <p className="text-vintage-brown mb-4">{selectedDebate.topic.description}</p>
              <div className="flex items-center gap-4 text-sm text-vintage-brown">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {formatDate(selectedDebate.createdAt)}
                </div>
                {winner && (
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-primary-500" />
                    Winner: {winner.name}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Summary & Verdict */}
            {selectedDebate.summary && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-vintage p-6 mb-8 space-y-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-primary-500" />
                  <h3 className="text-xl font-display font-bold text-vintage-ink">
                    Summary & Verdict
                  </h3>
                </div>

                <div>
                  <h4 className="text-lg font-display font-bold text-vintage-ink mb-3">
                    Summary
                  </h4>
                  <p className="text-vintage-darkBrown leading-relaxed whitespace-pre-wrap">
                    {selectedDebate.summary.summary}
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-display font-bold text-vintage-ink mb-3">
                    Moderator's Verdict
                  </h4>
                  <p className="text-vintage-darkBrown leading-relaxed whitespace-pre-wrap">
                    {selectedDebate.summary.verdict}
                  </p>
                </div>

                {selectedDebate.summary.keyTakeaways.length > 0 && (
                  <div>
                    <h4 className="text-lg font-display font-bold text-vintage-ink mb-3">
                      Key Takeaways
                    </h4>
                    <ul className="space-y-2">
                      {selectedDebate.summary.keyTakeaways.map((takeaway, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-3 text-vintage-darkBrown"
                        >
                          <span className="text-primary-500 font-bold mt-1">•</span>
                          <span className="flex-1">{takeaway}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}

            {/* Full Transcript */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card-vintage p-6"
            >
              <h3 className="text-xl font-display font-bold text-vintage-ink mb-6">
                Full Transcript
              </h3>

              <div className="space-y-8">
                {(['opening', 'arguments', 'rebuttals', 'closing'] as DebateRound[]).map(
                  (round) => {
                    const messages = messagesByRound[round] || [];
                    if (messages.length === 0) return null;

                    return (
                      <div key={round} className="space-y-6">
                        <h4 className="text-lg font-display font-semibold text-vintage-ink border-b-2 border-vintage-tan pb-2">
                          {ROUND_LABELS[round]}
                        </h4>
                        {messages.map((message, index) => {
                          const expert = selectedDebate.experts.find(
                            (e) => e.id === message.expertId
                          );
                          if (!expert) return null;

                          return (
                            <div key={index} className="pl-4 border-l-2 border-vintage-tan">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="text-2xl">{expert.avatar}</span>
                                <div>
                                  <h5 className="font-display font-bold text-vintage-ink">
                                    {expert.name}
                                  </h5>
                                  <p className="text-sm text-vintage-brown">
                                    {expert.expertise}
                                  </p>
                                </div>
                              </div>
                              <p className="text-vintage-darkBrown leading-relaxed whitespace-pre-wrap ml-11">
                                {message.content}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    );
                  }
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell currentStep="topic-selection" showProgress={false}>
      <div className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-vintage-ink mb-2">
                Debate History
              </h1>
              <p className="text-vintage-brown">
                Review past debates and their outcomes
              </p>
            </div>
            <button onClick={onBack} className="btn-secondary">
              <ArrowLeft className="w-5 h-5 inline mr-2" />
              Back to Topics
            </button>
          </div>

          {/* History List */}
          {debateHistory.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <History className="w-16 h-16 text-vintage-brown mx-auto mb-4 opacity-50" />
              <p className="text-xl text-vintage-brown">
                No debate history yet. Start your first debate!
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {debateHistory.map((debate, index) => {
                const winner = getWinner(debate);
                return (
                  <motion.button
                    key={debate.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedDebate(debate)}
                    className="card-vintage p-6 text-left hover:border-primary-400 transition-all group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-display font-bold text-vintage-ink mb-2 group-hover:text-primary-600 transition-colors">
                          {debate.topic.title}
                        </h3>
                        <p className="text-sm text-vintage-brown mb-3 line-clamp-2">
                          {debate.topic.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-vintage-brown">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(debate.createdAt)}
                          </div>
                          {winner && (
                            <div className="flex items-center gap-1">
                              <Trophy className="w-3 h-3 text-primary-500" />
                              {winner.name}
                            </div>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-vintage-brown group-hover:text-primary-500 transition-colors flex-shrink-0" />
                    </div>

                    {/* Expert avatars */}
                    <div className="flex items-center gap-2">
                      {debate.experts.slice(0, 5).map((expert) => (
                        <span key={expert.id} className="text-2xl" title={expert.name}>
                          {expert.avatar}
                        </span>
                      ))}
                      {debate.experts.length > 5 && (
                        <span className="text-sm text-vintage-brown">
                          +{debate.experts.length - 5}
                        </span>
                      )}
                    </div>

                    {debate.summary && (
                      <div className="mt-4 flex items-center gap-2 text-xs text-primary-600">
                        <Sparkles className="w-3 h-3" />
                        <span>Summary available</span>
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

