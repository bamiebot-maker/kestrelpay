import React from 'react';
import SwarmConfidenceIndicator from './SwarmConfidenceIndicator';

const IntentCard = ({ intent }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'executed': return 'text-green-400';
      case 'pending': return 'text-yellow-400';
      case 'cancelled': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'executed': return '✅';
      case 'pending': return '⏳';
      case 'cancelled': return '❌';
      default: return '📝';
    }
  };

  return (
    <div className="glass-card p-4 hover:border-aqua-emerald hover:border-opacity-50 transition-all">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <span className={getStatusColor(intent.status)}>
              {getStatusIcon(intent.status)}
            </span>
            <span className={`text-sm font-medium ${getStatusColor(intent.status)}`}>
              {intent.status.toUpperCase()}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-400">To</div>
              <div className="font-mono text-xs truncate">{intent.receiver}</div>
            </div>
            <div>
              <div className="text-gray-400">Amount</div>
              <div className="font-semibold">
                {intent.amount} {intent.token}
              </div>
            </div>
          </div>
          
          <div className="mt-2 text-xs text-gray-400">
            Created: {new Date(intent.createdAt).toLocaleDateString()}
          </div>
        </div>
        
        <div className="flex-shrink-0 ml-4">
          {intent.swarmAnalysis && (
            <SwarmConfidenceIndicator 
              confidence={intent.swarmAnalysis.confidence} 
              size="small" 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default IntentCard;
