/**
 * Mock data service to provide fallback data when API calls fail
 */

// Generate mock news articles based on topic
function getMockArticles(topic = 'general', count = 5) {
  const baseArticles = {
    'technology': [
      {
        id: 'tech-1',
        title: 'Latest Advancements in AI Technology',
        summary: 'Researchers have made significant breakthroughs in AI development, with new models showing unprecedented language understanding capabilities.',
        sentiment: 'positive',
        source: 'Tech Insider',
        url: 'https://example.com/tech-news-1',
        published_at: new Date().toISOString()
      },
      {
        id: 'tech-2',
        title: 'New Quantum Computing Milestone Achieved',
        summary: 'Scientists have successfully demonstrated quantum supremacy in a new experiment that solves problems impossible for classical computers.',
        sentiment: 'positive',
        source: 'Science Daily',
        url: 'https://example.com/tech-news-2',
        published_at: new Date().toISOString()
      },
      {
        id: 'tech-3',
        title: 'Cybersecurity Threats on the Rise in 2025',
        summary: 'Experts warn of increasing sophisticated cyber attacks targeting critical infrastructure and personal data.',
        sentiment: 'negative',
        source: 'Cyber Defense Magazine',
        url: 'https://example.com/tech-news-3',
        published_at: new Date().toISOString()
      }
    ],
    'business': [
      {
        id: 'biz-1',
        title: 'Global Markets Respond to Economic Policy Changes',
        summary: 'Stock markets worldwide showed positive trends following the announcement of new economic stimulus packages.',
        sentiment: 'positive',
        source: 'Financial Times',
        url: 'https://example.com/business-1',
        published_at: new Date().toISOString()
      },
      {
        id: 'biz-2',
        title: 'Startup Funding Reaches Record Highs in Q2',
        summary: 'Venture capital investments have surged to unprecedented levels, with tech startups being the primary beneficiaries.',
        sentiment: 'positive',
        source: 'Business Insider',
        url: 'https://example.com/business-2',
        published_at: new Date().toISOString()
      },
      {
        id: 'biz-3',
        title: 'Supply Chain Disruptions Continue to Impact Global Trade',
        summary: 'Companies are implementing new strategies to mitigate ongoing supply chain challenges affecting production and delivery timelines.',
        sentiment: 'neutral',
        source: 'Supply Chain Digest',
        url: 'https://example.com/business-3',
        published_at: new Date().toISOString()
      }
    ],
    'general': [
      {
        id: 'gen-1',
        title: 'Global Climate Initiative Launches With International Support',
        summary: 'A new climate action plan has gained the support of over 100 countries, aiming to reduce carbon emissions significantly by 2030.',
        sentiment: 'neutral',
        source: 'World News',
        url: 'https://example.com/general-1',
        published_at: new Date().toISOString()
      },
      {
        id: 'gen-2',
        title: 'Medical Researchers Announce Breakthrough in Vaccine Development',
        summary: 'A team of international scientists has developed a new approach to vaccine creation that could revolutionize disease prevention.',
        sentiment: 'positive',
        source: 'Health Journal',
        url: 'https://example.com/general-2',
        published_at: new Date().toISOString()
      },
      {
        id: 'gen-3',
        title: 'Cultural Festival Celebrates Diversity with Record Attendance',
        summary: 'The annual international cultural festival saw its highest attendance ever, showcasing traditions from over 50 countries.',
        sentiment: 'positive',
        source: 'Culture Today',
        url: 'https://example.com/general-3',
        published_at: new Date().toISOString()
      }
    ]
  };
  
  // Return articles for the requested topic, or general if topic not found
  const articles = baseArticles[topic] || baseArticles['general'];
  
  // Generate additional articles if needed
  while (articles.length < count) {
    const baseArticle = articles[articles.length % baseArticles[topic].length];
    articles.push({
      ...baseArticle,
      id: `${baseArticle.id}-copy-${articles.length}`,
      title: `${baseArticle.title} (Extended Analysis)`,
      published_at: new Date(Date.now() - articles.length * 3600000).toISOString() // Offset by hours
    });
  }
  
  return articles.slice(0, count);
}

// Mock news service response
function getMockNewsResponse(userId, preferences = {}) {
  const topic = preferences?.topic || 'general';
  
  return {
    success: true,
    message: 'Mock data service response',
    articles: getMockArticles(topic, 5),
    user_id: userId,
    timestamp: new Date().toISOString()
  };
}

export { getMockArticles, getMockNewsResponse };