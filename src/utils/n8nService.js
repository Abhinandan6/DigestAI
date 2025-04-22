// Use local n8n instance
const N8N_API_URL = import.meta.env.VITE_N8N_API_URL || 'http://localhost:5678';
const WORKFLOW_ID = 'oHJiPJxiJRgnJcIb'; // Your workflow ID

/**
 * Generic function to make requests to n8n workflow execution
 */
async function executeWorkflow(payload) {
  try {
    console.log(`🔹 Executing workflow: ${WORKFLOW_ID}`);
    console.log(`🔹 Payload:`, payload);

    // Add a timestamp to help with debugging
    const requestPayload = {
      ...payload,
      timestamp: new Date().toISOString(),
      // For the current workflow structure, we need to simulate user preferences
      simulatedPreferences: {
        topic: payload.preferences?.topic || 'technology',
        keywords: payload.preferences?.keywords || [],
        preferred_sources: payload.preferences?.preferred_sources || [],
        searchQuery: payload.preferences?.searchQuery || ''
      }
    };

    // For development, use direct fetch to avoid CORS issues
    const isDevelopment = window.location.hostname === 'localhost';
    
    let response;
    try {
      // In development, use the proxy configured in vite.config.js
      response = await fetch('/.netlify/functions/n8n-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workflowId: WORKFLOW_ID,
          data: requestPayload
        })
      });

      if (!response.ok) {
        throw new Error(`N8N request failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('🔹 N8N response:', data);
      return {
        success: true,
        data
      };
    } catch (error) {
      console.warn('API call failed, using mock data:', error.message);
      // If the API fails, return mock data
      return {
        success: true,
        data: {
          articles: generateMockArticles(
            payload.preferences?.topic || 'general', 
            payload.preferences?.searchQuery
          )
        }
      };
    }
  } catch (error) {
    console.error('❌ Error executing N8N workflow:', error);
    
    // Return mock data in case of error for better UX
    return {
      success: true,
      data: {
        articles: generateMockArticles(
          payload.preferences?.topic || 'general',
          payload.preferences?.searchQuery
        )
      }
    };
  }
}

// Update the getUserNews function to better handle preferences

/**
 * Get news for a specific user with preferences
 */
export async function getUserNews(userId, preferences) {
  if (!userId) {
    return {
      success: false,
      message: 'User ID is required'
    };
  }

  // Ensure preferences has the expected structure
  const normalizedPreferences = {
    topic: preferences?.topic || 'general',
    keywords: Array.isArray(preferences?.keywords) ? preferences.keywords : [],
    preferred_sources: Array.isArray(preferences?.preferred_sources) ? preferences.preferred_sources : []
  };

  console.log('Fetching news with preferences:', normalizedPreferences);

  return executeWorkflow({
    userId,
    preferences: normalizedPreferences,
    action: 'fetch'
  });
}

// Update the generateMockArticles function to better handle preferences
function generateMockArticles(topic = 'general', searchQuery = '', preferences = null) {
  // If we have preferences with keywords, prioritize those for more relevant mock data
  if (preferences?.keywords?.length > 0 && !searchQuery) {
    const keyword = preferences.keywords[0]; // Use the first keyword
    return generateSearchSpecificMockResults(keyword, topic);
  }
  
  const topics = {
    'technology': [
      {
        id: 'tech-1',
        title: 'Latest Advancements in AI Technology',
        summary: 'Researchers have made significant breakthroughs in AI development, with new models showing unprecedented language understanding capabilities.',
        sentiment: 'positive',
        source: 'Tech Insider',
        publishedAt: new Date().toISOString()
      },
      {
        id: 'tech-2',
        title: 'New Electric Vehicle Battery Technology Extends Range',
        summary: 'A startup has developed a new battery technology that could double the range of electric vehicles without increasing battery size.',
        sentiment: 'positive',
        source: 'EV Journal',
        publishedAt: new Date().toISOString()
      },
      {
        id: 'tech-3',
        title: 'Cybersecurity Concerns Rise as Remote Work Continues',
        summary: 'Security experts warn about increasing cyber threats targeting remote workers as companies extend work-from-home policies.',
        sentiment: 'negative',
        source: 'Tech Insider',
        publishedAt: new Date().toISOString()
      }
    ],
    'business': [
      {
        id: 'biz-1',
        title: 'Global Markets React to Economic Policy Changes',
        summary: 'Stock markets worldwide showed volatility as central banks announced new economic policies to combat inflation.',
        sentiment: 'neutral',
        source: 'Financial Times',
        publishedAt: new Date().toISOString()
      },
      {
        id: 'biz-2',
        title: 'Startup Funding Reaches Record Levels in Q2',
        summary: 'Venture capital investments have reached unprecedented levels this quarter, with tech startups receiving the majority of funding.',
        sentiment: 'positive',
        source: 'Business Insider',
        publishedAt: new Date().toISOString()
      }
    ],
    'general': [
      {
        id: 'gen-1',
        title: 'Global Climate Summit Concludes with New Agreements',
        summary: 'World leaders have reached new agreements on reducing carbon emissions following a week-long climate summit.',
        sentiment: 'positive',
        source: 'World News',
        publishedAt: new Date().toISOString()
      },
      {
        id: 'gen-2',
        title: 'New Study Reveals Benefits of Mediterranean Diet',
        summary: 'Researchers have found additional health benefits associated with following a Mediterranean diet, including improved cognitive function.',
        sentiment: 'positive',
        source: 'Health Journal',
        publishedAt: new Date().toISOString()
      }
    ]
  };
  
  // Generate some articles for categories that don't have predefined mock data
  const defaultArticles = [
    {
      id: `${topic}-1`,
      title: `Latest Developments in ${topic.charAt(0).toUpperCase() + topic.slice(1)}`,
      summary: `Recent advancements in the field of ${topic} have shown promising results according to experts.`,
      sentiment: 'positive',
      source: 'News Daily',
      publishedAt: new Date().toISOString()
    },
    {
      id: `${topic}-2`,
      title: `${topic.charAt(0).toUpperCase() + topic.slice(1)} Industry Faces New Challenges`,
      summary: `The ${topic} sector is adapting to new regulations and market conditions in an evolving landscape.`,
      sentiment: 'neutral',
      source: 'Industry Today',
      publishedAt: new Date().toISOString()
    }
  ];
  
  return topics[topic] || defaultArticles;
}

// REMOVE THE SECOND generateMockArticles FUNCTION (lines 338-425)
// Delete this entire duplicate function

/**
 * Refresh news for a specific user
 */
export async function refreshUserNews(userId) {
  if (!userId) {
    return {
      success: false,
      message: 'User ID is required'
    };
  }

  return executeWorkflow({
    userId,
    action: 'refresh'
  });
}

// DELETE THIS ENTIRE DUPLICATE FUNCTION BELOW
  // Helper function to generate mock articles for development
// function generateMockArticles(topic = 'general', searchQuery = '') {
//   const topics = {
//     'technology': [
//       {
//         id: 'tech-1',
//         title: 'Latest Advancements in AI Technology',
//         summary: 'Researchers have made significant breakthroughs in AI development, with new models showing unprecedented language understanding capabilities.',
//         sentiment: 'positive',
//         source: 'Tech Insider',
//         publishedAt: new Date().toISOString()
//       },
//       {
//         id: 'tech-2',
//         title: 'New Electric Vehicle Battery Technology Extends Range',
//         summary: 'A startup has developed a new battery technology that could double the range of electric vehicles without increasing battery size.',
//         sentiment: 'positive',
//         source: 'EV Journal',
//         publishedAt: new Date().toISOString()
//       },
//       {
//         id: 'tech-3',
//         title: 'Cybersecurity Concerns Rise as Remote Work Continues',
//         summary: 'Security experts warn about increasing cyber threats targeting remote workers as companies extend work-from-home policies.',
//         sentiment: 'negative',
//         source: 'Tech Insider',
//         publishedAt: new Date().toISOString()
//       }
//     ],
//     'business': [
//       {
//         id: 'biz-1',
//         title: 'Global Markets React to Economic Policy Changes',
//         summary: 'Stock markets worldwide showed volatility as central banks announced new economic policies to combat inflation.',
//         sentiment: 'neutral',
//         source: 'Financial Times',
//         publishedAt: new Date().toISOString()
//       },
//       {
//         id: 'biz-2',
//         title: 'Startup Funding Reaches Record Levels in Q2',
//         summary: 'Venture capital investments have reached unprecedented levels this quarter, with tech startups receiving the majority of funding.',
//         sentiment: 'positive',
//         source: 'Business Insider',
//         publishedAt: new Date().toISOString()
//       }
//     ],
//     'general': [
//       {
//         id: 'gen-1',
//         title: 'Global Climate Summit Concludes with New Agreements',
//         summary: 'World leaders have reached new agreements on reducing carbon emissions following a week-long climate summit.',
//         sentiment: 'positive',
//         source: 'World News',
//         publishedAt: new Date().toISOString()
//       },
//       {
//         id: 'gen-2',
//         title: 'New Study Reveals Benefits of Mediterranean Diet',
//         summary: 'Researchers have found additional health benefits associated with following a Mediterranean diet, including improved cognitive function.',
//         sentiment: 'positive',
//         source: 'Health Journal',
//         publishedAt: new Date().toISOString()
//       }
//     ]
//   };
//   
//   // Generate some articles for categories that don't have predefined mock data
//   const defaultArticles = [
//     {
//       id: `${topic}-1`,
//       title: `Latest Developments in ${topic.charAt(0).toUpperCase() + topic.slice(1)}`,
//       summary: `Recent advancements in the field of ${topic} have shown promising results according to experts.`,
//       sentiment: 'positive',
//       source: 'News Daily',
//       publishedAt: new Date().toISOString()
//     },
//     {
//       id: `${topic}-2`,
//       title: `${topic.charAt(0).toUpperCase() + topic.slice(1)} Industry Faces New Challenges`,
//       summary: `The ${topic} sector is adapting to new regulations and market conditions in an evolving landscape.`,
//       sentiment: 'neutral',
//       source: 'Industry Today',
//       publishedAt: new Date().toISOString()
//     }
//   ];
//   
//   return topics[topic] || defaultArticles;
// }

/**
 * Search for news with a specific query using external APIs
 */
export async function searchNews(userId, query, category = 'general') {
  if (!userId) {
    return {
      success: false,
      message: 'User ID is required'
    };
  }

  if (!query || query.trim() === '') {
    return {
      success: false,
      message: 'Search query is required'
    };
  }

  console.log(`Searching for: "${query}" in category: ${category}`);

  try {
    // Try to execute the workflow
    const result = await executeWorkflow({
      userId,
      preferences: {
        topic: category,
        searchQuery: query
      },
      action: 'search'
    });
    
    console.log('Raw search result from executeWorkflow:', result);
    
    // If we get here but don't have articles, generate mock search results
    if (!result.data?.articles || result.data.articles.length === 0) {
      console.log('No search results from API, generating mock results');
      const mockResults = generateSearchSpecificMockResults(query, category);
      console.log('Generated mock results:', mockResults);
      return {
        success: true,
        data: {
          articles: mockResults
        }
      };
    }
    
    return result;
  } catch (error) {
    console.error('Search error:', error);
    // Always return mock results on error for better UX
    const mockResults = generateSearchSpecificMockResults(query, category);
    console.log('Generated mock results after error:', mockResults);
    return {
      success: true,
      data: {
        articles: mockResults
      }
    };
  }
}

/**
 * Generate search-specific mock results based on the query
 */
function generateSearchSpecificMockResults(query, category = 'general') {
  console.log(`Generating search-specific mock results for: "${query}" in ${category}`);
  
  // Create search-specific mock articles based on the actual search query
  const searchTerm = query.toLowerCase();
  
  // Special handling for common search terms
  const specialResults = {
    'anime': [
      {
        id: `anime-1`,
        title: `New Anime Releases: Spring Season Highlights`,
        summary: `The spring anime season brings several highly anticipated shows including adaptations of popular manga series and original productions.`,
        sentiment: 'positive',
        source: 'Anime News Network',
        publishedAt: new Date().toISOString(),
        url: `https://news.google.com/search?q=new+anime+releases&hl=en-US`
      },
      {
        id: `anime-2`,
        title: `Studio Ghibli Announces New Film Project`,
        summary: `The legendary animation studio has revealed plans for a new feature film, exciting fans worldwide with their return to the big screen.`,
        sentiment: 'positive',
        source: 'Animation World',
        publishedAt: new Date().toISOString(),
        url: `https://news.google.com/search?q=studio+ghibli+new+film&hl=en-US`
      }
    ],
    'marvel': [
      {
        id: `marvel-1`,
        title: `Marvel Entertainment Announces New Projects`,
        summary: `Marvel Studios has revealed its upcoming slate of movies and TV shows, exciting fans worldwide with new superhero content.`,
        sentiment: 'positive',
        source: 'Entertainment Weekly',
        publishedAt: new Date().toISOString(),
        url: `https://news.google.com/search?q=marvel+new+projects&hl=en-US`
      },
      {
        id: `marvel-2`,
        title: `The Impact of Marvel on Modern Cinema`,
        summary: `Film critics analyze how Marvel's cinematic universe has transformed the landscape of blockbuster filmmaking and audience expectations.`,
        sentiment: 'positive',
        source: 'Film Analysis',
        publishedAt: new Date().toISOString(),
        url: `https://news.google.com/search?q=marvel+cinema+impact&hl=en-US`
      }
    ],
    'ipl': [
      {
        id: `ipl-1`,
        title: `IPL 2023: Latest Match Results and Standings`,
        summary: `Get the latest updates on Indian Premier League cricket matches, team standings, and player performances from the current season.`,
        sentiment: 'neutral',
        source: 'Cricket Today',
        publishedAt: new Date().toISOString(),
        url: `https://news.google.com/search?q=ipl+cricket+latest+results&hl=en-US`
      },
      {
        id: `ipl-2`,
        title: `Top Performers in This IPL Season`,
        summary: `Analysis of the standout batsmen, bowlers, and all-rounders who have made a significant impact in the current Indian Premier League season.`,
        sentiment: 'positive',
        source: 'Sports Analysis',
        publishedAt: new Date().toISOString(),
        url: `https://news.google.com/search?q=ipl+top+performers+cricket&hl=en-US`
      }
    ],
    'ai': [
      {
        id: `ai-1`,
        title: `Breakthrough in AI Language Models Announced`,
        summary: `Researchers have developed a new AI model that demonstrates unprecedented natural language understanding and generation capabilities.`,
        sentiment: 'positive',
        source: 'Tech Review',
        publishedAt: new Date().toISOString(),
        url: `https://news.google.com/search?q=ai+language+model+breakthrough&hl=en-US`
      },
      {
        id: `ai-2`,
        title: `AI Ethics Guidelines Released by International Coalition`,
        summary: `A global coalition of tech companies and research institutions has published comprehensive guidelines for ethical AI development and deployment.`,
        sentiment: 'neutral',
        source: 'AI Journal',
        publishedAt: new Date().toISOString(),
        url: `https://news.google.com/search?q=ai+ethics+guidelines&hl=en-US`
      }
    ],
    'tech': [
      {
        id: `tech-1`,
        title: `Latest Technology Trends in 2023`,
        summary: `Explore the cutting-edge technologies that are reshaping industries and consumer experiences this year.`,
        sentiment: 'positive',
        source: 'Tech Insider',
        publishedAt: new Date().toISOString(),
        url: `https://news.google.com/search?q=latest+technology+trends+2023&hl=en-US`
      },
      {
        id: `tech-2`,
        title: `AI Advancements Transforming Business Operations`,
        summary: `How artificial intelligence solutions are being implemented across various sectors to improve efficiency and decision-making.`,
        sentiment: 'positive',
        source: 'Business Tech',
        publishedAt: new Date().toISOString(),
        url: `https://news.google.com/search?q=ai+business+transformation&hl=en-US`
      }
    ]
  };
  
  // If we have special results for this search term, use them
  if (specialResults[searchTerm]) {
    return specialResults[searchTerm];
  }
  
  // Otherwise, generate generic but relevant results for the search term
  return [
    {
      id: `search-${searchTerm}-1`,
      title: `${query.charAt(0).toUpperCase() + query.slice(1)} - Latest News and Developments`,
      summary: `Recent news about ${query} shows significant developments that are capturing attention worldwide.`,
      sentiment: 'positive',
      source: 'Global News',
      publishedAt: new Date().toISOString(),
      url: `https://news.google.com/search?q=${encodeURIComponent(query)}&hl=en-US`
    },
    {
      id: `search-${searchTerm}-2`,
      title: `${query.charAt(0).toUpperCase() + query.slice(1)}: What You Need to Know`,
      summary: `A comprehensive overview of ${query} and why it's becoming increasingly important in today's world.`,
      sentiment: 'neutral',
      source: 'Industry Today',
      publishedAt: new Date().toISOString(),
      url: `https://news.google.com/search?q=${encodeURIComponent(query)}+overview&hl=en-US`
    }
  ];
}