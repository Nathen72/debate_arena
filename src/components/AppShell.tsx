import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { ReactNode } from 'react';

type AppStep = 'topic-selection' | 'expert-generation' | 'debate' | 'voting';

interface AppShellProps {
  children: ReactNode;
  currentStep: AppStep;
  showProgress?: boolean;
}

const STEPS: { key: AppStep; label: string }[] = [
  { key: 'topic-selection', label: 'Choose Topic' },
  { key: 'expert-generation', label: 'Build Panel' },
  { key: 'debate', label: 'Watch Debate' },
  { key: 'voting', label: 'Vote & Summary' },
];

export function AppShell({ children, currentStep, showProgress = true }: AppShellProps) {
  const currentStepIndex = STEPS.findIndex((s) => s.key === currentStep);

  return (
    <div className="min-h-screen bg-gradient-to-br from-vintage-cream via-vintage-paper to-vintage-cream">
      {/* Global Progress Indicator */}
      {showProgress && (
        <div className="sticky top-0 z-50 bg-vintage-paper/95 backdrop-blur-sm border-b-2 border-vintage-tan shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              {STEPS.map((step, index) => {
                const isCompleted = index < currentStepIndex;
                const isCurrent = index === currentStepIndex;
                const isUpcoming = index > currentStepIndex;

                return (
                  <div key={step.key} className="flex items-center flex-1">
                    <div className="flex items-center flex-1">
                      {/* Step Circle */}
                      <div className="flex flex-col items-center flex-1">
                        <motion.div
                          initial={false}
                          animate={{
                            scale: isCurrent ? 1.1 : 1,
                          }}
                          className={`relative w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                            isCompleted
                              ? 'bg-primary-500 border-primary-500 text-white'
                              : isCurrent
                              ? 'bg-primary-400 border-primary-500 text-white'
                              : 'bg-vintage-paper border-vintage-tan text-vintage-brown'
                          }`}
                        >
                          {isCompleted ? (
                            <Check className="w-5 h-5" />
                          ) : (
                            <span className="text-sm font-bold">{index + 1}</span>
                          )}
                        </motion.div>
                        {/* Step Label */}
                        <span
                          className={`text-xs mt-2 font-medium text-center ${
                            isCompleted || isCurrent
                              ? 'text-vintage-ink'
                              : 'text-vintage-brown/60'
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                      {/* Connector Line */}
                      {index < STEPS.length - 1 && (
                        <div
                          className={`h-0.5 flex-1 mx-2 transition-all duration-300 ${
                            isCompleted ? 'bg-primary-500' : 'bg-vintage-tan'
                          }`}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

