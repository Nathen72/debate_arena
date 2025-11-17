import type { OpenRouterModel } from '@/types';

// Popular OpenRouter models for debate generation
// See https://openrouter.ai/docs#models for full list
export const OPENROUTER_MODELS: OpenRouterModel[] = [
  {
    id: 'anthropic/claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet',
    description: 'Anthropic\'s most intelligent model (Recommended)',
    pricing: {
      prompt: '$3.00/M tokens',
      completion: '$15.00/M tokens',
    },
  },
  {
    id: 'anthropic/claude-3-opus',
    name: 'Claude 3 Opus',
    description: 'Powerful model for complex tasks',
    pricing: {
      prompt: '$15.00/M tokens',
      completion: '$75.00/M tokens',
    },
  },
  {
    id: 'anthropic/claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    description: 'Balanced intelligence and speed',
    pricing: {
      prompt: '$3.00/M tokens',
      completion: '$15.00/M tokens',
    },
  },
  {
    id: 'anthropic/claude-3-haiku',
    name: 'Claude 3 Haiku',
    description: 'Fast and cost-effective',
    pricing: {
      prompt: '$0.25/M tokens',
      completion: '$1.25/M tokens',
    },
  },
  {
    id: 'openai/gpt-4-turbo',
    name: 'GPT-4 Turbo',
    description: 'OpenAI\'s most capable model',
    pricing: {
      prompt: '$10.00/M tokens',
      completion: '$30.00/M tokens',
    },
  },
  {
    id: 'openai/gpt-4',
    name: 'GPT-4',
    description: 'Reliable and powerful',
    pricing: {
      prompt: '$30.00/M tokens',
      completion: '$60.00/M tokens',
    },
  },
  {
    id: 'openai/gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    description: 'Fast and affordable',
    pricing: {
      prompt: '$0.50/M tokens',
      completion: '$1.50/M tokens',
    },
  },
  {
    id: 'google/gemini-pro-1.5',
    name: 'Gemini 1.5 Pro',
    description: 'Google\'s advanced model',
    pricing: {
      prompt: '$2.50/M tokens',
      completion: '$10.00/M tokens',
    },
  },
  {
    id: 'meta-llama/llama-3-70b-instruct',
    name: 'Llama 3 70B',
    description: 'Meta\'s open-source model',
    pricing: {
      prompt: '$0.59/M tokens',
      completion: '$0.79/M tokens',
    },
  },
  {
    id: 'mistralai/mistral-large',
    name: 'Mistral Large',
    description: 'Mistral\'s flagship model',
    pricing: {
      prompt: '$4.00/M tokens',
      completion: '$12.00/M tokens',
    },
  },
];

// Default model
export const DEFAULT_OPENROUTER_MODEL = 'anthropic/claude-3.5-sonnet';

// Get model by ID
export function getOpenRouterModel(id: string): OpenRouterModel | undefined {
  return OPENROUTER_MODELS.find((model) => model.id === id);
}
