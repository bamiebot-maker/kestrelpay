import React, { useState, useEffect } from 'react';
import { Zap, Shield, Clock, TrendingUp, Sparkles, CheckCircle, ArrowRight, ExternalLink } from 'lucide-react';

const Landing = ({ onConnect }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hasMetaMask, setHasMetaMask] = useState(false);

  useEffect(() => {
    // Check device type
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    
    // Check if MetaMask is installed
    setHasMetaMask(typeof window.ethereum !== 'undefined');
    
    // Check if already connected
    const checkExistingConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ 
            method: 'eth_accounts' 
          });
          if (accounts.length > 0) {
            // Auto-connect if already connected
            setTimeout(() => {
              if (onConnect) onConnect();
            }, 1000);
          }
        } catch (error) {
          console.error('Error checking existing connection:', error);
        }
      }
    };
    
    checkExistingConnection();
  }, [onConnect]);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      if (!hasMetaMask) {
        // If no MetaMask, redirect to install page
        if (isMobile) {
          window.open('https://metamask.app.link/dapp/' + window.location.hostname, '_blank');
        } else {
          window.open('https://metamask.io/download/', '_blank');
        }
        setIsConnecting(false);
        return;
      }

      // Real MetaMask connection
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length > 0 && onConnect) {
        await onConnect();
      }
    } catch (error) {
      console.error('Connection error:', error);
      
      // User rejected connection
      if (error.code === 4001) {
        alert('Connection rejected. Please connect your wallet to continue.');
      } else if (error.code === -32002) {
        alert('Connection already pending. Please check your MetaMask.');
      } else {
        alert(error.message || 'Failed to connect wallet. Please try again.');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const features = [
    {
      icon: <Zap className="w-10 h-10" />,
      title: "Lightning Fast Execution",
      description: "Transactions execute in milliseconds when optimal conditions are detected"
    },
    {
      icon: <Shield className="w-10 h-10" />,
      title: "Secure & Non-Custodial",
      description: "Your keys, your coins. We never hold your funds"
    },
    {
      icon: <Clock className="w-10 h-10" />,
      title: "Perfect Timing AI",
      description: "Swarm intelligence finds the absolute best execution moments"
    },
    {
      icon: <TrendingUp className="w-10 h-10" />,
      title: "Maximum Gas Savings",
      description: "Save 40-60% on gas fees with intelligent execution timing"
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Set Your Intent",
      description: "Define payment conditions and execution triggers"
    },
    {
      number: "02",
      title: "Swarm Analysis",
      description: "25 AI bots evaluate network conditions in real-time"
    },
    {
      number: "03",
      title: "Auto-Execution",
      description: "Smart contract executes when conditions are optimal"
    },
    {
      number: "04",
      title: "Track & Optimize",
      description: "Monitor performance and continuous improvement"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#001510] via-[#013B2B] to-[#005C45] text-white overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Water flow animation */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#001510] via-[#013B2B] to-[#005C45] opacity-90"></div>
        
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-[#00FFBF] to-[#03A66A] rounded-full opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-[#03A66A] to-[#00FFBF] rounded-full opacity-5 blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300FFBF' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#00FFBF] to-[#03A66A] rounded-xl flex items-center justify-center shadow-lg">
                <Zap className="w-6 h-6 text-[#001510]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#00FFBF] to-[#03A66A] bg-clip-text text-transparent">
                  KestrelPay
                </h1>
                <p className="text-xs text-gray-300">Swift. Precise. Visionary.</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {!hasMetaMask && (
                <a 
                  href={isMobile ? "https://metamask.app.link/dapp/" + window.location.hostname : "https://metamask.io/download/"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-4 py-2 bg-[#001510] border border-[#00FFBF] border-opacity-30 rounded-lg hover:border-opacity-50 transition"
                >
                  <span>Install MetaMask</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-12 md:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 mb-6 px-4 py-2 bg-[#00FFBF] bg-opacity-10 rounded-full border border-[#00FFBF] border-opacity-20">
              <Sparkles className="w-4 h-4 text-[#00FFBF]" />
              <span className="text-[#00FFBF] text-sm font-semibold">ALPHA LAUNCH • GAS SAVINGS UP TO 60%</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="block">Payment Execution</span>
              <span className="bg-gradient-to-r from-[#00FFBF] via-[#03A66A] to-[#00FFBF] bg-clip-text text-transparent">
                Reimagined
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Like the kestrel falcon — the fastest bird of prey. Our swarm intelligence
              identifies optimal transaction moments and executes with unmatched precision.
            </p>
            
            {/* Connect Button */}
            <div className="mb-12">
              <button
                onClick={handleConnect}
                disabled={isConnecting}
                className="group relative px-10 py-5 text-xl font-semibold rounded-full overflow-hidden"
              >
                {/* Glowing background */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#00FFBF] to-[#03A66A] animate-pulse"></div>
                
                {/* Button background */}
                <div className="absolute inset-[2px] bg-[#001510] rounded-full group-hover:bg-opacity-90 transition"></div>
                
                {/* Content */}
                <span className="relative flex items-center justify-center space-x-3">
                  {isConnecting ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Connecting Wallet...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-6 h-6" />
                      <span>Connect Wallet & Start Saving</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </button>
              
              {!hasMetaMask && (
                <p className="mt-4 text-gray-400 text-sm">
                  Need MetaMask?{" "}
                  <a 
                    href={isMobile ? "https://metamask.app.link/dapp/" + window.location.hostname : "https://metamask.io/download/"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#00FFBF] hover:underline"
                  >
                    Install it here
                  </a>
                </p>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="glass-card p-4 text-center">
                <div className="text-3xl font-bold text-[#00FFBF]">60%</div>
                <div className="text-gray-300 text-sm">Avg Gas Savings</div>
              </div>
              <div className="glass-card p-4 text-center">
                <div className="text-3xl font-bold text-[#00FFBF]">25</div>
                <div className="text-gray-300 text-sm">AI Swarm Bots</div>
              </div>
              <div className="glass-card p-4 text-center">
                <div className="text-3xl font-bold text-[#00FFBF]">99.9%</div>
                <div className="text-gray-300 text-sm">Execution Accuracy</div>
              </div>
              <div className="glass-card p-4 text-center">
                <div className="text-3xl font-bold text-[#00FFBF]">24/7</div>
                <div className="text-gray-300 text-sm">Network Monitoring</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why KestrelPay Stands Out</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Combining cutting-edge AI with blockchain technology for optimal execution
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="glass-card p-6 hover:transform hover:scale-105 transition-all duration-300 group"
              >
                <div className="text-[#00FFBF] mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="container mx-auto px-4 py-12">
          <div className="glass-card p-8 md:p-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple 4-Step Process</h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                From intent to execution in minutes
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#00FFBF] to-[#03A66A] rounded-full text-[#001510] text-2xl font-bold mb-4">
                      {step.number}
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                    <p className="text-gray-300">{step.description}</p>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 right-0 transform translate-x-1/2">
                      <ArrowRight className="w-6 h-6 text-[#00FFBF] opacity-50" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="glass-card p-8 md:p-12 max-w-3xl mx-auto relative overflow-hidden">
              {/* Background glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#00FFBF] to-[#03A66A] rounded-lg blur opacity-20"></div>
              
              <div className="relative">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Ready to Experience Intelligent Payments?
                </h2>
                <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                  Connect your wallet now and start saving on gas fees immediately. 
                  No signup required. Non-custodial. Free to start.
                </p>
                
                <button
                  onClick={handleConnect}
                  disabled={isConnecting}
                  className="group relative px-10 py-4 text-lg font-semibold rounded-full"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#00FFBF] to-[#03A66A] rounded-full"></div>
                  <div className="absolute inset-[2px] bg-[#001510] rounded-full group-hover:bg-opacity-90 transition"></div>
                  <span className="relative flex items-center justify-center space-x-2">
                    {isConnecting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Connecting...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5" />
                        <span>Connect Wallet & Get Started</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                </button>
                
                <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-400">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-[#00FFBF] mr-2" />
                    No sign up required
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-[#00FFBF] mr-2" />
                    Non-custodial (your keys)
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-[#00FFBF] mr-2" />
                    Free to start
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-[#00FFBF] border-opacity-10 mt-12">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-3 mb-4 md:mb-0">
                <div className="w-10 h-10 bg-gradient-to-br from-[#00FFBF] to-[#03A66A] rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-[#001510]" />
                </div>
                <div>
                  <h3 className="font-bold">KestrelPay</h3>
                  <p className="text-xs text-gray-400">© 2025 All rights reserved</p>
                </div>
              </div>
              
              <div className="flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-[#00FFBF] transition">Twitter</a>
                <a href="#" className="text-gray-400 hover:text-[#00FFBF] transition">Docs</a>
                <a href="#" className="text-gray-400 hover:text-[#00FFBF] transition">GitHub</a>
                <a href="#" className="text-gray-400 hover:text-[#00FFBF] transition">Contact</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Landing;