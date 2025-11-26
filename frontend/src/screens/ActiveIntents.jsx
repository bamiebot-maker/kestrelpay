import React, { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import IntentCard from '../components/IntentCard';

const ActiveIntents = () => {
  const { state, executeIntent } = useContext(AppContext);
  const activeIntents = state.recentIntents.filter(intent => intent.status === 'pending');

  const handleExecuteIntent = async (intentId) => {
    if (window.confirm('Are you sure you want to execute this intent now?')) {
      try {
        const result = await executeIntent(intentId);
        if (result.success) {
          alert('Intent executed successfully!');
        } else {
          alert(`Failed to execute intent: ${result.error}`);
        }
      } catch (error) {
        console.error('Error executing intent:', error);
        alert('Failed to execute intent. Please try again.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h1 className="text-2xl font-bold mb-2">Active Intents</h1>
        <p className="text-gray-300">
          Monitor your pending payment intents and their execution status.
        </p>
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Pending Execution</h2>
          <span className="px-3 py-1 bg-yellow-400 bg-opacity-20 text-yellow-400 rounded-full text-sm">
            {activeIntents.length} Active
          </span>
        </div>
        
        <div className="space-y-4">
          {activeIntents.map((intent) => (
            <div key={intent.id} className="glass-card p-4 hover:border-aqua-emerald hover:border-opacity-50 transition-all">
              <IntentCard intent={intent} />
              <div className="mt-4 flex justify-end space-x-3">
                <button
                  onClick={() => handleExecuteIntent(intent.id)}
                  className="px-4 py-2 bg-aqua-emerald text-dark-abyss rounded-lg font-semibold hover:bg-neon-mint transition-all"
                >
                  Execute Now
                </button>
                <button className="px-4 py-2 bg-red-500 bg-opacity-20 text-red-400 rounded-lg font-semibold hover:bg-opacity-30 transition-all">
                  Cancel
                </button>
              </div>
            </div>
          ))}
          
          {activeIntents.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <p>No active intents. Create your first payment intent!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActiveIntents;
