import React, { useState } from 'react';

const Landing = ({ onConnect }) => {
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async () => {
    setIsConnecting(true);
    
    try {
      // Simulate wallet connection
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Call the onConnect callback from parent
      if (onConnect) {
        await onConnect();
      }
      
      console.log('Wallet connected successfully!');
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      alert('Failed to connect wallet. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-deep-water to-dark-abyss text-white relative overflow-hidden">
      {/* Animated background */}
      <div className="liquid-background"></div>
      
      {/* Floating elements */}
      <div className="absolute top-1/4 left-1/4 w-20 h-20 bg-aqua-emerald rounded-full opacity-20 floating" style={{ animationDelay: '0s' }}></div>
      <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-neon-mint rounded-full opacity-30 floating" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-1/4 left-1/3 w-24 h-24 bg-aqua-emerald rounded-full opacity-15 floating" style={{ animationDelay: '2s' }}></div>
      
      <div className="relative z-10 container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen">
        {/* Logo and Title */}
        <div className="text-center mb-12">
          <div className="w-32 h-32 bg-gradient-to-r from-aqua-emerald to-neon-mint rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <span className="text-dark-abyss text-4xl font-bold">K</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-aqua-emerald to-neon-mint bg-clip-text text-transparent mb-4">
            KestrelPay
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto">
            Next-generation intent-based payments powered by <span className="text-neon-mint">Swarm Intelligence</span>
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 w-full max-w-4xl">
          <div className="glass-card p-6 text-center">
            <div className="text-3xl mb-3">??</div>
            <h3 className="text-lg font-semibold mb-2">Swarm Intelligence</h3>
            <p className="text-gray-300 text-sm">
              25 micro-bots analyze network conditions for optimal execution timing
            </p>
          </div>
          
          <div className="glass-card p-6 text-center">
            <div className="text-3xl mb-3">?</div>
            <h3 className="text-lg font-semibold mb-2">Gas Optimization</h3>
            <p className="text-gray-300 text-sm">
              Execute transactions when gas prices are lowest with AI-powered predictions
            </p>
          </div>
          
          <div className="glass-card p-6 text-center">
            <div className="text-3xl mb-3">??</div>
            <h3 className="text-lg font-semibold mb-2">LiquidFlow UI</h3>
            <p className="text-gray-300 text-sm">
              Beautiful deep water green interface with real-time visual feedback
            </p>
          </div>
        </div>

        {/* Connect Wallet Button */}
        <div className="text-center">
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className="btn-liquid text-lg px-12 py-4 text-xl font-semibold ripple relative overflow-hidden"
          >
            {isConnecting ? (
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-dark-abyss border-t-transparent rounded-full animate-spin"></div>
                <span>Connecting...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span>??</span>
                <span>Connect MetaMask</span>
              </div>
            )}
          </button>
          
          <p className="text-gray-400 mt-4 text-sm">
            Connect your wallet to start using KestrelPay
          </p>
        </div>

        {/* Wave 2 Badge */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="px-4 py-2 bg-gradient-to-r from-aqua-emerald to-neon-mint rounded-full">
            <span className="text-dark-abyss text-sm font-bold">WAVE 2 MVP</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
