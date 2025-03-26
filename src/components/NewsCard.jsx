import React from 'react';
import { ExternalLink, ThumbsUp, ThumbsDown, Bookmark } from 'lucide-react';

export const NewsCard = ({ title, summary, sentiment, source, url, publishedAt }) => {
  // Format the date
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get sentiment color
  const getSentimentColor = (sentiment) => {
    if (!sentiment) return 'bg-gray-500';
    
    switch (sentiment.toLowerCase()) {
      case 'positive':
        return 'bg-green-500';
      case 'negative':
        return 'bg-red-500';
      case 'neutral':
      default:
        return 'bg-blue-500';
    }
  };

  // Get sentiment icon
  const getSentimentIcon = (sentiment) => {
    if (!sentiment) return null;
    
    switch (sentiment.toLowerCase()) {
      case 'positive':
        return <ThumbsUp size={16} />;
      case 'negative':
        return <ThumbsDown size={16} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-navy-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-white line-clamp-2">{title}</h3>
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-neon-green hover:text-opacity-80 ml-2 flex-shrink-0"
            aria-label="Open article in new tab"
          >
            <ExternalLink size={20} />
          </a>
        </div>
        
        <p className="text-gray-300 mb-4 line-clamp-3">{summary}</p>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-sm text-gray-400">{source}</span>
            <span className="mx-2 text-gray-600">•</span>
            <span className="text-sm text-gray-400">{formatDate(publishedAt)}</span>
          </div>
          
          {sentiment && (
            <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${getSentimentColor(sentiment)}`}>
              {getSentimentIcon(sentiment)}
              <span className="ml-1 capitalize">{sentiment}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};