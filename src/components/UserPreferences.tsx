import React, { useState, useEffect } from 'react';
import { useUserData } from '@nhost/react';
import { useMutation, useQuery, gql } from '@apollo/client';
import { Link } from 'react-router-dom';
import { Newspaper, ArrowLeft } from 'lucide-react';
import { triggerNewsUpdate } from '../utils/n8nService';
import type { NewsCategory } from '../types';

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
const TOPIC_OPTIONS: NewsCategory[] = [
  'general', 'business', 'technology', 'entertainment', 'sports', 
  'science', 'health', 'politics', 'world'
];

const SOURCE_OPTIONS = [
  'BBC News', 'CNN', 'The New York Times', 'Reuters', 
  'Associated Press', 'The Guardian', 'The Washington Post'
];

const UserPreferences = () => {
  const user = useUserData();
  const [selectedCategories, setSelectedCategories] = useState<NewsCategory[]>([]);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
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
  const handleCategoryToggle = (category: NewsCategory) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleSourceToggle = (source: string) => {
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
          keywords: keywordArray,
          preferred_sources: selectedSources
        }
      });

      await triggerNewsUpdate(user?.id || '', {
        topic: selectedCategories[0] as NewsCategory,
        keywords: keywordArray,
        preferred_sources: selectedSources
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-navy-900 text-gray-100 flex justify-center items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-navy-900 text-gray-100">
      <header className="py-6 border-b border-navy-700 sticky top-0 bg-navy-900/95 backdrop-blur-sm z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Newspaper className="w-8 h-8 text-blue-500" />
              <h1 className="text-3xl font-bold">NewsFlow</h1>
            </div>
            <Link to="/" className="flex items-center gap-2 text-blue-400 hover:text-blue-300">
              <ArrowLeft size={16} />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Your News Preferences</h2>

        {saveSuccess && (
          <div className="mb-6 p-4 bg-green-900/50 border border-green-500 text-green-300 rounded">
            Your preferences have been saved successfully!
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-500 text-red-300 rounded">
            Error loading preferences: {error.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Categories</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {TOPIC_OPTIONS.map(category => (
                <label 
                  key={category} 
                  className={`flex items-center p-3 border rounded cursor-pointer ${
                    selectedCategories.includes(category as NewsCategory) 
                      ? 'bg-blue-900/50 border-blue-500' 
                      : 'bg-navy-800 border-navy-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={selectedCategories.includes(category as NewsCategory)}
                    onChange={() => handleCategoryToggle(category as NewsCategory)}
                  />
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">News Sources</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {SOURCE_OPTIONS.map(source => (
                <label 
                  key={source} 
                  className={`flex items-center p-3 border rounded cursor-pointer ${
                    selectedSources.includes(source) 
                      ? 'bg-blue-900/50 border-blue-500' 
                      : 'bg-navy-800 border-navy-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={selectedSources.includes(source)}
                    onChange={() => handleSourceToggle(source)}
                  />
                  {source}
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Keywords</h3>
            <p className="text-gray-400 mb-2">Enter keywords separated by commas</p>
            <textarea
              className="w-full p-3 bg-navy-800 border border-navy-700 rounded text-gray-100"
              rows={3}
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="e.g., climate change, artificial intelligence, space exploration"
            ></textarea>
          </div>

          <div>
            <button
              type="submit"
              disabled={updating}
              className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-800 disabled:text-gray-300"
            >
              {updating ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default UserPreferences;