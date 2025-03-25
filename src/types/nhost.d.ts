import { NhostClient as BaseNhostClient } from '@nhost/nhost-js';

declare module '@nhost/react' {
  export type NhostClient = BaseNhostClient;
  export interface User {
    id: string;
    email?: string;
    displayName?: string;
    metadata?: Record<string, any>;
    avatarUrl?: string;
    defaultRole?: string;
    roles?: string[];
    isAnonymous?: boolean;
  }

  export interface AuthErrorPayload {
    error: string;
    status: number;
    message: string;
  }

  export interface SignInParams {
    email: string;
    password: string;
  }

  export interface NhostSession {
    accessToken: string;
    refreshToken: string | null;
    user: User;
  }

  export interface SignInResponse {
    session: NhostSession | null;
    error: AuthErrorPayload | null;
    providerUrl?: string;
    provider?: string;
  }

  export interface AuthChangeEvent {
    event: string;
    session: NhostSession | null;
  }

  export type AuthChangedFunction = (event: AuthChangeEvent) => void;

  export interface NhostClient {
    auth: {
      signIn(params?: SignInParams): Promise<SignInResponse>;
      signUp(params: SignInParams): Promise<SignInResponse>;
      signOut(): Promise<void>;
      getSession(): NhostSession | null;
      isAuthenticated(): boolean;
      refreshSession(): Promise<SignInResponse>;
      onAuthStateChanged(fn: AuthChangedFunction): () => void;
      getAccessToken(): string | undefined;
    };
    storage: HasuraStorageClient;
    graphql: NhostGraphqlClient;
    functions: NhostFunctionsClient;
  }

  export interface NhostProviderProps {
    nhost: NhostClient;
    children: React.ReactNode;
    initial?: boolean;
  }

  export function NhostProvider(props: NhostProviderProps): JSX.Element;
  export function useSignInEmailPassword(): { signInEmailPassword: (params: SignInParams) => Promise<SignInResponse> };
  export function useSignOut(): { signOut: () => Promise<void> };
  // Add the correct hooks
  export function useAuthenticated(): boolean;
  export function useAuthLoading(): boolean;
  export function useUserId(): string | undefined;
  export function useUserEmail(): string | undefined;
  export function useUserDisplayName(): string | undefined;
  export function useUserMetadata(): Record<string, any> | undefined;
}

declare module '@nhost/react-apollo' {
  import { NhostClient } from '@nhost/react';
  import { ApolloClientOptions } from '@apollo/client';
  
  export interface NhostApolloProviderProps {
    nhost: NhostClient;
    children: React.ReactNode;
    apolloClientOptions?: Partial<ApolloClientOptions<any>>;
  }

  export function NhostApolloProvider(props: NhostApolloProviderProps): JSX.Element;
}