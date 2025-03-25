import { gql } from '@apollo/client';
import apolloClient from './apollo';
import nhost from './nhost';
import type { NewsItem, NewsCategory } from '../types';

// Function to get the current auth token
const getAuthToken = () => {
  try {
    return nhost.auth.getSession()?.accessToken || '';
  } catch (error) {
    console.error('Error getting auth token:', error);
    return '';
  }
};

// Function to get news using Hasura GraphQL
export const fetchNews = async (
  category: NewsCategory,
  searchQuery: string,
  page: number,
  limit: number = 12
): Promise<NewsItem[]> => {
  const GET_NEWS = gql`
    query GetArticles($topic: String!, $offset: Int!, $limit: Int!, $search: String) {
      articles(
        where: {
          topics: {_contains: [$topic]}, 
          _and: [
            { title: { _ilike: $search } }
          ]
        }, 
        order_by: {published_at: desc},
        offset: $offset,
        limit: $limit
      ) {
        id
        title
        content
        source
        published_at
        url
        topics
        processed_articles {
          summary
          sentiment
        }
      }
    }
  `;

  try {
    const { data } = await apolloClient.query({
      query: GET_NEWS,
      variables: {
        topic: category,
        offset: (page - 1) * limit,
        limit,
        search: searchQuery ? `%${searchQuery}%` : '%%'
      }
    });

    return data.articles.map((article: any) => ({
      id: article.id,
      title: article.title,
      description: article.processed_articles?.[0]?.summary || article.content.substring(0, 150) + '...',
      content: article.content,
      source: article.source,
      url: article.url,
      image: `https://source.unsplash.com/random/800x600?${article.topics[0] || 'news'}`,
      category: article.topics[0] || category,
      published_at: article.published_at,
      topics: article.topics,
      processed_articles: article.processed_articles
    }));
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
};

// Function to update user preferences
export const updateUserPreferences = async (
  userId: string,
  categories: string[],
  sources: string[],
  keywords: string[]
) => {
  const UPDATE_PREFERENCES = gql`
    mutation UpdateUserPreferences(
      $userId: uuid!, 
      $categories: jsonb, 
      $sources: jsonb, 
      $keywords: jsonb
    ) {
      updateUserPreferences(
        userId: $userId, 
        categories: $categories, 
        sources: $sources, 
        keywords: $keywords
      ) {
        success
        message
      }
    }
  `;

  try {
    const { data } = await apolloClient.mutate({
      mutation: UPDATE_PREFERENCES,
      variables: {
        userId,
        categories,
        sources,
        keywords
      },
      context: {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`
        }
      }
    });
    
    return data.updateUserPreferences;
  } catch (error) {
    console.error('Error updating preferences:', error);
    throw error;
  }
};