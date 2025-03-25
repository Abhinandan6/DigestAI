import { useState } from 'react';
import nhost from '../utils/nhost';
import { SignInParams } from '@nhost/nhost-js';

export function useSignInEmailPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [needsEmailVerification, setNeedsEmailVerification] = useState(false);

  const signInEmailPassword = async (email: string, password: string) => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    setNeedsEmailVerification(false);

    try {
      const signInParams: SignInParams = {
        email,
        password
      };
      
      const { session, error } = await nhost.auth.signIn(signInParams);

      if (error) {
        setIsError(true);
        setError(new Error(error.message || 'Authentication failed'));        
        if (error.message?.includes('email verification')) {
          setNeedsEmailVerification(true);
        }
      } else if (session) {
        setIsSuccess(true);
      }
    } catch (err) {
      setIsError(true);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signInEmailPassword,
    isLoading,
    isSuccess,
    isError,
    error,
    needsEmailVerification
  };
}