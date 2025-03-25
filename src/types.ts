// Base news interface for common properties
export interface BaseNewsItem {
  title: string;
  content: string;
  url: string;
  source: string;
  published_at?: string;
  topics: string[];
  processed_articles?: {
    summary: string;
    sentiment: 'positive' | 'neutral' | 'negative';
    explanation?: string;
  };
}

// Frontend display properties
export interface NewsItem extends BaseNewsItem {
  id: string;
  description: string;
  image?: string;
  category?: string;
}

export interface SearchProps {
  onSearch: (query: string) => void;
  onCategoryChange: (category: string) => void;
  selectedCategory: NewsCategory;
}

export type NewsCategory = 
  | 'general' 
  | 'business' 
  | 'technology' 
  | 'entertainment' 
  | 'sports' 
  | 'science' 
  | 'health' 
  | 'politics' 
  | 'world';

export interface UserPreference {
  id: string;
  user_id: string;
  topic: NewsCategory;
  keywords: string[];
  preferred_sources: string[];
}