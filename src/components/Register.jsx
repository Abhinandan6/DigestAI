import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
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
    await signUpEmailPassword(email, password, {
      displayName: name,
      metadata: {
        name
      }
    });
  };

  // Show verification message if needed
  if (isSuccess && needsEmailVerification) {
    return (
      <div className="min-h-screen bg-navy-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <Mail className="w-16 h-16 text-neon-green" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-100">
            Verify your email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            We've sent a verification email to <span className="text-neon-orange">{email}</span>
          </p>
          <p className="mt-2 text-center text-sm text-gray-400">
            Please check your inbox and click the verification link to complete your registration.
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

  // Redirect to login if registration is successful and no verification needed
  if (isSuccess && !needsEmailVerification) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-navy-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Newspaper className="w-12 h-12 text-blue-500" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-100">
          Create your account
        </h2>
      </div>

      {/* Rest of your registration form */}
      {/* ... */}
    </div>
  );
};

export default Register;