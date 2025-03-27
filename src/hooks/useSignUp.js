import { useState } from 'react';
import nhost from '../utils/nhost';

export function useSignUpEmailPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);
  const [needsEmailVerification, setNeedsEmailVerification] = useState(false);
  const [user, setUser] = useState(null);

  const signUpEmailPassword = async (email, password, options = {}) => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    
    try {
      console.log('Attempting nhost signup...'); // Debug log
      const { session, error: signUpError } = await nhost.auth.signUp({
        email,
        password,
        options: {
          displayName: options.displayName,
          metadata: options.metadata
        }
      });

      console.log('Signup response:', { session, error: signUpError }); // Debug log

      if (signUpError) {
        setIsError(true);
        setError(new Error(signUpError.message));
        setNeedsEmailVerification(signUpError.message.includes('email verification'));
        console.error('Signup error:', signUpError); // Debug log
      } else {
        setIsSuccess(true);
        if (session) {
          setUser(session.user);
          console.log('Signup successful, user:', session.user); // Debug log
        }
      }
    } catch (err) {
      console.error('Unexpected error during signup:', err); // Debug log
      setIsError(true);
      setError(err instanceof Error ? err : new Error('Registration failed'));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signUpEmailPassword,
    isLoading,
    isSuccess,
    needsEmailVerification,
    isError,
    error,
    user
  };
}