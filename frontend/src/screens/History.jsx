import React, { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import IntentCard from '../components/IntentCard';

const History = () => {
  const { state } = useContext(AppContext);
  const historyIntents = state.recentIntents.filter(intent => intent.status !== 'pending');

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h1 className="text-2xl font-bold mb-2">Transaction History</h1>
        <p className="text-gray-300">
          View your completed and cancelled payment intents.
        </p>
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Past Intents</h2>
          <span className="px-3 py-1 bg-aqua-emerald bg-opacity-20 text-aqua-emerald rounded-full text-sm">
            {historyIntents.length} Total
          </span>
        </div>
        
        <div className="space-y-4">
          {historyIntents.map((intent) => (
            <IntentCard key={intent.id} intent={intent} />
          ))}
          
          {historyIntents.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <p>No transaction history yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
