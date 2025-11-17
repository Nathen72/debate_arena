import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles, TrendingUp } from 'lucide-react';
import { PRESET_TOPICS, searchTopics } from '@/lib/preset-topics';
import type { DebateTopic } from '@/types';

interface TopicSelectionProps {
  onSelectTopic: (topic: DebateTopic) => void;
}

export function TopicSelection({ onSelectTopic }: TopicSelectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [customTopic, setCustomTopic] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  const filteredTopics = searchQuery
    ? searchTopics(searchQuery)
    : PRESET_TOPICS;

  const handleCustomSubmit = () => {
    if (!customTopic.trim()) return;

    const topic: DebateTopic = {
      id: `custom-${Date.now()}`,
      title: customTopic,
      description: 'Custom debate topic',
      category: 'Custom',
    };

    onSelectTopic(topic);
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl md:text-7xl font-display font-bold text-vintage-ink mb-4">
            Debate Arena
          </h1>
          <p className="text-xl text-vintage-brown font-medium">
            Where ideas collide and perspectives emerge
          </p>
          <div className="flex items-center justify-center gap-2 mt-4 text-vintage-darkBrown">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm">Powered by AI experts</span>
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-vintage-brown" />
            <input
              type="text"
              placeholder="Search debate topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-vintage-paper border-2 border-vintage-tan rounded-xl
                       text-vintage-ink placeholder:text-vintage-brown/60
                       focus:outline-none focus:border-primary-400 transition-colors"
            />
          </div>
        </motion.div>

        {/* Custom Topic Toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <button
            onClick={() => setShowCustom(!showCustom)}
            className="text-primary-600 hover:text-primary-700 font-medium underline"
          >
            {showCustom ? 'Choose from presets' : 'Or create your own topic'}
          </button>
        </motion.div>

        {/* Custom Topic Input */}
        {showCustom && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="max-w-2xl mx-auto mb-8"
          >
            <div className="card-vintage p-6">
              <label className="block text-vintage-darkBrown font-medium mb-3">
                Create Your Custom Debate Topic
              </label>
              <input
                type="text"
                placeholder="e.g., Pineapple belongs on pizza"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCustomSubmit()}
                className="w-full px-4 py-3 bg-vintage-cream border-2 border-vintage-tan rounded-lg
                         text-vintage-ink placeholder:text-vintage-brown/60
                         focus:outline-none focus:border-primary-400 transition-colors mb-4"
              />
              <button
                onClick={handleCustomSubmit}
                disabled={!customTopic.trim()}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Start Custom Debate
              </button>
            </div>
          </motion.div>
        )}

        {/* Preset Topics Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredTopics.map((topic, index) => (
            <motion.button
              key={topic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectTopic(topic)}
              className="card-vintage p-6 text-left hover:border-primary-400 transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
                  {topic.category}
                </span>
                <TrendingUp className="w-4 h-4 text-vintage-brown group-hover:text-primary-500 transition-colors" />
              </div>
              <h3 className="text-lg font-display font-semibold text-vintage-ink mb-2 group-hover:text-primary-600 transition-colors">
                {topic.title}
              </h3>
              <p className="text-sm text-vintage-darkBrown/80">
                {topic.description}
              </p>
            </motion.button>
          ))}
        </motion.div>

        {filteredTopics.length === 0 && (
          <div className="text-center py-12">
            <p className="text-vintage-brown text-lg">
              No topics found. Try a different search or create your own!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
