import { gql } from '@apollo/client';
import apolloClient from './apollo';

// Function to fetch news using Hasura Action
export const fetchNewsWithAction = async (userId, preferences) => {
  const FETCH_NEWS_ACTION = gql`
    mutation FetchNews($userId: String!, $topic: String!, $keywords: [String!], $sources: [String!]) {
      fetchNews(userId: $userId, topic: $topic, keywords: $keywords, sources: $sources) {
        success
        articles {
          id
          title
          summary
          sentiment
          url
          source
          publishedAt
        }
      }
    }
  `;

  try {
    const { data } = await apolloClient.mutate({
      mutation: FETCH_NEWS_ACTION,
      variables: {
        userId,
        topic: preferences?.topic || 'general',
        keywords: preferences?.keywords || [],
        sources: preferences?.preferred_sources || []
      }
    });

    return data.fetchNews;
  } catch (error) {
    console.error('Error fetching news with Hasura Action:', error);
    throw error;
  }
};

// Function to refresh news using Hasura Action
export const refreshNewsWithAction = async () => {
  const REFRESH_NEWS_ACTION = gql`
    mutation RefreshNews {
      refreshNews {
        success
        message
      }
    }
  `;

  try {
    const { data } = await apolloClient.mutate({
      mutation: REFRESH_NEWS_ACTION
    });

    return data.refreshNews;
  } catch (error) {
    console.error('Error refreshing news with Hasura Action:', error);
    throw error;
  }
};