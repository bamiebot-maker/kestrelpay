import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, AppContext } from './contexts/AppContext';
import Landing from './screens/Landing';
import Dashboard from './screens/Dashboard';
import CreateIntent from './screens/CreateIntent';
import ActiveIntents from './screens/ActiveIntents';
import History from './screens/History';
import Analytics from './screens/Analytics';
import Profile from './screens/Profile';
import BottomNav from './components/BottomNav';
import Header from './components/Header';
import './App.css';

// Main app component that uses the context
function AppContent() {
  const { state, connectWallet, disconnectWallet } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(true);

  // Check initial connection state
  useEffect(() => {
    const checkInitialConnection = async () => {
      // Check if we were previously connected
      const wasConnected = localStorage.getItem('kestrelpay-connected') === 'true';

      if (wasConnected) {
        // Auto-connect if previously connected
        await connectWallet();
      }

      setIsLoading(false);
    };

    checkInitialConnection();
  }, [connectWallet]);

  const handleConnect = async () => {
    const result = await connectWallet();
    if (result.success) {
      localStorage.setItem('kestrelpay-connected', 'true');
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    localStorage.removeItem('kestrelpay-connected');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-deep-water to-dark-abyss flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-aqua-emerald border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-aqua-emerald">Loading KestrelPay...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      {!state.isConnected ? (
        <Landing onConnect={handleConnect} />
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-deep-water to-dark-abyss text-white">
          {/* Animated background */}
          <div className="liquid-background"></div>

          <div className="relative z-10">
            <Header onDisconnect={handleDisconnect} />

            <main className="container mx-auto px-4 pb-24 pt-16 md:pb-20 md:pt-4 bottom-nav-safe">              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/create-intent" element={<CreateIntent />} />
                <Route path="/active-intents" element={<ActiveIntents />} />
                <Route path="/history" element={<History />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </main>

            <BottomNav />
          </div>
        </div>
      )}
    </Router>
  );
}

// Root app component that provides the context
function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
