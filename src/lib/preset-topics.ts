import type { DebateTopic } from '@/types';

export const PRESET_TOPICS: DebateTopic[] = [
  {
    id: 'ai-future',
    title: 'AI Will Improve Humanity\'s Future',
    description: 'Should we embrace AI advancement as beneficial for society, or does it pose existential risks?',
    category: 'Technology',
  },
  {
    id: 'remote-work',
    title: 'Remote Work is Better Than Office Work',
    description: 'Is working from home more productive and healthy, or do offices provide essential collaboration?',
    category: 'Work Culture',
  },
  {
    id: 'social-media',
    title: 'Social Media Does More Harm Than Good',
    description: 'Has social media connection come at too high a cost to mental health and democracy?',
    category: 'Society',
  },
  {
    id: 'space-exploration',
    title: 'Space Exploration Should Be Prioritized',
    description: 'Should we invest heavily in space exploration, or focus resources on Earth\'s problems?',
    category: 'Science',
  },
  {
    id: 'universal-income',
    title: 'Universal Basic Income Should Be Implemented',
    description: 'Would UBI solve poverty and inequality, or create dependency and economic problems?',
    category: 'Economics',
  },
  {
    id: 'crypto-future',
    title: 'Cryptocurrency Will Replace Traditional Money',
    description: 'Is crypto the future of finance, or just speculative hype?',
    category: 'Finance',
  },
  {
    id: 'art-ai',
    title: 'AI-Generated Art is Real Art',
    description: 'Can AI create genuine art, or is human creativity irreplaceable?',
    category: 'Art & Culture',
  },
  {
    id: 'climate-action',
    title: 'Individual Action Can Solve Climate Change',
    description: 'Can personal choices make a difference, or do we need systemic change?',
    category: 'Environment',
  },
];

export const TOPIC_CATEGORIES = [
  'Technology',
  'Work Culture',
  'Society',
  'Science',
  'Economics',
  'Finance',
  'Art & Culture',
  'Environment',
] as const;

export function getTopicsByCategory(category: string): DebateTopic[] {
  return PRESET_TOPICS.filter((topic) => topic.category === category);
}

export function searchTopics(query: string): DebateTopic[] {
  const lowercaseQuery = query.toLowerCase();
  return PRESET_TOPICS.filter(
    (topic) =>
      topic.title.toLowerCase().includes(lowercaseQuery) ||
      topic.description.toLowerCase().includes(lowercaseQuery) ||
      topic.category.toLowerCase().includes(lowercaseQuery)
  );
}
