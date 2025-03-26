// Frontend display properties
export const NewsItem = {
  id: '',
  description: '',
  image: '',
  category: ''
};
// Define news categories as constants
export const NEWS_CATEGORIES = [
  'general',
  'business',
  'technology',
  'entertainment',
  'sports',
  'science',
  'health',
  'politics',
  'world'
];

// Export news sources
export const NEWS_SOURCES = [
  'BBC News',
  'CNN',
  'The New York Times',
  'Reuters',
  'Associated Press',
  'The Guardian',
  'The Washington Post'
];

// Export default preferences
export const DEFAULT_PREFERENCES = {
  topic: 'general',
  keywords: [],
  preferred_sources: []
};

// Base news item structure
export const BASE_NEWS_ITEM = {
  title: '',
  content: '',
  url: '',
  source: '',
  published_at: '',
  topics: []
};

// Frontend news item structure
export const NEWS_ITEM_STRUCTURE = {
  ...BASE_NEWS_ITEM,
  id: '',
  description: '',
  image: '',
  category: 'general'
};

// News item creator function
export const createNewsItem = (data) => ({
  id: data.id || '',
  title: data.title || '',
  content: data.content || '',
  url: data.url || '',
  source: data.source || '',
  published_at: data.published_at || new Date().toISOString(),
  description: data.description || '',
  image: data.image || '',
  category: data.category || 'general',
  topics: data.topics || []
});

// Export for backwards compatibility
export const NewsCategory = NEWS_CATEGORIES;