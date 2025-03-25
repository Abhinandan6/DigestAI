import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NhostProvider } from '@nhost/react';
import { NhostApolloProvider } from '@nhost/react-apollo';
import nhost from './utils/nhost';

// Import your components
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import UserPreferences from './components/UserPreferences';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <NhostProvider nhost={nhost}>
      <NhostApolloProvider nhost={nhost}>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/preferences" 
              element={
                <ProtectedRoute>
                  <UserPreferences />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Router>
      </NhostApolloProvider>
    </NhostProvider>
  );
}

export default App;