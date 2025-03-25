import React, { useState, useEffect } from 'react';
import { useUserData } from '@nhost/react';
import { useMutation, useQuery, gql } from '@apollo/client';
import { Link } from 'react-router-dom';

// GraphQL query to get user preferences
const GET_USER_PREFERENCES = gql`
  query GetUserPreferences($userId: uuid!) {
    user_preferences(where: {user_id: {_eq: $userId}}) {
      id
      categories
      sources
      keywords
    }
  }
`;

// GraphQL mutation to update user preferences
const UPDATE_USER_PREFERENCES = gql`
  mutation UpdateUserPreferences(
    $userId: uuid!, 
    $categories: jsonb, 
    $sources: jsonb, 
    $keywords: jsonb
  ) {
    insert_user_preferences(
      objects: {
        user_id: $userId, 
        categories: $categories, 
        sources: $sources, 
        keywords: $keywords
      },
      on_conflict: {
        constraint: user_preferences_user_id_key,
        update_columns: [categories, sources, keywords]
      }
    ) {
      returning {
        id
      }
    }
  }
`;

const CATEGORY_OPTIONS = [
  'Business', 'Technology', 'Entertainment', 'Sports', 
  'Science', 'Health', 'Politics', 'World'
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
  const [updatePreferences, { loading: updating }] = useMutation(UPDATE_USER_PREFERENCES);

  // Set initial values from database
  useEffect(() => {
    if (data?.user_preferences?.length > 0) {
      const prefs = data.user_preferences[0];
      setSelectedCategories(prefs.categories || []);
      setSelectedSources(prefs.sources || []);
      setKeywords(prefs.keywords?.join(', ') || '');
    }
  }, [data]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const keywordsArray = keywords
        .split(',')
        .map(k => k.trim())
        .filter(k => k !== '');
      
      await updatePreferences({
        variables: {
          userId: user.id,
          categories: selectedCategories,
          sources: selectedSources,
          keywords: keywordsArray
        }
      });
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving preferences:', err);
    }
  };

  if (loading) return <div className="text-center p-8">Loading your preferences...</div>;
  if (error) return <div className="text-center p-8 text-red-500">Error loading preferences: {error.message}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your News Preferences</h1>
        <Link 
          to="/" 
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
          Back to Dashboard
        </Link>
      </header>

      {saveSuccess && (
        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded">
          Your preferences have been saved successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {CATEGORY_OPTIONS.map(category => (
              <label 
                key={category} 
                className={`flex items-center p-3 border rounded cursor-pointer ${
                  selectedCategories.includes(category) 
                    ? 'bg-blue-100 border-blue-500' 
                    : 'bg-white'
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
          <h2 className="text-xl font-semibold mb-4">News Sources</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {SOURCE_OPTIONS.map(source => (
              <label 
                key={source} 
                className={`flex items-center p-3 border rounded cursor-pointer ${
                  selectedSources.includes(source) 
                    ? 'bg-blue-100 border-blue-500' 
                    : 'bg-white'
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
          <h2 className="text-xl font-semibold mb-4">Keywords</h2>
          <p className="text-gray-600 mb-2">Enter keywords separated by commas</p>
          <textarea
            className="w-full p-3 border rounded"
            rows="3"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="e.g., climate change, artificial intelligence, space exploration"
          ></textarea>
        </div>

        <div>
          <button
            type="submit"
            disabled={updating}
            className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
          >
            {updating ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserPreferences;