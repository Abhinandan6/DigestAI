import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Newspaper } from 'lucide-react';
import { SearchBar } from './components/SearchBar';
import { NewsCard } from './components/NewsCard';
import { NhostProvider, useAuthenticated, useAuthenticationStatus, useUserId } from '@nhost/react';
import { NhostApolloProvider } from '@nhost/react-apollo';
import nhost from './utils/nhost';
import { gql, useQuery } from '@apollo/client';
import Login from './components/Login';
import Register from './components/Register';
import UserPreferences from './components/UserPreferences';
import Debug from './components/Debug';
import Dashboard from './components/Dashboard';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthenticated();
  const { isLoading } = useAuthenticationStatus();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32 mt-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  if (!nhost) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500">
          Initializing application...
        </div>
      </div>
    );
  }

  return (
    <NhostProvider nhost={nhost}>
      <NhostApolloProvider nhost={nhost}>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/debug" element={<Debug />} />
            <Route 
              path="/preferences" 
              element={
                <ProtectedRoute>
                  <UserPreferences />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </NhostApolloProvider>
    </NhostProvider>
  );
}

export default App;