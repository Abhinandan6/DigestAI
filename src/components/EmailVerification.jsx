import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, XCircle, Mail } from 'lucide-react';
import nhost from '../utils/nhost';

const EmailVerification = () => {
  const [verificationStatus, setVerificationStatus] = useState('verifying');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Get the query parameters from the URL
        const queryParams = new URLSearchParams(location.search);
        const ticket = queryParams.get('ticket');
        
        if (!ticket) {
          console.error('No verification ticket found in URL');
          setVerificationStatus('error');
          return;
        }

        console.log('Verifying email with ticket:', ticket);
        
        // Verify the email using Nhost
        const { error } = await nhost.auth.verifyEmail({ ticket });
        
        if (error) {
          console.error('Email verification error:', error);
          setVerificationStatus('error');
        } else {
          console.log('Email verification successful');
          setVerificationStatus('success');
          // Redirect to login page after 3 seconds
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        }
      } catch (err) {
        console.error('Verification error:', err);
        setVerificationStatus('error');
      }
    };

    verifyEmail();
  }, [location, navigate]);

  return (
    <div className="min-h-screen bg-navy-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md bg-navy-800 p-8 rounded-lg shadow-lg">
        <div className="flex justify-center">
          {verificationStatus === 'verifying' && (
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-green"></div>
          )}
          {verificationStatus === 'success' && (
            <CheckCircle className="w-16 h-16 text-neon-green" />
          )}
          {verificationStatus === 'error' && (
            <XCircle className="w-16 h-16 text-red-500" />
          )}
        </div>
        
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          {verificationStatus === 'verifying' && 'Verifying your email...'}
          {verificationStatus === 'success' && 'Email verified successfully!'}
          {verificationStatus === 'error' && 'Verification failed'}
        </h2>
        
        <p className="mt-2 text-center text-sm text-gray-400">
          {verificationStatus === 'success' && 'Redirecting you to the login page...'}
          {verificationStatus === 'error' && 'There was a problem verifying your email. The verification link may have expired or been used already.'}
        </p>
        
        <div className="mt-6 text-center">
          {verificationStatus === 'error' && (
            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Return to login
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;