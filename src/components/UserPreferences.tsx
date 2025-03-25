import React, { useState, useEffect } from 'react';
import { useUserData } from '@nhost/react';
import { useMutation, useQuery, gql } from '@apollo/client';
import { Link } from 'react-router-dom';
import { Newspaper, ArrowLeft } from 'lucide-react';
// Add the import at the top of the file
import { triggerNewsUpdate } from '../utils/n8nService';

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

const TOPIC_OPTIONS = [
  'Business', 'Technology', 'Entertainment', 'Sports', 
  'Science', 'Health', 'Politics', 'World', 'General'
];

const SOURCE_OPTIONS = [
  'BBC News', 'CNN', 'The New York Times', 'Reuters', 
  'Associated Press', 'The Guardian', 'The Washington Post'
];

// In the UserPreferences component, add the missing state and handler
const UserPreferences = () => {
  const user = useUserData();
  const [selectedTopic, setSelectedTopic] = useState('General');
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [keywords, setKeywords] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [preferenceId, setPreferenceId] = useState<string | null>(null);

  // Add this line to track selected categories
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Query to get existing preferences
  const { loading, error, data } = useQuery(GET_USER_PREFERENCES, {
    variables: { userId: user?.id },
    skip: !user?.id,
  });

  // Mutation to update preferences
  const [updatePreferences, { loading: updating }] = useMutation(UPDATE_USER_PREFERENCES);

  // Set initial values from database
  useEffect(() => {
    if (data?.user_preferences?.length > 0) {
      const prefs = data.user_preferences[0];
      setPreferenceId(prefs.id);
      setSelectedTopic(prefs.topic || 'General');
      setSelectedSources(prefs.preferred_sources || []);
      setKeywords(prefs.keywords?.join(', ') || '');
    }
  }, [data]);

  // Add this handler for category toggling
  const handleCategoryToggle = (category: string) => {
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

  // Then update the handleSubmit function
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!preferenceId) {
      console.error("No preference ID found");
      return;
    }
    
    try {
      const keywordsArray = keywords
        .split(',')
        .map(k => k.trim())
        .filter(k => k !== '');
      
      const updatedPreferences = {
        topic: selectedTopic,
        keywords: keywordsArray,
        preferred_sources: selectedSources
      };
      
      await updatePreferences({
        variables: {
          id: preferenceId,
          ...updatedPreferences
        }
      });
      
      // Trigger n8n workflow to fetch new articles based on updated preferences
      if (user) {
        await triggerNewsUpdate(user.id, updatedPreferences);
      }
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving preferences:', err);
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
                    selectedCategories.includes(category) 
                      ? 'bg-blue-900/50 border-blue-500' 
                      : 'bg-navy-800 border-navy-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryToggle(category)}
                  />
                  {category}
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