import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import nhost from './nhost';

const httpLink = createHttpLink({
  uri: `https://${nhost.subdomain}.hasura.${nhost.region}.nhost.run/v1/graphql`,
});

const authLink = setContext(async (_, { headers }) => {
  // Get the authentication token from the Nhost client
  const token = nhost.auth.getAccessToken();
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

export default apolloClient;