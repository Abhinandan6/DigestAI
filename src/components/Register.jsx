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
      displayName,
      metadata: {
        name
      }
    });
  };

  if (isSuccess) {
    return ;
  }

  return (
    
      
        
          
            
          
          Create your account
          
            Join NewsFlow for personalized news
          
        
        
        {needsEmailVerification && (
          
            Success! Please check your email to verify your account.
          
        )}
        
        {isError && (
          
            {error?.message || 'An error occurred during registration'}
          
        )}
        
        
          
            
              
                Full Name
              
               setName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-navy-900 border border-navy-700 rounded-md 
                         focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            
            
              
                Email address
              
               setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-navy-900 border border-navy-700 rounded-md 
                         focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            
            
              
                Password
              
               setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-navy-900 border border-navy-700 rounded-md 
                         focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              
                Password must be at least 8 characters long
              
            
          

          
            
              {isLoading ? 'Creating account...' : 'Create account'}
            
          
        
        
        
          
            Already have an account?{' '}
            
              Sign in
            
          
        
      
    
  );
};

export default Register;