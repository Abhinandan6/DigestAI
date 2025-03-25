declare module '@nhost/react' {
  export interface User {
    id: string;
    email?: string;
    displayName?: string;
    metadata?: Record<string, any>;
  }

  export function useAuthenticationStatus(): {
    isAuthenticated: boolean;
    isLoading: boolean;
  };

  export function useUserData(): User | null;

  export interface NhostClient {
    auth: {
      signOut(): Promise<void>;
    };
  }

  export interface NhostProviderProps {
    nhost: NhostClient;
    children: React.ReactNode;
  }

  export function NhostProvider(props: NhostProviderProps): JSX.Element;
}

declare module '@nhost/react-apollo' {
  import { NhostClient } from '@nhost/react';
  
  export interface NhostApolloProviderProps {
    nhost: NhostClient;
    children: React.ReactNode;
  }

  export function NhostApolloProvider(props: NhostApolloProviderProps): JSX.Element;
}