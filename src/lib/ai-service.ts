import { generateText, streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import type { Expert, DebateTopic, DebateRound, AIProvider, Debate, DebateSummary } from '@/types';

// Get AI provider configuration
function getAIModel(provider?: AIProvider, customModel?: string) {
  const openaiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const anthropicKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  const openrouterKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  const defaultProvider = (import.meta.env.VITE_DEFAULT_AI_PROVIDER || 'openai') as AIProvider;
  const openrouterModel = customModel || import.meta.env.VITE_OPENROUTER_MODEL || 'anthropic/claude-3.5-sonnet';

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
    return openrouterProvider(openrouterModel);
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

interface ExpertGenerationOptions {
  numExperts?: number;
  tone?: 'balanced' | 'formal' | 'casual';
  diversity?: 'balanced' | 'diverse' | 'focused';
  model?: string; // OpenRouter model ID
}

// Generate debate experts based on topic
export async function generateExperts(
  topic: DebateTopic,
  allowFictional: boolean = false,
  options: ExpertGenerationOptions = {}
): Promise<Expert[]> {
  const { numExperts = 3, tone = 'balanced', diversity = 'balanced', model: customModel } = options;
  const model = getAIModel(undefined, customModel);

  const expertTypeInstruction = allowFictional
    ? `Generate ${numExperts} experts who would have interesting perspectives on this topic. You may include BOTH real-world experts AND fictional experts. For real experts, use their actual names, backgrounds, and known positions. For fictional experts, create believable characters.`
    : `CRITICAL: Generate exactly ${numExperts} REAL-WORLD experts ONLY. These MUST be actual, well-known people (living or historical) who have publicly expressed views or have expertise relevant to this topic. DO NOT create fictional characters. DO NOT make up names. Every expert must be a real person with verifiable credentials and public statements. Include both supporters and critics, and optionally a neutral expert.`;

  const toneInstruction = {
    balanced: 'Mix of communication styles - some experts should be more formal/academic, others more conversational.',
    formal: 'All experts should communicate in a professional, academic, and structured manner. Use formal language and well-organized arguments.',
    casual: 'Experts should communicate in a conversational, accessible, and relatable style. Use everyday language and relatable examples.',
  }[tone];

  const diversityInstruction = {
    balanced: 'Include a mix of perspectives with some overlap in expertise areas. Aim for variety but allow some common ground.',
    diverse: 'Maximize variety - include experts from different backgrounds, fields, cultures, and viewpoints. Ensure maximum diversity of perspectives.',
    focused: 'Select experts with similar core expertise but different angles or specializations. They should share domain knowledge but approach the topic differently.',
  }[diversity];

  const prompt = `You are an expert at identifying relevant domain experts for debates.

Given this debate topic: "${topic.title}"
Description: ${topic.description}

${expertTypeInstruction}

Tone & Communication Style: ${toneInstruction}

Viewpoint Diversity: ${diversityInstruction}

For each expert, provide:
1. Their REAL, actual name (${allowFictional ? 'for real people, or a distinctive fictional name if fictional' : 'MUST be a real person - no fictional names allowed'})
2. Their area of expertise
3. Their likely position on this specific topic (pro, con, or neutral)
4. A single emoji that represents them
5. A detailed personality description including their communication style, known speaking patterns, catchphrases, or mannerisms
6. Their background and credentials
7. Notable works, quotes, or public statements (${allowFictional ? 'for real people' : 'REQUIRED - must reference actual public statements or works'})
8. Whether they are real (true) or fictional (false) - ${allowFictional ? 'can be either' : 'MUST be true for all experts'}

Examples of real experts for different topics:
- Commercial Space Flight: Elon Musk (pro), Neil deGrasse Tyson (neutral), critics of privatization
- Climate Change: Greta Thunberg, Bill Nye, relevant scientists
- AI Ethics: Sam Altman, Timnit Gebru, Stuart Russell

Return ONLY valid JSON in this exact format, no markdown or extra text:
{
  "experts": [
    {
      "name": "Elon Musk",
      "expertise": "SpaceX CEO & Commercial Space Pioneer",
      "position": "pro",
      "avatar": "🚀",
      "personality": "Direct, ambitious, often uses humor and memes, thinks in first principles, speaks with bold confidence about future possibilities. Known for saying things like 'Making life multiplanetary' and being provocatively optimistic.",
      "background": "Founder of SpaceX, Tesla, and other ventures. Revolutionized private space industry with reusable rockets.",
      "notableWorks": "Founded SpaceX in 2002, achieved first commercial spacecraft to ISS, developed Falcon Heavy and Starship",
      "isReal": true
    }
  ]
}`;

  try {
    const { text } = await generateText({
      model,
      prompt,
      temperature: 0.7, // Lower temperature for more factual accuracy
    });

    // Parse the JSON response
    // Handle cases where the response might be wrapped in markdown code blocks
    let jsonText = text.trim();
    // Remove markdown code block markers if present
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }
    const parsed = JSON.parse(jsonText);

    // Add IDs to experts and ensure isReal field exists
    let experts = parsed.experts.map((expert: Omit<Expert, 'id'>, index: number) => ({
      ...expert,
      id: `expert-${Date.now()}-${index}`,
      isReal: expert.isReal ?? !allowFictional, // Default to real if not specified
    }));

    // Ensure we have the requested number of experts (take first N if more, or note if fewer)
    if (experts.length > numExperts) {
      experts = experts.slice(0, numExperts);
    } else if (experts.length < numExperts) {
      console.warn(`Requested ${numExperts} experts but only got ${experts.length}`);
    }

    // Validation: If allowFictional is false, ensure all experts are marked as real
    if (!allowFictional) {
      const fictionalExperts = experts.filter(expert => !expert.isReal);
      if (fictionalExperts.length > 0) {
        console.warn(`Warning: ${fictionalExperts.length} expert(s) were marked as fictional but should be real. Forcing isReal=true.`, fictionalExperts.map(e => e.name));
        // Force all experts to be real when allowFictional is false
        experts = experts.map(expert => ({ ...expert, isReal: true }));
      }
    }

    return experts;
  } catch (error) {
    console.error('Error generating experts:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to generate debate experts: ${errorMessage}`);
  }
}

// Helper function to clean text (removes stage directions, etc.)
function cleanText(text: string): string {
  let cleanedText = text.trim();
  
  // Remove lines that are entirely in asterisks (stage directions)
  cleanedText = cleanedText
    .split('\n')
    .filter(line => {
      const trimmed = line.trim();
      // Skip lines that are entirely stage directions (wrapped in asterisks)
      if (trimmed.startsWith('*') && trimmed.endsWith('*')) {
        return false;
      }
      // Skip lines that are mostly asterisks with action descriptions
      if (trimmed.match(/^\*[^*]+\*$/)) {
        return false;
      }
      return true;
    })
    .join('\n');
  
  // Remove inline stage directions (text in asterisks within sentences)
  cleanedText = cleanedText.replace(/\*[^*]+\*/g, '');
  
  // Clean up extra whitespace
  cleanedText = cleanedText.replace(/\n\s*\n\s*\n/g, '\n\n').trim();

  return cleanedText;
}

// Build prompt for debate response
function buildDebatePrompt(
  expert: Expert,
  topic: DebateTopic,
  round: DebateRound,
  previousMessages: string[] = [],
  otherExperts: Expert[] = []
): string {
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

  const realPersonInstructions = expert.isReal
    ? `
CRITICAL: You are roleplaying as the REAL ${expert.name}. You must:
- Match their actual communication style, tone, and mannerisms EXACTLY
- Use phrases, expressions, or rhetorical devices they're known for
- Reference their known work, achievements, or public statements when relevant
- Adopt their characteristic way of thinking and arguing
- Include subtle personality quirks or catchphrases they're known for
${expert.notableWorks ? `- You may reference their notable work: ${expert.notableWorks}` : ''}

Study their personality carefully: ${expert.personality}

Mimic how they would ACTUALLY speak in a debate setting. Don't just talk ABOUT them - BE them.`
    : `
You are playing ${expert.name}, a fictional expert character.
Stay consistent with their personality: ${expert.personality}`;

  return `You are ${expert.name}, ${expert.expertise}.
Your background: ${expert.background}
Your position on this topic: ${expert.position}
${realPersonInstructions}

Topic: ${topic.title}
${topic.description}

Round: ${round.toUpperCase()}
${roundInstructions[round]}
${otherExpertsInfo}
${contextMessages}

${expert.isReal
  ? `Remember: You ARE ${expert.name}. Speak, think, and argue exactly as they would. Use their voice, their style, their way of presenting ideas. The audience should feel like they're hearing the real ${expert.name}.`
  : `Stay in character as ${expert.name}.`}

IMPORTANT FORMATTING RULES:
- Write ONLY in first person as ${expert.name} speaking directly
- DO NOT include third-person narrations, stage directions, or action descriptions
- DO NOT use asterisks (*) or italics to describe actions like "*adjusts glasses*" or "*speaking in a measured tone*"
- DO NOT describe your own physical actions or mannerisms
- Write as if you are speaking directly to the audience - just your words, nothing else
- Your personality and communication style should come through in HOW you speak, not through descriptions of how you're speaking

Keep it engaging and substantive but not too long (150-250 words).

Your response:`;
}

// Generate a debate response for a specific expert and round (streaming version)
export async function generateDebateResponseStream(
  expert: Expert,
  topic: DebateTopic,
  round: DebateRound,
  onChunk: (chunk: string) => void,
  previousMessages: string[] = [],
  otherExperts: Expert[] = [],
  customModel?: string
): Promise<string> {
  const model = getAIModel(undefined, customModel);
  const prompt = buildDebatePrompt(expert, topic, round, previousMessages, otherExperts);

  try {
    const result = streamText({
      model,
      prompt,
      temperature: 0.8, // Higher for more personality
    });

    let fullText = '';
    for await (const chunk of result.textStream) {
      fullText += chunk;
      // Send chunk as-is for streaming (we'll do final cleaning at the end)
      onChunk(chunk);
    }

    // Final cleaning pass on the complete text
    const cleanedText = cleanText(fullText);
    
    return cleanedText;
  } catch (error) {
    console.error('Error generating debate response:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to generate response for ${expert.name}: ${errorMessage}`);
  }
}

