import { useState } from 'react';
import nhost from '../utils/nhost';
import { SignUpParams } from '@nhost/nhost-js';

export function useSignUpEmailPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);
  const [needsEmailVerification, setNeedsEmailVerification] = useState(false);
  const [user, setUser] = useState(null);

  const signUpEmailPassword = async (email, password, options?) => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    setNeedsEmailVerification(false);
    setUser(null);

    try {
      const signUpParams= {
        email,
        password,
        options
      };
      
      const response = await nhost.auth.signUp(signUpParams);
      
      // Check for error first
      if ('error' in response && response.error) {
        setIsError(true);
        setError(new Error(response.error.message || 'Registration failed'));
      } 
      // Then check for session
      else if ('session' in response && response.session) {
        setIsSuccess(true);
        if (response.session?.user) {
          setUser(response.session.user);
        }
      } else {
        // If no error and no session, it likely means email verification is required
        setNeedsEmailVerification(true);
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