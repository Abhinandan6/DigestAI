import React, { useState, useEffect } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useSignUpEmailPassword } from '../hooks/useSignUp'; // Updated import
import { Newspaper, Mail } from 'lucide-react';
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
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { error, session } = await signUpEmailPassword(email, password, {
        displayName: name,
        metadata: { name },
        redirectTo: `${window.location.origin}/login?verified=true` // Add redirect URL for after verification
      });

      if (error) {
        console.error('Registration error:', error);
      } else {
        // Set verification sent state to true to show verification message
        setIsVerificationSent(true);
      }
    } catch (error) {
      console.error('Unexpected registration error:', error);
    }
  };

  // Show verification message if needed
  if (isVerificationSent || (isSuccess && needsEmailVerification)) {
    return (
      <div className="min-h-screen bg-navy-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <Mail className="w-16 h-16 text-neon-green animate-pulse" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-100">
            Verify your email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            We've sent a verification email to <span className="text-neon-orange">{email}</span>
          </p>
          <p className="mt-2 text-center text-sm text-gray-400">
            Please check your inbox and click the verification link.
          </p>
          <div className="mt-6 text-center">
            <Link to="/login" className="text-neon-green hover:text-neon-orange">
              Return to sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Remove automatic redirect to login
  // if (isSuccess && !needsEmailVerification) {
  //   return <Navigate to="/login" />;
  // }

  return (
    <div className="min-h-screen bg-navy-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Newspaper className="w-16 h-16 text-neon-green animate-pulse-neon" />
        </div>
        <h2 className="mt-6 text-center text-4xl font-extrabold logo-text">
          Create your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-navy-800 py-8 px-4 shadow-lg border border-navy-700 sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-neon-green focus:border-neon-green bg-navy-900 text-gray-100"
                />
              </div>
            </div>

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
                  className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-neon-green focus:border-neon-green bg-navy-900 text-gray-100"
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
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-neon-green focus:border-neon-green bg-navy-900 text-gray-100"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-neon-green hover:bg-neon-green/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neon-green disabled:opacity-50"
              >
                {isLoading ? 'Creating account...' : 'Verify Now'}
              </button>
            </div>

            {isError && (
              <div className="rounded-md bg-red-900/50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-400">
                      {error?.message || 'Registration failed'}
                    </h3>
                  </div>
                </div>
              </div>
            )}
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-navy-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-navy-800 text-gray-400">
                  Already have an account?{' '}
                  <Link to="/login" className="font-medium text-neon-green hover:text-neon-orange transition-colors">
                    Sign in
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;