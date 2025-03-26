import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthenticationStatus } from '@nhost/react';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuthenticationStatus();

  if (isLoading) {
    return 
      
    ;
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    return ;
  }

  return {children};
};

export default ProtectedRoute;