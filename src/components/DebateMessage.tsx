import { motion } from 'framer-motion';
import type { Expert } from '@/types';

interface DebateMessageProps {
  expert: Expert;
  content: string;
  index: number;
}

const positionStyles = {
  pro: 'bg-accent-green/10 border-accent-green/30',
  con: 'bg-accent-pink/10 border-accent-pink/30',
  neutral: 'bg-accent-blue/10 border-accent-blue/30',
};

export function DebateMessage({ expert, content, index }: DebateMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: expert.position === 'pro' ? -50 : 50, y: 20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ delay: index * 0.2, type: 'spring', stiffness: 100 }}
      className="mb-8"
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="flex-shrink-0 w-16 h-16 rounded-full bg-vintage-paper border-2 border-vintage-tan
                     flex items-center justify-center text-3xl"
        >
          {expert.avatar}
        </motion.div>

        {/* Message Bubble */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-3 mb-2">
            <h4 className="font-display font-bold text-lg text-vintage-ink">
              {expert.name}
            </h4>
            <span className="text-sm text-vintage-brown">
              {expert.expertise}
            </span>
          </div>

          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.2 + 0.1 }}
            className={`p-5 rounded-2xl border-2 ${positionStyles[expert.position]}`}
          >
            <p className="text-vintage-ink leading-relaxed whitespace-pre-wrap">
              {content}
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
