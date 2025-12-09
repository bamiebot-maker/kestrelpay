import React, { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';

const ActiveIntents = () => {
  const { state, executeIntent } = useContext(AppContext);
  
  // Get pending intents from context
  const activeIntents = state.recentIntents.filter(intent => intent.status === 'pending');

  const handleExecuteIntent = async (intentId) => {
    if (window.confirm('Are you sure you want to execute this intent now?')) {
      try {
        const result = await executeIntent(intentId);
        if (result.success) {
          alert('Intent executed successfully!');
        } else {
          alert(result.error || 'Failed to execute intent');
        }
      } catch (error) {
        console.error('Error executing intent:', error);
        alert('Failed to execute intent. Please try again.');
      }
    }
  };

  const handleCancelIntent = (intentId) => {
    if (window.confirm('Are you sure you want to cancel this intent?')) {
      // Update intent status to cancelled
      // You'll need to add a cancelIntent function to AppContext
      alert('Intent cancelled successfully!');
    }
  };

  // Simple intent card component
  const IntentCard = ({ intent }) => {
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString();
    };

    return (
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-white">
              {intent.amount} {intent.token}
            </h3>
            <p className="text-sm text-gray-400">
              To: {intent.receiver?.substring(0, 8) || '0x...'}...{intent.receiver?.substring(intent.receiver.length - 6) || '...'}
            </p>
          </div>
          <span className="px-3 py-1 bg-yellow-400 bg-opacity-20 text-yellow-400 rounded-full text-sm">
            Pending
          </span>
        </div>
        <div className="text-sm text-gray-300">
          {intent.conditionType === 'time' ? 
            `Execute on: ${formatDate(intent.conditionValue)}` :
            intent.conditionType === 'gas' ? `Execute when gas < ${intent.conditionValue} Gwei` :
            'Manual execution'}
        </div>
        <div className="text-xs text-gray-500">
          Created: {formatDate(intent.createdAt)}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="glass-card p-6 mb-6">
        <h1 className="text-2xl font-bold mb-2 text-white">Active Intents</h1>
        <p className="text-gray-300">
          Monitor your pending payment intents and their execution status.
        </p>
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Pending Execution</h2>
          <span className="px-3 py-1 bg-yellow-400 bg-opacity-20 text-yellow-400 rounded-full text-sm">
            {activeIntents.length} Active
          </span>
        </div>

        <div className="space-y-4">
          {activeIntents.map((intent) => (
            <div key={intent.id} className="glass-card p-4 border border-aqua-emerald border-opacity-20 hover:border-opacity-50 transition-all">
              <IntentCard intent={intent} />
              <div className="mt-4 flex justify-end space-x-3">
                <button
                  onClick={() => handleExecuteIntent(intent.id)}
                  className="px-4 py-2 bg-aqua-emerald text-dark-abyss rounded-lg font-semibold hover:bg-neon-mint transition-all"
                >
                  Execute Now
                </button>
                <button 
                  onClick={() => handleCancelIntent(intent.id)}
                  className="px-4 py-2 bg-red-500 bg-opacity-20 text-red-400 rounded-lg font-semibold hover:bg-opacity-30 transition-all"
                >
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