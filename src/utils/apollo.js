import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import nhost from './nhost';

const httpLink = createHttpLink({
  uri: `https://${import.meta.env.VITE_NHOST_SUBDOMAIN}.hasura.app/v1/graphql`,
});

const authLink = setContext((_, { headers }) => {
  const token = nhost.auth.getAccessToken();
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});