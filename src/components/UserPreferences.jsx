import React, { useState, useEffect } from 'react';
import { useUserData } from '@nhost/react';
import { useMutation, useQuery, gql } from '@apollo/client';

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
    $userId: uuid!, 
    $topic: String!, 
    $keywords: jsonb, 
    $preferred_sources: jsonb
  ) {
    insert_user_preferences(
      objects: {
        user_id: $userId, 
        topic: $topic, 
        keywords: $keywords, 
        preferred_sources: $preferred_sources
      },
      on_conflict: {
        constraint: user_preferences_user_id_key,
        update_columns: [topic, keywords, preferred_sources]
      }
    ) {
      returning {
        id
      }
    }
  }
`;

const CATEGORY_OPTIONS = [
  'general', 'business', 'technology', 'entertainment', 'sports', 
  'science', 'health', 'politics', 'world'
];

const SOURCE_OPTIONS = [
  'BBC News', 'CNN', 'The New York Times', 'Reuters', 
  'Associated Press', 'The Guardian', 'The Washington Post'
];

const UserPreferences = ({ onSave, onCancel }) => {
  const user = useUserData();
  const userId = user?.id;
  
  const [preferences, setPreferences] = useState({
    topic: 'general',
    keywords: [],
    preferred_sources: []
  });
  
  const [newKeyword, setNewKeyword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  // Query to get existing preferences
  const { loading, error, data } = useQuery(GET_USER_PREFERENCES, {
    variables: { userId },
    skip: !userId,
    fetchPolicy: 'network-only'
  });
  
  // Mutation to update preferences
  const [updatePreferences] = useMutation(UPDATE_USER_PREFERENCES);
  
  // Load existing preferences
  useEffect(() => {
    if (data?.user_preferences?.length > 0) {
      const userPrefs = data.user_preferences[0];
      setPreferences({
        topic: userPrefs.topic || 'general',
        keywords: userPrefs.keywords || [],
        preferred_sources: userPrefs.preferred_sources || []
      });
    }
  }, [data]);
  
  const handleTopicChange = (topic) => {
    setPreferences(prev => ({ ...prev, topic }));
  };
  
  const handleSourceToggle = (source) => {
    setPreferences(prev => {
      const sources = [...prev.preferred_sources];
      if (sources.includes(source)) {
        return { ...prev, preferred_sources: sources.filter(s => s !== source) };
      } else {
        return { ...prev, preferred_sources: [...sources, source] };
      }
    });
  };
  
  const addKeyword = () => {
    if (newKeyword.trim() && !preferences.keywords.includes(newKeyword.trim())) {
      setPreferences(prev => ({
        ...prev,
        keywords: [...prev.keywords, newKeyword.trim()]
      }));
      setNewKeyword('');
    }
  };
  
  const removeKeyword = (keyword) => {
    setPreferences(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }));
  };
  
  const handleSave = async () => {
    if (!userId) return;
    
    setIsSaving(true);
    try {
      await updatePreferences({
        variables: {
          userId,
          topic: preferences.topic,
          keywords: preferences.keywords,
          preferred_sources: preferences.preferred_sources
        }
      });
      
      if (onSave) {
        onSave(preferences);
      }
    } catch (err) {
      console.error('Error saving preferences:', err);
    } finally {
      setIsSaving(false);
    }
  };
  
  if (loading) return <div className="text-center p-4">Loading preferences...</div>;
  
  return (
    <div className="bg-navy-800 rounded-lg shadow-md p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold text-white mb-6">Customize Your News Feed</h2>
      
      {/* Topic Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-3">News Categories</h3>
        <p className="text-gray-300 mb-3">Select your preferred news category:</p>
        <div className="flex flex-wrap gap-2">
          {CATEGORY_OPTIONS.map(category => (
            <button
              key={category}
              type="button"
              onClick={() => handleTopicChange(category)}
              className={`px-3 py-1 rounded text-sm ${
                preferences.topic === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-navy-700 text-gray-300 hover:bg-navy-600'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      {/* Keywords */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-3">Keywords</h3>
        <p className="text-gray-300 mb-3">Add keywords to customize your news feed:</p>
        <div className="flex mb-2">
          <input
            type="text"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
            placeholder="Enter a keyword"
            className="flex-grow p-2 bg-navy-700 border border-navy-600 rounded-l text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={addKeyword}
            disabled={!newKeyword.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-r hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {preferences.keywords.map(keyword => (
            <div key={keyword} className="bg-navy-700 text-gray-200 px-3 py-1 rounded-full flex items-center">
              <span>{keyword}</span>
              <button
                type="button"
                onClick={() => removeKeyword(keyword)}
                className="ml-2 text-gray-400 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
          {preferences.keywords.length === 0 && (
            <p className="text-gray-400 text-sm">No keywords added yet</p>
          )}
        </div>
      </div>
      
      {/* News Sources */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-3">Preferred News Sources</h3>
        <p className="text-gray-300 mb-3">Select your preferred news sources:</p>
        <div className="flex flex-wrap gap-2">
          {SOURCE_OPTIONS.map(source => (
            <button
              key={source}
              type="button"
              onClick={() => handleSourceToggle(source)}
              className={`px-3 py-1 rounded text-sm ${
                preferences.preferred_sources.includes(source)
                  ? 'bg-blue-600 text-white'
                  : 'bg-navy-700 text-gray-300 hover:bg-navy-600'
              }`}
            >
              {source}
            </button>
          ))}
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-navy-700 text-gray-300 rounded hover:bg-navy-600"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>
    </div>
  );
};

export default UserPreferences;