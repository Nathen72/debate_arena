import { useState, useEffect } from 'react';
import { TopicSelection } from './components/TopicSelection';
import { ExpertGeneration } from './components/ExpertGeneration';
import { DebateView } from './components/DebateView';
import { useDebateStore } from './stores/debateStore';
import { validateAPIKeys } from './lib/ai-service';
import { generateId } from './lib/utils';
import type { DebateTopic, Expert, Debate } from './types';

type AppState = 'topic-selection' | 'expert-generation' | 'debate' | 'api-key-missing';

function App() {
  const [appState, setAppState] = useState<AppState>('api-key-missing');
  const [selectedTopic, setSelectedTopic] = useState<DebateTopic | null>(null);
  const { currentDebate, setCurrentDebate, clearCurrentDebate } = useDebateStore();

  // Check for API keys on mount
  useEffect(() => {
    const { isValid } = validateAPIKeys();
    if (isValid) {
      setAppState('topic-selection');
    } else {
      setAppState('api-key-missing');
    }
  }, []);

  const handleTopicSelect = (topic: DebateTopic) => {
    setSelectedTopic(topic);
    setAppState('expert-generation');
  };

  const handleExpertsGenerated = (experts: Expert[]) => {
    if (!selectedTopic) return;

    const debate: Debate = {
      id: generateId(),
      topic: selectedTopic,
      experts,
      messages: [],
      currentRound: 'opening',
      isComplete: false,
      createdAt: new Date(),
    };

    setCurrentDebate(debate);
    setAppState('debate');
  };

  const handleDebateComplete = () => {
    clearCurrentDebate();
    setSelectedTopic(null);
    setAppState('topic-selection');
  };

  const handleBack = () => {
    setSelectedTopic(null);
    setAppState('topic-selection');
  };

  // API Key Missing State
  if (appState === 'api-key-missing') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-2xl w-full">
          <div className="card-vintage p-8">
            <h1 className="text-3xl font-display font-bold text-vintage-ink mb-4">
              Welcome to Debate Arena
            </h1>
            <p className="text-vintage-darkBrown mb-6">
              To get started, you need to configure an AI provider API key. This app uses the Vercel AI SDK which supports multiple providers.
            </p>

            <div className="bg-vintage-cream rounded-lg p-6 mb-6 font-mono text-sm">
              <p className="text-vintage-brown mb-2">Create a <code className="bg-vintage-paper px-2 py-1 rounded">.env</code> file in the project root:</p>
              <pre className="text-vintage-ink overflow-x-auto">
{`# Choose one or both:
VITE_OPENAI_API_KEY=your_key_here
VITE_ANTHROPIC_API_KEY=your_key_here

# Optional:
VITE_DEFAULT_AI_PROVIDER=openai`}
              </pre>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🔑</span>
                <div>
                  <h3 className="font-bold text-vintage-ink">OpenAI</h3>
                  <p className="text-sm text-vintage-brown">
                    Get your API key from{' '}
                    <a
                      href="https://platform.openai.com/api-keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:underline"
                    >
                      platform.openai.com
                    </a>
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🤖</span>
                <div>
                  <h3 className="font-bold text-vintage-ink">Anthropic</h3>
                  <p className="text-sm text-vintage-brown">
                    Get your API key from{' '}
                    <a
                      href="https://console.anthropic.com/settings/keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:underline"
                    >
                      console.anthropic.com
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="btn-primary w-full"
            >
              I've Added My API Key - Reload
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {appState === 'topic-selection' && (
        <TopicSelection onSelectTopic={handleTopicSelect} />
      )}

      {appState === 'expert-generation' && selectedTopic && (
        <ExpertGeneration
          topic={selectedTopic}
          onExpertsGenerated={handleExpertsGenerated}
          onBack={handleBack}
        />
      )}

      {appState === 'debate' && currentDebate && (
        <DebateView debate={currentDebate} onComplete={handleDebateComplete} />
      )}
    </>
  );
}

export default App;
