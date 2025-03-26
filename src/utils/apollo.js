import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import nhost from './nhost';

const httpLink = createHttpLink({
  uri: 'https://pmdddjhfyuqnpddamxhh.hasura.ap-south-1.nhost.run/v1/graphql',
});

const authLink = setContext(async (_, { headers }) => {
  const token = nhost.auth.getSession()?.accessToken || '';
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

// Add error handling
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  if (networkError) console.error(`[Network error]: ${networkError}`);
});

const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          articles: {
            // Merge function for pagination
            merge(existing = [], incoming) {
              return [...existing, ...incoming];
            }
          }
        }
      }
    }
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});

export default apolloClient;