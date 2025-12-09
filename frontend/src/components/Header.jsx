import React, { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';

const Header = ({ onDisconnect }) => {
  const { state } = useContext(AppContext);

  const handleDisconnect = () => {
    if (window.confirm('Are you sure you want to disconnect your wallet?')) {
      if (onDisconnect) {
        onDisconnect();
      }
    }
  };

  // Format address for display
  const formatAddress = (address) => {
    if (!address) return 'Not Connected';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header className="glass-card border-b border-aqua-emerald border-opacity-20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-aqua-emerald to-neon-mint rounded-lg flex items-center justify-center">
              <span className="text-dark-abyss font-bold text-lg">K</span>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-aqua-emerald to-neon-mint bg-clip-text text-transparent">
                KestrelPay
              </h1>
              <p className="text-xs text-gray-400">Phase 2 MVP</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:block text-sm text-right">
              {state.isConnected ? (
                <>
                  <div className="text-aqua-emerald flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    Connected
                  </div>
                  <div className="text-gray-400 font-mono">
                    {formatAddress(state.user.address)}
                  </div>
                </>
              ) : (
                <div className="text-yellow-400">Not Connected</div>
              )}
            </div>
            
            {state.isConnected && (
              <div className="flex items-center space-x-2">
                <div className="text-xs bg-green-400 bg-opacity-20 text-green-400 px-2 py-1 rounded-full">
                  {state.user.balance}
                </div>
                <button
                  onClick={handleDisconnect}
                  className="w-10 h-10 bg-dark-abyss rounded-full border border-aqua-emerald border-opacity-30 flex items-center justify-center hover:border-opacity-50 transition-all"
                  title="Disconnect Wallet"
                >
                  <span className="text-aqua-emerald text-sm">👨</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
