import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import nhost from './nhost';

// Create the HTTP link to your Hasura GraphQL endpoint
const httpLink = createHttpLink({
  uri: 'https://pmdddjhfyuqnpddamxhh.hasura.ap-south-1.nhost.run/v1/graphql',
});

// Add authentication headers to each request
const authLink = setContext(async (_, { headers }) => {
  // Get the authentication token from the Nhost client
  const token = nhost.auth.getSession()?.accessToken || '';
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

// Create the Apollo Client with the configured links
const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default apolloClient;