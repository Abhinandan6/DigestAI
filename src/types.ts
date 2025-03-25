// First NewsItem interface should be renamed to avoid duplication
export interface SimpleNewsItem {
  title: string;
  description: string;
  url: string;
  image?: string;
  category?: string;
  published_at?: string;
}

export interface SearchProps {
  onSearch: (query: string) => void;
  onCategoryChange: (category: string) => void;
  selectedCategory: string;
}

// Define types for the news application

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

// Update the NewsItem interface to include all properties needed by NewsCard
export interface NewsItem {
  id: string;
  title: string;
  description: string; // Add this property
  content: string;
  source: string;
  published_at?: string;
  url: string;
  topics: string[];
  image?: string; // Add this property
  category?: string; // Add this property
  processed_articles?: {
    summary: string;
    sentiment: 'positive' | 'neutral' | 'negative';
    explanation?: string;
  };
}

export interface UserPreference {
  id: string;
  user_id: string;
  topic: string;
  keywords: string[];
  preferred_sources: string[];
}

export interface Article {
  id: string;
  title: string;
  content: string;
  source: string;
  published_at?: string; // Made optional to match the first declaration
  url: string;
  topics: string[];
  processed_articles?: {
    summary: string;
    sentiment: 'positive' | 'neutral' | 'negative';
    explanation?: string;
  };
}