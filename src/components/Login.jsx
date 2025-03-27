import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Remove the @nhost/react import and keep only the local hook
import { useSignInEmailPassword } from '../hooks/useSignIn';
import { Newspaper } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signInEmailPassword, isLoading, isSuccess, needsEmailVerification, isError, error } = 
    useSignInEmailPassword();

  useEffect(() => {
    // Check if we're returning from email verification
    const params = new URLSearchParams(window.location.search);
    if (params.get('verified') === 'true') {
      // Show success message or handle verified state
      console.log('Email verified successfully');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signInEmailPassword(email, password);
    // Debug log for authentication status
    console.log('Auth Status:', {
      success: isSuccess,
      error: isError,
      needsVerification: needsEmailVerification
    });
  };

  if (isSuccess) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-navy-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Newspaper className="w-16 h-16 text-neon-green animate-pulse-neon" />
        </div>
        <h2 className="mt-6 text-center text-4xl font-extrabold logo-text">
          Sign in to NewsFlow
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-navy-800 py-8 px-4 shadow-lg border border-navy-700 sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-neon-green hover:text-navy-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neon-green disabled:bg-blue-400 transition-all duration-300"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          {needsEmailVerification && (
            <div className="mt-4 p-4 bg-yellow-900/50 border border-yellow-500 text-yellow-300 rounded">
              Please check your email for a verification link.
            </div>
          )}

          {isError && (
            <div className="mt-4 p-4 bg-red-900/50 border border-red-500 text-red-300 rounded">
              {error?.message}
            </div>
          )}

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-navy-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-navy-800 text-gray-400">
                  Don't have an account?
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => navigate('/register')}
                className="font-medium text-neon-orange hover:text-neon-green transition-colors"
              >
                Register now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;