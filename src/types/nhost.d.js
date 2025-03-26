import { NhostClient as BaseNhostClient } from '@nhost/nhost-js';

declare module '@nhost/react' {
  export 
  export 

  export 

  export 

  export 

  export 

  export 

  export 

  export ;
    storage;
    graphql;
    functions;
  }

  export 

  export function NhostProvider(props): JSX.Element;
  export function useSignInEmailPassword(): { signInEmailPassword: (params) => Promise };
  export function useSignOut(): { signOut: () => Promise };
  // Add the correct hooks
  export function useAuthenticated();
  export function useAuthLoading();
  export function useUserId();
  export function useUserEmail();
  export function useUserDisplayName();
  export function useUserMetadata(): Record | undefined;
}

declare module '@nhost/react-apollo' {
  import { NhostClient } from '@nhost/react';
  import { ApolloClientOptions } from '@apollo/client';
  
  export 

  export function NhostApolloProvider(props): JSX.Element;
}