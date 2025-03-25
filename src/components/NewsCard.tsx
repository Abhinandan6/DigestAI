import React from 'react';
import { ExternalLink, Calendar } from 'lucide-react';
import type { NewsItem } from '../types';

// Updated to use NewsItem interface
export const NewsCard: React.FC<NewsItem> = ({
  title,
  description,
  url,
  image,
  category,
  published_at
}) => {
  // Format the date
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Unknown date';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-navy-800 rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-[1.02]">
      <div className="h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80';
          }}
        />
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-semibold px-2 py-1 bg-blue-900/50 text-blue-300 rounded">
            {category ? category.charAt(0).toUpperCase() + category.slice(1) : 'General'}
          </span>
          <div className="flex items-center text-gray-400 text-xs">
            <Calendar size={14} className="mr-1" />
            {formatDate(published_at)}
          </div>
        </div>
        
        <h3 className="text-xl font-bold mb-2 line-clamp-2">{title}</h3>
        
        <p className="text-gray-300 mb-4 line-clamp-3">
          {description || 'No description available'}
        </p>
        
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center text-blue-400 hover:text-blue-300"
        >
          Read more <ExternalLink size={16} className="ml-1" />
        </a>
      </div>
    </div>
  );
};