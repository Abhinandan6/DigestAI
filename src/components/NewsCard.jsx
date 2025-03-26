import React from 'react';
import { ExternalLink, Calendar } from 'lucide-react';
;

// Updated to use NewsItem interface
export const NewsCard: React.FC = ({
  title,
  description,
  url,
  image,
  category,
  published_at
}) => {
  // Format the date
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    
      
         {
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80';
          }}
        />
      
      
      
        
          
            {category ? category.charAt(0).toUpperCase() + category.slice(1) : 'General'}
          
          
            
            {formatDate(published_at)}
          
        
        
        {title}
        
        
          {description || 'No description available'}
        
        
        
          Read more 
        
      
    
  );
};