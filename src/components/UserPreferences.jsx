import React, { useEffect, useState } from 'react';
import { useAuthenticationStatus } from '@nhost/react';
import newsService from '../utils/newsService';

const UserPreferences = () => {
  const { isAuthenticated, isLoading } = useAuthenticationStatus();
  const [preferences, setPreferences] = useState({
    topic: 'general',
    keywords: [],
    preferred_sources: []
  });
  const [newKeyword, setNewKeyword] = useState('');
  const [newSource, setNewSource] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingPrefs, setIsLoadingPrefs] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Available topics
  const topics = [
    'general', 'business', 'entertainment', 'health', 
    'science', 'sports', 'technology', 'politics'
  ];

  useEffect(() => {
    if (isAuthenticated) {
      loadUserPreferences();
    }
  }, [isAuthenticated]);

  const loadUserPreferences = async () => {
    try {
      setIsLoadingPrefs(true);
      const userPrefs = await newsService.getUserPreferences();
      setPreferences({
        topic: userPrefs.topic || 'general',
        keywords: userPrefs.keywords || [],
        preferred_sources: userPrefs.preferred_sources || []
      });
    } catch (error) {
      console.error('Error loading preferences:', error);
      setMessage({ type: 'error', text: 'Failed to load your preferences' });
    } finally {
      setIsLoadingPrefs(false);
    }
  };

  const handleTopicChange = (e) => {
    setPreferences({ ...preferences, topic: e.target.value });
  };

  const addKeyword = () => {
    if (newKeyword && !preferences.keywords.includes(newKeyword)) {
      setPreferences({
        ...preferences,
        keywords: [...preferences.keywords, newKeyword]
      });
      setNewKeyword('');
    }
  };

  const removeKeyword = (keyword) => {
    setPreferences({
      ...preferences,
      keywords: preferences.keywords.filter(k => k !== keyword)
    });
  };

  const addSource = () => {
    if (newSource && !preferences.preferred_sources.includes(newSource)) {
      setPreferences({
        ...preferences,
        preferred_sources: [...preferences.preferred_sources, newSource]
      });
      setNewSource('');
    }
  };

  const removeSource = (source) => {
    setPreferences({
      ...preferences,
      preferred_sources: preferences.preferred_sources.filter(s => s !== source)
    });
  };

  const savePreferences = async () => {
    try {
      setIsSaving(true);
      setMessage({ type: '', text: '' });
      
      await newsService.saveUserPreferences(preferences);
      
      setMessage({ 
        type: 'success', 
        text: 'Preferences saved successfully! Your news feed will now be updated.' 
      });
    } catch (error) {
      console.error('Error saving preferences:', error);
      setMessage({ 
        type: 'error', 
        text: 'Failed to save preferences. Please try again.' 
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || isLoadingPrefs) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-green"></div>
      </div>
    );
  }

  return (
    <div className="bg-navy-800 rounded-lg shadow-lg p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Customize Your News Feed</h1>
      
      {message.text && (
        <div className={`p-4 mb-6 rounded-md ${
          message.type === 'success' ? 'bg-green-900 text-green-100' : 'bg-red-900 text-red-100'
        }`}>
          {message.text}
        </div>
      )}
      
      <div className="space-y-6">
        {/* Topic Selection */}
        <div>
          <label className="block text-gray-300 mb-2 font-medium">Primary News Topic</label>
          <select
            value={preferences.topic}
            onChange={handleTopicChange}
            className="w-full bg-navy-700 border border-navy-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-neon-green"
          >
            {topics.map(topic => (
              <option key={topic} value={topic}>
                {topic.charAt(0).toUpperCase() + topic.slice(1)}
              </option>
            ))}
          </select>
          <p className="mt-1 text-sm text-gray-400">This will be the main focus of your news feed</p>
        </div>
        
        {/* Keywords */}
        <div>
          <label className="block text-gray-300 mb-2 font-medium">Keywords</label>
          <div className="flex">
            <input
              type="text"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              placeholder="Add a keyword"
              className="flex-grow bg-navy-700 border border-navy-600 rounded-l-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-neon-green"
              onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
            />
            <button
              onClick={addKeyword}
              className="bg-neon-green text-navy-900 font-medium py-2 px-4 rounded-r-md hover:bg-opacity-90 focus:outline-none"
            >
              Add
            </button>
          </div>
          <p className="mt-1 text-sm text-gray-400">Add specific keywords to refine your news</p>
          
          {preferences.keywords.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {preferences.keywords.map(keyword => (
                <span key={keyword} className="bg-navy-600 text-white px-3 py-1 rounded-full flex items-center">
                  {keyword}
                  <button
                    onClick={() => removeKeyword(keyword)}
                    className="ml-2 text-gray-400 hover:text-white focus:outline-none"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
        
        {/* Preferred Sources */}
        <div>
          <label className="block text-gray-300 mb-2 font-medium">Preferred News Sources</label>
          <div className="flex">
            <input
              type="text"
              value={newSource}
              onChange={(e) => setNewSource(e.target.value)}
              placeholder="Add a news source"
              className="flex-grow bg-navy-700 border border-navy-600 rounded-l-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-neon-green"
              onKeyPress={(e) => e.key === 'Enter' && addSource()}
            />
            <button
              onClick={addSource}
              className="bg-neon-green text-navy-900 font-medium py-2 px-4 rounded-r-md hover:bg-opacity-90 focus:outline-none"
            >
              Add
            </button>
          </div>
          <p className="mt-1 text-sm text-gray-400">Add your trusted news sources (e.g., BBC, CNN, Reuters)</p>
          
          {preferences.preferred_sources.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {preferences.preferred_sources.map(source => (
                <span key={source} className="bg-navy-600 text-white px-3 py-1 rounded-full flex items-center">
                  {source}
                  <button
                    onClick={() => removeSource(source)}
                    className="ml-2 text-gray-400 hover:text-white focus:outline-none"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
        
        {/* Save Button */}
        <div className="pt-4">
          <button
            onClick={savePreferences}
            disabled={isSaving}
            className="w-full bg-neon-green text-navy-900 font-medium py-3 px-4 rounded-md hover:bg-opacity-90 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserPreferences;