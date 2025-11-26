import React, { useState, useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import SwarmConfidenceIndicator from '../components/SwarmConfidenceIndicator';

const CreateIntent = () => {
  const { createIntent } = useContext(AppContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    receiver: '',
    amount: '',
    conditionType: 'time',
    conditionValue: '',
    token: 'ETH'
  });
  const [swarmAnalysis, setSwarmAnalysis] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleInputChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    
    // Simulate swarm analysis on form changes
    if (field === 'amount' || field === 'conditionType') {
      simulateSwarmAnalysis(updated);
    }
  };

  const simulateSwarmAnalysis = async (data) => {
    // Mock analysis based on form data
    const baseConfidence = Math.random() * 30 + 60; // 60-90%
    const analysis = {
      recommended: baseConfidence > 65,
      confidence: Math.round(baseConfidence),
      reason: data.conditionType === 'time' ? 'Optimal time window' : 'Good gas conditions',
      timestamp: new Date().toISOString()
    };
    
    setSwarmAnalysis(analysis);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!swarmAnalysis?.recommended) {
      alert('Swarm analysis does not recommend execution at this time. Please adjust parameters.');
      return;
    }

    setIsCreating(true);
    
    try {
      const result = await createIntent({
        ...formData,
        swarmAnalysis
      });
      
      if (result.success) {
        // Reset form
        setFormData({
          receiver: '',
          amount: '',
          conditionType: 'time',
          conditionValue: '',
          token: 'ETH'
        });
        setSwarmAnalysis(null);
        
        // Show success message
        alert(`Intent created successfully!\nTransaction: ${result.intent.transactionHash}`);
        
        // Navigate to intents page
        navigate('/intents');
      } else {
        alert(`Failed to create intent: ${result.error}`);
      }
    } catch (error) {
      console.error('Error creating intent:', error);
      alert('Failed to create intent. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="glass-card p-6">
        <h1 className="text-2xl font-bold mb-2">Create Payment Intent</h1>
        <p className="text-gray-300">
          Set up conditional payments that execute automatically when optimal conditions are met.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-6 space-y-6">
        {/* Recipient Address */}
        <div>
          <label className="block text-sm font-medium mb-2">Recipient Address</label>
          <input
            type="text"
            value={formData.receiver}
            onChange={(e) => handleInputChange('receiver', e.target.value)}
            placeholder="0x742d35Cc6634C0532925a3b8D4B5e1A1E3a3F6b8"
            className="w-full px-4 py-3 bg-dark-abyss border border-aqua-emerald border-opacity-30 rounded-lg focus:border-aqua-emerald focus:ring-1 focus:ring-aqua-emerald outline-none transition-all"
            required
          />
        </div>

        {/* Amount and Token */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Amount</label>
            <input
              type="number"
              step="0.001"
              value={formData.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-3 bg-dark-abyss border border-aqua-emerald border-opacity-30 rounded-lg focus:border-aqua-emerald focus:ring-1 focus:ring-aqua-emerald outline-none transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Token</label>
            <select
              value={formData.token}
              onChange={(e) => handleInputChange('token', e.target.value)}
              className="w-full px-4 py-3 bg-dark-abyss border border-aqua-emerald border-opacity-30 rounded-lg focus:border-aqua-emerald focus:ring-1 focus:ring-aqua-emerald outline-none transition-all"
            >
              <option value="ETH">ETH</option>
              <option value="USDC">USDC</option>
              <option value="DAI">DAI</option>
            </select>
          </div>
        </div>

        {/* Condition Type */}
        <div>
          <label className="block text-sm font-medium mb-2">Execution Condition</label>
          <select
            value={formData.conditionType}
            onChange={(e) => handleInputChange('conditionType', e.target.value)}
            className="w-full px-4 py-3 bg-dark-abyss border border-aqua-emerald border-opacity-30 rounded-lg focus:border-aqua-emerald focus:ring-1 focus:ring-aqua-emerald outline-none transition-all"
          >
            <option value="time">Time-based</option>
            <option value="gas">Gas Price</option>
            <option value="manual">Manual</option>
          </select>
        </div>

        {/* Condition Value */}
        <div>
          <label className="block text-sm font-medium mb-2">
            {formData.conditionType === 'time' ? 'Execution Time' : 
             formData.conditionType === 'gas' ? 'Max Gas Price (Gwei)' : 
             'Manual Execution'}
          </label>
          <input
            type={formData.conditionType === 'time' ? 'datetime-local' : 'number'}
            value={formData.conditionValue}
            onChange={(e) => handleInputChange('conditionValue', e.target.value)}
            placeholder={formData.conditionType === 'gas' ? '50' : ''}
            className="w-full px-4 py-3 bg-dark-abyss border border-aqua-emerald border-opacity-30 rounded-lg focus:border-aqua-emerald focus:ring-1 focus:ring-aqua-emerald outline-none transition-all"
            required={formData.conditionType !== 'manual'}
          />
        </div>

        {/* Swarm Analysis */}
        {swarmAnalysis && (
          <div className="glass-card p-4 border border-aqua-emerald border-opacity-20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Swarm Analysis</h3>
                <p className="text-sm text-gray-300">{swarmAnalysis.reason}</p>
              </div>
              <SwarmConfidenceIndicator confidence={swarmAnalysis.confidence} size="small" />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isCreating || !swarmAnalysis?.recommended}
          className="w-full btn-liquid py-4 font-semibold disabled:opacity-50 disabled:cursor-not-allowed ripple"
        >
          {isCreating ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-dark-abyss border-t-transparent rounded-full animate-spin"></div>
              <span>Creating on Blockchain...</span>
            </div>
          ) : (
            'Create Payment Intent'
          )}
        </button>

        {swarmAnalysis && !swarmAnalysis.recommended && (
          <p className="text-yellow-400 text-sm text-center">
            ⚠️ Low execution confidence. Consider adjusting parameters.
          </p>
        )}
      </form>
    </div>
  );
};

export default CreateIntent;
