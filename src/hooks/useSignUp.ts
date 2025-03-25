import { useState } from 'react';
import nhost from '../utils/nhost';

export function useSignUpEmailPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [needsEmailVerification, setNeedsEmailVerification] = useState(false);
  const [user, setUser] = useState<any>(null);

  const signUpEmailPassword = async (
    email: string, 
    password: string, 
    options?: { displayName?: string; metadata?: Record<string, any> }
  ) => {
    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      // The signUp response doesn't directly include a user property
      const { session, error } = await nhost.auth.signUp({
        email,
        password,
        options: {
          displayName: options?.displayName,
          metadata: options?.metadata
        }
      });

      if (error) {
        setIsError(true);
        setError(new Error(error.message || 'Registration failed'));
      } else {
        setIsSuccess(true);
        // Get user from session if available
        if (session) {
          setUser(session.user);
        }
        
        if (!session) {
          setNeedsEmailVerification(true);
        }
      }
    } catch (err) {
      setIsError(true);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signUpEmailPassword,
    isLoading,
    isSuccess,
    isError,
    error,
    needsEmailVerification,
    user
  };
}