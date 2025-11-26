import React, { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';

const Analytics = () => {
  const { state } = useContext(AppContext);
  const { analytics } = state;

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h1 className="text-2xl font-bold mb-2">Analytics Dashboard</h1>
        <p className="text-gray-300">
          Real-time insights into your payment intents and swarm performance.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 text-center">
          <div className="text-3xl font-bold text-neon-mint">{analytics.totalIntents}</div>
          <div className="text-gray-400 mt-2">Total Intents</div>
        </div>
        <div className="glass-card p-6 text-center">
          <div className="text-3xl font-bold text-aqua-emerald">{analytics.executedIntents}</div>
          <div className="text-gray-400 mt-2">Success Rate</div>
        </div>
        <div className="glass-card p-6 text-center">
          <div className="text-3xl font-bold text-white">${analytics.totalVolume}</div>
          <div className="text-gray-400 mt-2">Total Volume</div>
        </div>
      </div>

      {/* Swarm Performance */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4">Swarm Performance Metrics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-dark-abyss rounded-lg">
            <div className="text-2xl font-bold text-aqua-emerald">25</div>
            <div className="text-gray-400 text-sm">Active Bots</div>
          </div>
          <div className="text-center p-4 bg-dark-abyss rounded-lg">
            <div className="text-2xl font-bold text-neon-mint">{analytics.averageConfidence}%</div>
            <div className="text-gray-400 text-sm">Avg Confidence</div>
          </div>
          <div className="text-center p-4 bg-dark-abyss rounded-lg">
            <div className="text-2xl font-bold text-green-400">98.2%</div>
            <div className="text-gray-400 text-sm">Uptime</div>
          </div>
          <div className="text-center p-4 bg-dark-abyss rounded-lg">
            <div className="text-2xl font-bold text-yellow-400">2.1s</div>
            <div className="text-gray-400 text-sm">Avg Response</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