// Generate a debate response for a specific expert and round
export async function generateDebateResponse(
  expert: Expert,
  topic: DebateTopic,
  round: DebateRound,
  previousMessages: string[] = [],
  otherExperts: Expert[] = [],
  customModel?: string
): Promise<string> {
  const model = getAIModel(undefined, customModel);
  const prompt = buildDebatePrompt(expert, topic, round, previousMessages, otherExperts);

  try {
    const { text } = await generateText({
      model,
      prompt,
      temperature: 0.8, // Higher for more personality
    });

    return cleanText(text);
  } catch (error) {
    console.error('Error generating debate response:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to generate response for ${expert.name}: ${errorMessage}`);
  }
}

// Generate debate summary and verdict
export async function generateDebateSummary(debate: Debate, customModel?: string): Promise<DebateSummary> {
  const model = getAIModel(undefined, customModel);

  // Organize messages by expert and round
  const messagesByExpert = debate.experts.map((expert) => {
    const expertMessages = debate.messages
      .filter((m) => m.expertId === expert.id)
      .map((m) => {
        const roundLabel = ROUNDS.find((r) => r.key === m.round)?.label || m.round;
        return `[${roundLabel}] ${m.content}`;
      })
      .join('\n\n');
    return `${expert.name} (${expert.expertise}, Position: ${expert.position}):\n${expertMessages}`;
  });

  const fullTranscript = messagesByExpert.join('\n\n---\n\n');

  const prompt = `You are a neutral debate moderator analyzing a completed debate.

Debate Topic: ${debate.topic.title}
${debate.topic.description}

Participants:
${debate.experts.map((e) => `- ${e.name} (${e.expertise}, ${e.position})`).join('\n')}

Full Debate Transcript:
${fullTranscript}

Your task is to provide:
1. A concise summary (2-3 paragraphs) that captures the main arguments from each expert
2. A neutral moderator's verdict (2-3 paragraphs) that highlights the most compelling reasoning presented, regardless of who won the popular vote. Focus on the strength of arguments, evidence, and logic.
3. 3-5 key takeaways (bullet points) that capture the most important insights from this debate

Return ONLY valid JSON in this exact format, no markdown or extra text:
{
  "summary": "Concise 2-3 paragraph summary of main arguments from each expert...",
  "verdict": "Neutral moderator verdict highlighting most compelling reasoning...",
  "keyTakeaways": [
    "First key takeaway",
    "Second key takeaway",
    "Third key takeaway"
  ]
}`;

  try {
    const { text } = await generateText({
      model,
      prompt,
      temperature: 0.7,
    });

    // Parse the JSON response
    let jsonText = text.trim();
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }
    const parsed = JSON.parse(jsonText);

    return {
      summary: parsed.summary || '',
      verdict: parsed.verdict || '',
      keyTakeaways: parsed.keyTakeaways || [],
    };
  } catch (error) {
    console.error('Error generating debate summary:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to generate debate summary: ${errorMessage}`);
  }
}

const ROUNDS: { key: DebateRound; label: string }[] = [
  { key: 'opening', label: 'Opening Statements' },
  { key: 'arguments', label: 'Main Arguments' },
  { key: 'rebuttals', label: 'Rebuttals' },
  { key: 'closing', label: 'Closing Statements' },
];

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
