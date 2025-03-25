import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { useUserData } from '@nhost/react';
import { Link } from 'react-router-dom';

// GraphQL query to fetch articles for the current user
const GET_USER_ARTICLES = gql`
  query GetUserArticles($userId: uuid!) {
    user_article_relationship(where: {user_id: {_eq: $userId}}) {
      article {
        id
        title
        summary
        url
        image_url
        published_at
        source
        category
      }
    }
  }
`;

const Dashboard = () => {
  const user = useUserData();
  const { loading, error, data } = useQuery(GET_USER_ARTICLES, {
    variables: { userId: user?.id },
    skip: !user?.id,
  });

  if (loading) return <div className="text-center p-8">Loading your personalized news...</div>;
  if (error) return <div className="text-center p-8 text-red-500">Error loading news: {error.message}</div>;

  const articles = data?.user_article_relationship.map(rel => rel.article) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Personalized News</h1>
        <div className="flex space-x-4">
          <Link 
            to="/preferences" 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Update Preferences
          </Link>
        </div>
      </header>

      {articles.length === 0 ? (
        <div className="text-center p-8 bg-gray-100 rounded-lg">
          <p className="text-lg">No articles found. Please update your preferences or check back later.</p>
          <Link 
            to="/preferences" 
            className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Set Your Preferences
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map(article => (
            <div key={article.id} className="border rounded-lg overflow-hidden shadow-lg">
              {article.image_url && (
                <img 
                  src={article.image_url} 
                  alt={article.title} 
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500">{article.source}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(article.published_at).toLocaleDateString()}
                  </span>
                </div>
                <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
                <p className="text-gray-700 mb-4">{article.summary}</p>
                <a 
                  href={article.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Read full article
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;