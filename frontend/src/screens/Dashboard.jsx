import React, { useContext, useEffect } from 'react';
import { AppContext } from '../contexts/AppContext';
import SwarmConfidenceIndicator from '../components/SwarmConfidenceIndicator';
import IntentCard from '../components/IntentCard';

const Dashboard = () => {
  const { state } = useContext(AppContext);
  const { analytics, recentIntents, networkStats, user } = state;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="glass-card p-6 floating">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-aqua-emerald to-neon-mint bg-clip-text text-transparent">
          Welcome to KestrelPay
        </h1>
        <p className="text-gray-300 mt-2">
          Connected as: <span className="text-aqua-emerald font-mono">{user.address}</span>
        </p>
      </div>

      {/* Network Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-neon-mint">{networkStats.gasPrice.current || '--'} Gwei</div>
          <div className="text-sm text-gray-400">Current Gas</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-aqua-emerald">{analytics.totalIntents}</div>
          <div className="text-sm text-gray-400">Total Intents</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400">{analytics.averageConfidence}%</div>
          <div className="text-sm text-gray-400">Avg Confidence</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-white">${analytics.totalVolume}</div>
          <div className="text-sm text-gray-400">Total Volume</div>
        </div>
      </div>

      {/* Swarm Status */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Swarm Intelligence</h2>
          <div className="px-3 py-1 bg-aqua-emerald bg-opacity-20 text-aqua-emerald rounded-full text-sm">
            Active
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <h3 className="text-lg font-medium mb-2">Execution Confidence</h3>
            <p className="text-gray-300 text-sm">
              Our swarm of 25 micro-bots analyzes network conditions in real-time 
              to determine optimal execution moments for your payment intents.
            </p>
            
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Gas Analysis</span>
                <span className="text-aqua-emerald">
                  {networkStats.gasPrice.current < 40 ? 'Optimal' : 'Moderate'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Network Congestion</span>
                <span className="text-aqua-emerald">
                  {networkStats.pendingTransactions < 30000 ? 'Low' : 'High'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Gas Saved</span>
                <span className="text-aqua-emerald">{analytics.gasSaved}</span>
              </div>
            </div>
          </div>
          
          <div className="flex-shrink-0">
            <SwarmConfidenceIndicator confidence={analytics.averageConfidence} size="medium" />
          </div>
        </div>
      </div>

      {/* Recent Intents */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Intents</h2>
        <div className="space-y-4">
          {recentIntents.slice(0, 3).map((intent) => (
            <IntentCard key={intent.id} intent={intent} />
          ))}
          
          {recentIntents.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <p>No intents yet. Create your first payment intent!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
