import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import type { Expert, DebateTopic, DebateRound, AIProvider } from '@/types';

// Get AI provider configuration
function getAIModel(provider?: AIProvider) {
  const openaiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const anthropicKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  const openrouterKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  const defaultProvider = (import.meta.env.VITE_DEFAULT_AI_PROVIDER || 'openai') as AIProvider;
  const openrouterModel = import.meta.env.VITE_OPENROUTER_MODEL || 'anthropic/claude-3.5-sonnet';

  // Determine which provider to use
  // Priority: OpenAI > OpenRouter (with Anthropic models) > Anthropic (direct)
  // Note: Using Anthropic via OpenRouter is more reliable than direct browser access
  // Both OpenAI and Anthropic now support browser requests (Anthropic as of Aug 2024)
  const selectedProvider = provider ||
    (openaiKey ? 'openai' :
     (openrouterKey ? 'openrouter' :
      (anthropicKey ? 'anthropic' : defaultProvider)));

  // OpenRouter provider
  if (selectedProvider === 'openrouter') {
    if (!openrouterKey) {
      throw new Error('OpenRouter API key is missing');
    }
    const openrouterProvider = createOpenRouter({
      apiKey: openrouterKey,
      baseURL: 'https://openrouter.ai/api/v1',
    });
    return openrouterProvider(openrouterModel, {
      maxTokens: 1500, // Set at model level to ensure it's used
    });
  }

  // Anthropic provider
  if (selectedProvider === 'anthropic') {
    if (!anthropicKey) {
      throw new Error('Anthropic API key is missing');
    }
    console.log('Using Anthropic provider directly');
    const anthropicProvider = createAnthropic({
      apiKey: anthropicKey,
      // Enable CORS support for browser requests (as of August 2024)
      // See: https://simonw.substack.com/p/claudes-api-now-supports-cors-requests
      headers: {
        'anthropic-dangerous-direct-browser-access': 'true',
      },
    });
    // Use the correct model identifier format as defined by the SDK
    // Valid formats: 'claude-sonnet-4-5', 'claude-3-7-sonnet-latest', etc.
    // See @ai-sdk/anthropic type definitions for all valid model names
    const modelName = 'claude-sonnet-4-5';
    const model = anthropicProvider(modelName);
    console.log('Anthropic model configured:', modelName);
    return model;
  }

  // OpenAI provider (default)
  if (!openaiKey) {
    throw new Error('OpenAI API key is missing');
  }
  const openaiProvider = createOpenAI({
    apiKey: openaiKey,
  });
  return openaiProvider('gpt-4-turbo-preview');
}

// Generate debate experts based on topic
export async function generateExperts(topic: DebateTopic): Promise<Expert[]> {
  const model = getAIModel();

  const prompt = `You are an expert at creating diverse, interesting debate participants.

Given this debate topic: "${topic.title}"
Description: ${topic.description}

Generate 3-5 unique experts who would have interesting perspectives on this topic. Include both supporters and critics, and optionally a neutral moderator.

For each expert, provide:
1. A distinctive name (can be real or fictional)
2. Their area of expertise
3. Their position (pro, con, or neutral)
4. A single emoji that represents them
5. A brief personality description (communication style, approach)
6. A one-line background

Return ONLY valid JSON in this exact format, no markdown or extra text:
{
  "experts": [
    {
      "name": "Dr. Sarah Chen",
      "expertise": "AI Ethics Researcher",
      "position": "pro",
      "avatar": "👩‍🔬",
      "personality": "Analytical and optimistic, speaks with careful precision",
      "background": "PhD in Computer Science, specializing in ethical AI development"
    }
  ]
}`;

  try {
    const { text } = await generateText({
      model,
      prompt,
      temperature: 0.8,
      maxTokens: 1500, // Reduced to work with available credits (can afford 2666)
    });

    // Parse the JSON response
    // Handle cases where the response might be wrapped in markdown code blocks
    let jsonText = text.trim();
    // Remove markdown code block markers if present
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }
    const parsed = JSON.parse(jsonText);

    // Add IDs to experts
    return parsed.experts.map((expert: Omit<Expert, 'id'>, index: number) => ({
      ...expert,
      id: `expert-${Date.now()}-${index}`,
    }));
  } catch (error) {
    console.error('Error generating experts:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to generate debate experts: ${errorMessage}`);
  }
}

// Generate a debate response for a specific expert and round
export async function generateDebateResponse(
  expert: Expert,
  topic: DebateTopic,
  round: DebateRound,
  previousMessages: string[] = [],
  otherExperts: Expert[] = []
): Promise<string> {
  const model = getAIModel();

  const roundInstructions: Record<DebateRound, string> = {
    opening: 'Give a compelling opening statement (2-3 paragraphs). Introduce your perspective and main thesis.',
    arguments: 'Present 2-3 strong arguments supporting your position. Reference facts, logic, or examples.',
    rebuttals: 'Respond to opposing viewpoints. Address counterarguments while strengthening your position.',
    closing: 'Deliver a powerful closing statement (2-3 paragraphs). Summarize your key points and leave a lasting impression.',
  };

  const contextMessages = previousMessages.length > 0
    ? `\n\nPrevious statements in this debate:\n${previousMessages.join('\n\n')}`
    : '';

  const otherExpertsInfo = otherExperts.length > 0
    ? `\n\nOther participants: ${otherExperts.map(e => `${e.name} (${e.position})`).join(', ')}`
    : '';

  const prompt = `You are ${expert.name}, ${expert.expertise}.
Your background: ${expert.background}
Your personality: ${expert.personality}
Your position on this topic: ${expert.position}

Topic: ${topic.title}
${topic.description}

Round: ${round.toUpperCase()}
${roundInstructions[round]}
${otherExpertsInfo}
${contextMessages}

Respond as ${expert.name} in character. Be authentic to your position (${expert.position}) and personality. Keep it engaging and substantive but not too long (150-250 words).

Your response:`;

  try {
    const { text } = await generateText({
      model,
      prompt,
      temperature: 0.7,
      maxTokens: 1000, // Reduced for debate responses
    });

    return text.trim();
  } catch (error) {
    console.error('Error generating debate response:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to generate response for ${expert.name}: ${errorMessage}`);
  }
}

// Validate API keys
export function validateAPIKeys(): { isValid: boolean; provider: AIProvider | null } {
  const openaiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const anthropicKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  const openrouterKey = import.meta.env.VITE_OPENROUTER_API_KEY;

  if (openaiKey) {
    return { isValid: true, provider: 'openai' };
  }
  if (anthropicKey) {
    return { isValid: true, provider: 'anthropic' };
  }
  if (openrouterKey) {
    return { isValid: true, provider: 'openrouter' };
  }

  return { isValid: false, provider: null };
}
