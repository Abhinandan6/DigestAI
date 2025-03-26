import React, { useState, useEffect } from 'react';
import { useUserData } from '@nhost/react';
import { useMutation, useQuery, gql } from '@apollo/client';
import { Link } from 'react-router-dom';
import { Newspaper, ArrowLeft } from 'lucide-react';
import { triggerNewsUpdate } from '../utils/n8nService';
;

// GraphQL query to get user preferences
const GET_USER_PREFERENCES = gql`
  query GetUserPreferences($userId: uuid!) {
    user_preferences(where: {user_id: {_eq: $userId}}) {
      id
      topic
      keywords
      preferred_sources
    }
  }
`;

// GraphQL mutation to update user preferences
const UPDATE_USER_PREFERENCES = gql`
  mutation UpdateUserPreferences(
    $id: uuid!, 
    $topic: String!, 
    $keywords: _text!, 
    $preferred_sources: _text!
  ) {
    update_user_preferences_by_pk(
      pk_columns: {id: $id}, 
      _set: {
        topic: $topic, 
        keywords: $keywords, 
        preferred_sources: $preferred_sources
      }
    ) {
      id
    }
  }
`;

// Update TOPIC_OPTIONS to use NewsCategory type
const TOPIC_OPTIONS= [
  'general', 'business', 'technology', 'entertainment', 'sports', 
  'science', 'health', 'politics', 'world'
];

const SOURCE_OPTIONS = [
  'BBC News', 'CNN', 'The New York Times', 'Reuters', 
  'Associated Press', 'The Guardian', 'The Washington Post'
];

const UserPreferences = () => {
  const user = useUserData();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSources, setSelectedSources] = useState([]);
  const [keywords, setKeywords] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Query to get existing preferences
  const { loading, error, data } = useQuery(GET_USER_PREFERENCES, {
    variables: { userId: user?.id },
    skip: !user?.id,
  });

  // Mutation to update preferences
  // Add loading state for mutation
  const [updatePreferences, { loading: updating }] = useMutation(UPDATE_USER_PREFERENCES);

  // Set initial values from database
  useEffect(() => {
    if (data?.user_preferences?.length > 0) {
      const prefs = data.user_preferences[0];
      setSelectedCategories([prefs.topic || 'general'] as NewsCategory[]);
      setSelectedSources(prefs.preferred_sources || []);
      setKeywords(prefs.keywords?.join(', ') || '');
    }
  }, [data]);

  // Update the category toggle handler
  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleSourceToggle = (source) => {
    setSelectedSources(prev => 
      prev.includes(source)
        ? prev.filter(s => s !== source)
        : [...prev, source]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const keywordArray = keywords.split(',').map(k => k.trim()).filter(Boolean);
      
      await updatePreferences({
        variables: {
          id: data?.user_preferences[0]?.id,
          topic: selectedCategories[0] || 'general',
          keywords,
          preferred_sources: selectedSources
        }
      });

      await triggerNewsUpdate(user?.id || '', {
        topic: selectedCategories[0] as NewsCategory,
        keywords,
        preferred_sources: selectedSources
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  if (loading) return (
    
      
    
  );

  return (
    
      
        
          
            
              
              NewsFlow
            
            
              
              Back to Dashboard
            
          
        
      

      
        Your News Preferences

        {saveSuccess && (
          
            Your preferences have been saved successfully!
          
        )}

        {error && (
          
            Error loading preferences: {error.message}
          
        )}

        
          
            Categories
            
              {TOPIC_OPTIONS.map(category => (
                
                   handleCategoryToggle(category as NewsCategory)}
                  />
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                
              ))}
            
          

          
            News Sources
            
              {SOURCE_OPTIONS.map(source => (
                
                   handleSourceToggle(source)}
                  />
                  {source}
                
              ))}
            
          

          
            Keywords
            Enter keywords separated by commas
             setKeywords(e.target.value)}
              placeholder="e.g., climate change, artificial intelligence, space exploration"
            >
          

          
            
              {updating ? 'Saving...' : 'Save Preferences'}
            
          
        
      
    
  );
};

export default UserPreferences;