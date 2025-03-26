import { useState } from 'react';
import nhost from '../utils/nhost';

export const useSignInEmailPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [needsEmailVerification, setNeedsEmailVerification] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);

  const signInEmailPassword = async (email, password) => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    setNeedsEmailVerification(false);

    try {
      const { session, error } = await nhost.auth.signIn({
        email,
        password
      });

      if (error) {
        setIsError(true);
        // Fix: Convert AuthErrorPayload to Error object with required 'name' property
        setError(new Error(error.message));
        
        if (error.message.includes('email verification')) {
          setNeedsEmailVerification(true);
        }
      } else if (session) {
        setIsSuccess(true);
      }
    } catch (err) {
      setIsError(true);
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signInEmailPassword,
    isLoading,
    isSuccess,
    needsEmailVerification,
    isError,
    error
  };
};