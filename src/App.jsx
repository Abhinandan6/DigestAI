import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Newspaper, Settings, Home, Bug } from 'lucide-react';
import { NhostProvider } from '@nhost/react';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './utils/apollo';
import { SearchBar } from './components/SearchBar';
import { NewsCard } from './components/NewsCard';
import Login from './components/Login';
import Register from './components/Register'; // Add this import
import Dashboard from './components/Dashboard';
import UserPreferences from './components/UserPreferences';
import ProtectedRoute from './components/ProtectedRoute';
import Debug from './components/Debug';
import EmailVerification from './components/EmailVerification';
import nhost from './utils/nhost';

function App() {
  useEffect(() => {
    // Log styling information to console for verification
    console.log('Tailwind CSS loaded with custom colors:');
    console.log('- Neon Green: #39FF14');
    console.log('- Neon Orange: #FF5F1F');
    console.log('- Pista Green shades available');
    console.log('- Navy shades available');
  }, []);

  return (
    <NhostProvider nhost={nhost}>
      <ApolloProvider client={apolloClient}>
        <Router>
          <div className="min-h-screen bg-navy-900">
            <header className="bg-navy-800 shadow-md p-4">
              <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center">
                  <Newspaper className="text-neon-green mr-2" size={24} />
                  <h1 className="text-2xl font-bold logo-text">NewsFlow</h1>
                </div>
                
                {/* Add navigation menu */}
                <nav className="hidden md:flex space-x-4">
                  <Link to="/" className="nav-link flex items-center">
                    <Home size={18} className="mr-1" />
                    Dashboard
                  </Link>
                  <Link to="/preferences" className="nav-link flex items-center">
                    <Settings size={18} className="mr-1" />
                    Preferences
                  </Link>
                  <Link to="/debug" className="nav-link flex items-center">
                    <Bug size={18} className="mr-1" />
                    Debug
                  </Link>
                </nav>
              </div>
            </header>

            <main className="container mx-auto py-8 px-4">
              <Routes>
                <Route path="/" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify-email" element={<EmailVerification />} />
                <Route path="/preferences" element={
                  <ProtectedRoute>
                    <UserPreferences />
                  </ProtectedRoute>
                } />
                <Route path="/debug" element={<Debug />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </Router>
      </ApolloProvider>
    </NhostProvider>
  );
}

export default App;