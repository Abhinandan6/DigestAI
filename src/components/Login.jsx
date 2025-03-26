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
    return ;
  }

  return (
    
      
        
          
            
          
          Sign in to NewsFlow
          
            Access your personalized news feed
          
        
        
        {needsEmailVerification && (
          
            Please verify your email before signing in. Check your inbox for a verification link.
          
        )}
        
        {isError && (
          
            {error?.message || 'An error occurred during sign in'}
          
        )}
        
        
          
            
              
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
            
          

          
            
              {isLoading ? 'Signing in...' : 'Sign in'}
            
          
        
        
        
          
            Don't have an account?{' '}
            
              Sign up
            
          
        
      
    
  );
};

export default Login;