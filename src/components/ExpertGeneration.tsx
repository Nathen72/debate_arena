import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Sparkles } from 'lucide-react';
import { generateExperts } from '@/lib/ai-service';
import { ExpertCard } from './ExpertCard';
import type { DebateTopic, Expert } from '@/types';

interface ExpertGenerationProps {
  topic: DebateTopic;
  onExpertsGenerated: (experts: Expert[]) => void;
  onBack: () => void;
}

export function ExpertGeneration({
  topic,
  onExpertsGenerated,
  onBack,
}: ExpertGenerationProps) {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [isGenerating, setIsGenerating] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function generate() {
      try {
        setIsGenerating(true);
        setError(null);
        const generatedExperts = await generateExperts(topic);
        setExperts(generatedExperts);
        setIsGenerating(false);
      } catch (err) {
        console.error(err);
        setError(
          'Failed to generate experts. Please check your API key and try again.'
        );
        setIsGenerating(false);
      }
    }

    generate();
  }, [topic]);

  const handleStartDebate = () => {
    if (experts.length > 0) {
      onExpertsGenerated(experts);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <button
            onClick={onBack}
            className="text-vintage-brown hover:text-vintage-darkBrown mb-4 inline-block"
          >
            ← Back to topics
          </button>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-vintage-ink mb-4">
            {topic.title}
          </h2>
          <p className="text-lg text-vintage-brown max-w-2xl mx-auto">
            {topic.description}
          </p>
        </motion.div>

        {/* Loading State */}
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="inline-flex items-center gap-3 px-6 py-4 bg-vintage-paper rounded-xl border-2 border-vintage-tan">
              <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
              <span className="text-lg font-medium text-vintage-ink">
                Assembling expert panel...
              </span>
              <Sparkles className="w-5 h-5 text-primary-400" />
            </div>
            <p className="text-vintage-brown mt-4">
              Finding the most interesting perspectives
            </p>
          </motion.div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-accent-pink/10 border-2 border-accent-pink/30 rounded-xl p-6">
              <h3 className="text-lg font-bold text-accent-pink mb-2">
                Generation Failed
              </h3>
              <p className="text-vintage-darkBrown mb-4">{error}</p>
              <div className="flex gap-3">
                <button onClick={onBack} className="btn-secondary">
                  Choose Different Topic
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="btn-primary"
                >
                  Retry
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Experts Display */}
        {!isGenerating && !error && experts.length > 0 && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center mb-8"
            >
              <h3 className="text-2xl font-display font-bold text-vintage-ink mb-2">
                Meet Your Debate Panel
              </h3>
              <p className="text-vintage-brown">
                {experts.length} experts ready to discuss
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {experts.map((expert, index) => (
                <ExpertCard key={expert.id} expert={expert} delay={0.1 * index} />
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center"
            >
              <button onClick={handleStartDebate} className="btn-primary text-lg">
                <Sparkles className="w-5 h-5 inline mr-2" />
                Start the Debate
              </button>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
