import { motion } from 'framer-motion';
import { Badge, Star } from 'lucide-react';
import type { Expert } from '@/types';

interface ExpertCardProps {
  expert: Expert;
  delay?: number;
  onClick?: () => void;
}

const positionColors = {
  pro: 'bg-accent-green/10 text-accent-green border-accent-green/30',
  con: 'bg-accent-pink/10 text-accent-pink border-accent-pink/30',
  neutral: 'bg-accent-blue/10 text-accent-blue border-accent-blue/30',
};

const positionLabels = {
  pro: 'In Favor',
  con: 'Against',
  neutral: 'Neutral',
};

export function ExpertCard({ expert, delay = 0, onClick }: ExpertCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 200, damping: 20 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      onClick={onClick}
      className={`card-vintage p-6 cursor-pointer ${
        onClick ? 'hover:border-primary-400' : ''
      }`}
    >
      {/* Avatar */}
      <div className="flex items-start gap-4 mb-4">
        <motion.div
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
          className="text-5xl"
        >
          {expert.avatar}
        </motion.div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 mb-1">
            <h3 className="text-xl font-display font-bold text-vintage-ink flex-1">
              {expert.name}
            </h3>
            {expert.isReal && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-bold bg-primary-500 text-white rounded-full" title="Real-world expert">
                <Star className="w-3 h-3 fill-current" />
                REAL
              </span>
            )}
          </div>
          <p className="text-sm text-vintage-brown font-medium">
            {expert.expertise}
          </p>
        </div>
      </div>

      {/* Position Badge */}
      <div className="flex items-center gap-2 mb-3">
        <Badge className="w-4 h-4" />
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full border-2 ${
            positionColors[expert.position]
          }`}
        >
          {positionLabels[expert.position]}
        </span>
      </div>

      {/* Background */}
      <p className="text-sm text-vintage-darkBrown/90 mb-3 italic">
        "{expert.background}"
      </p>

      {/* Notable Works (for real experts) */}
      {expert.isReal && expert.notableWorks && (
        <p className="text-xs text-primary-600 mb-2 font-medium">
          Notable: {expert.notableWorks}
        </p>
      )}

      {/* Personality */}
      <p className="text-xs text-vintage-brown">
        {expert.personality}
      </p>
    </motion.div>
  );
}
