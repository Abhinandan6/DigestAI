import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useSignUpEmailPassword } from '../hooks/useSignUp'; // Updated import
import { Newspaper } from 'lucide-react';
import { gql, useMutation } from '@apollo/client';

// GraphQL mutation to create user preferences
const CREATE_USER_PREFERENCES = gql`
  mutation CreateUserPreferences($userId: uuid!, $topic: String!) {
    insert_user_preferences_one(object: {
      user_id: $userId,
      topic: $topic,
      keywords: [],
      preferred_sources: []
    }) {
      id
    }
  }
`;

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  const { signUpEmailPassword, isLoading, isSuccess, needsEmailVerification, isError, error, user } = 
    useSignUpEmailPassword();
    
  const [createPreferences] = useMutation(CREATE_USER_PREFERENCES);

  // When registration is successful and we have a user, create default preferences
  useEffect(() => {
    if (isSuccess && user) {
      createPreferences({
        variables: {
          userId: user.id,
          topic: 'general' // Default topic
        }
      }).catch(err => {
        console.error("Failed to create user preferences:", err);
      });
    }
  }, [isSuccess, user, createPreferences]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signUpEmailPassword(email, password, {
      displayName: name,
      metadata: {
        name
      }
    });
  };

  if (isSuccess) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-900 text-gray-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-navy-800 rounded-lg shadow-md">
        <div className="text-center">
          <div className="flex justify-center">
            <Newspaper className="w-12 h-12 text-blue-500" />
          </div>
          <h2 className="mt-4 text-3xl font-bold">Create your account</h2>
          <p className="mt-2 text-gray-400">
            Join NewsFlow for personalized news
          </p>
        </div>
        
        {needsEmailVerification && (
          <div className="bg-green-900/50 border border-green-500 text-green-300 px-4 py-3 rounded">
            Success! Please check your email to verify your account.
          </div>
        )}
        
        {isError && (
          <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded">
            {error?.message || 'An error occurred during registration'}
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-navy-900 border border-navy-700 rounded-md 
                         focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
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
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-navy-900 border border-navy-700 rounded-md 
                         focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-xs text-gray-400">
                Password must be at least 8 characters long
              </p>
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
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
          </div>
        </form>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-blue-400 hover:text-blue-300">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;