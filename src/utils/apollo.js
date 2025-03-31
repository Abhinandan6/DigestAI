import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import nhost from './nhost';

// Log the GraphQL URL to verify it's being loaded correctly
console.log('Hasura GraphQL URL:', import.meta.env.VITE_HASURA_GRAPHQL_URL);

// Create an HTTP link that points to your Hasura GraphQL endpoint
const httpLink = createHttpLink({
  uri: import.meta.env.VITE_HASURA_GRAPHQL_URL || 'https://pmdddjhfyuqnpddamxhh.hasura.ap-south-1.nhost.run/v1/graphql',
});

// Add authentication to your requests
const authLink = setContext((_, { headers }) => {
  // Get the authentication token from Nhost
  const token = nhost.auth.getAccessToken();
  
  // Return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

// Create the Apollo Client instance
const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

export default apolloClient;