import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useSignInEmailPassword } from '../hooks/useSignIn'; // Use our custom hook
import { Newspaper } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { signInEmailPassword, isLoading, isSuccess, needsEmailVerification, isError, error } = 
    useSignInEmailPassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signInEmailPassword(email, password);
  };

  if (isSuccess) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-900 text-gray-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-navy-800 rounded-lg shadow-md">
        <div className="text-center">
          <div className="flex justify-center">
            <Newspaper className="w-12 h-12 text-blue-500" />
          </div>
          <h2 className="mt-4 text-3xl font-bold">Sign in to NewsFlow</h2>
          <p className="mt-2 text-gray-400">
            Access your personalized news feed
          </p>
        </div>
        
        {needsEmailVerification && (
          <div className="bg-yellow-900/50 border border-yellow-500 text-yellow-300 px-4 py-3 rounded">
            Please verify your email before signing in. Check your inbox for a verification link.
          </div>
        )}
        
        {isError && (
          <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded">
            {error?.message || 'An error occurred during sign in'}
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-navy-900 border border-navy-700 rounded-md 
                         focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-navy-900 border border-navy-700 rounded-md 
                         focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
                       shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                       disabled:bg-blue-800 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-blue-400 hover:text-blue-300">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;