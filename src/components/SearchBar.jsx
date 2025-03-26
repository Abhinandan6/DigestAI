import React, { useState } from 'react';
import { Search } from 'lucide-react';
;



export const SearchBar: React.FC = ({ 
  onSearch, 
  onCategoryChange, 
  selectedCategory 
}) => {
  const [searchInput, setSearchInput] = useState('');
  
  const categories= [
    'general',
    'business',
    'entertainment',
    'health',
    'science',
    'sports',
    'technology'
  ];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchInput);
  };
  
  return (
    
      
        
          
           setSearchInput(e.target.value)}
          />
        
        
          Search
        
      
      
      
        {categories.map((category) => (
           onCategoryChange(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-navy-800 text-gray-300 hover:bg-navy-700'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          
        ))}
      
    
  );
};