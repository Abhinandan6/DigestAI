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

export interface SearchBarProps {
  onSearch: (query: string) => void;
  onCategoryChange: (newCategory: NewsCategory) => void;
  selectedCategory: NewsCategory;
}

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  content: string;
  source: string;
  url: string;
  image: string;
  category: NewsCategory;
  published_at: string;
  topics: string[];
  processed_articles?: {
    summary?: string;
    sentiment?: string;
  }[];
}