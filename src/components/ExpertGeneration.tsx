import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Sparkles, Users } from 'lucide-react';
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
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allowFictional, setAllowFictional] = useState(false);
  const [showOptions, setShowOptions] = useState(true);

  const handleGenerate = async () => {
    try {
      setShowOptions(false);
      setIsGenerating(true);
      setError(null);
      const generatedExperts = await generateExperts(topic, allowFictional);
      setExperts(generatedExperts);
      setIsGenerating(false);
    } catch (err) {
      console.error(err);
      setError(
        'Failed to generate experts. Please check your API key and try again.'
      );
      setIsGenerating(false);
      setShowOptions(true);
    }
  };

  const handleStartDebate = () => {
    if (experts.length > 0) {
      onExpertsGenerated(experts);
    }
  };

  const handleBack = () => {
    if (experts.length > 0 && !showOptions) {
      // If experts are already generated, go back to options
      setExperts([]);
      setShowOptions(true);
    } else {
      // Otherwise go back to topic selection
      onBack();
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
            onClick={handleBack}
            className="text-vintage-brown hover:text-vintage-darkBrown mb-4 inline-block"
          >
            ← {experts.length > 0 && !showOptions ? 'Back to options' : 'Back to topics'}
          </button>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-vintage-ink mb-4">
            {topic.title}
          </h2>
          <p className="text-lg text-vintage-brown max-w-2xl mx-auto">
            {topic.description}
          </p>
        </motion.div>

        {/* Expert Type Options */}
        {showOptions && !isGenerating && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto mb-8"
          >
            <div className="card-vintage p-8">
              <div className="flex items-center justify-center gap-2 mb-6">
                <Users className="w-6 h-6 text-primary-500" />
                <h3 className="text-2xl font-display font-bold text-vintage-ink">
                  Choose Expert Type
                </h3>
              </div>

              <div className="space-y-4 mb-6">
                <label className="flex items-start gap-4 p-4 border-2 border-vintage-tan rounded-lg cursor-pointer hover:border-primary-400 transition-colors bg-vintage-cream">
                  <input
                    type="radio"
                    name="expertType"
                    checked={!allowFictional}
                    onChange={() => setAllowFictional(false)}
                    className="mt-1 w-5 h-5 text-primary-500"
                  />
                  <div className="flex-1">
                    <div className="font-bold text-vintage-ink mb-1">
                      Real-World Experts (Recommended)
                    </div>
                    <p className="text-sm text-vintage-darkBrown">
                      Generate debates with actual experts in the field who have publicly expressed views on this topic. Their responses will mimic their real personalities and communication styles.
                    </p>
                    <p className="text-xs text-primary-600 mt-2">
                      Examples: Elon Musk, Neil deGrasse Tyson, experts with known expertise
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-4 p-4 border-2 border-vintage-tan rounded-lg cursor-pointer hover:border-primary-400 transition-colors bg-vintage-cream">
                  <input
                    type="radio"
                    name="expertType"
                    checked={allowFictional}
                    onChange={() => setAllowFictional(true)}
                    className="mt-1 w-5 h-5 text-primary-500"
                  />
                  <div className="flex-1">
                    <div className="font-bold text-vintage-ink mb-1">
                      Mixed (Real & Fictional)
                    </div>
                    <p className="text-sm text-vintage-darkBrown">
                      Include both real-world experts and fictional characters with relevant expertise. Good for creative or hypothetical debates.
                    </p>
                  </div>
                </label>
              </div>

              <button
                onClick={handleGenerate}
                className="btn-primary w-full text-lg"
              >
                <Sparkles className="w-5 h-5 inline mr-2" />
                Generate Expert Panel
              </button>
            </div>
          </motion.div>
        )}

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
              {allowFictional ? 'Finding real and fictional experts' : 'Finding real-world domain experts'}
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
