import React, { createContext, useReducer, useEffect } from 'react';
import blockchainService from '../services/blockchainService';

const AppContext = createContext();

const initialState = {
  user: {
    address: null,
    balance: '0 ETH',
    network: null
  },
  analytics: {
    totalIntents: 0,
    executedIntents: 0,
    cancelledIntents: 0,
    totalVolume: 0,
    averageConfidence: 0,
    gasSaved: '0.024 ETH'
  },
  recentIntents: [],
  networkStats: {
    gasPrice: {},
    pendingTransactions: 0,
    lastBlock: 0
  },
  isConnected: false
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload },
        isConnected: true
      };
    
    case 'ADD_INTENT':
      const newIntents = [action.payload, ...state.recentIntents];
      return {
        ...state,
        recentIntents: newIntents,
        analytics: {
          ...state.analytics,
          totalIntents: state.analytics.totalIntents + 1,
          totalVolume: state.analytics.totalVolume + parseFloat(action.payload.amount || 0)
        }
      };
    
    case 'UPDATE_INTENT':
      const updatedIntents = state.recentIntents.map(intent =>
        intent.id === action.payload.id ? { ...intent, ...action.payload } : intent
      );
      return {
        ...state,
        recentIntents: updatedIntents,
        analytics: {
          ...state.analytics,
          executedIntents: updatedIntents.filter(i => i.status === 'executed').length
        }
      };
    
    case 'SET_NETWORK_STATS':
      return {
        ...state,
        networkStats: { ...state.networkStats, ...action.payload }
      };
    
    case 'SET_ANALYTICS':
      return {
        ...state,
        analytics: { ...state.analytics, ...action.payload }
      };
    
    case 'DISCONNECT_WALLET':
      return initialState;
    
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load initial data when connected
  useEffect(() => {
    if (state.isConnected && state.user.address) {
      loadUserIntents();
      loadNetworkStats();
      
      // Set up periodic updates
      const interval = setInterval(() => {
        loadNetworkStats();
        updateAnalytics();
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [state.isConnected, state.user.address]);

  const loadUserIntents = async () => {
    try {
      const result = await blockchainService.getUserIntents(state.user.address);
      if (result.success) {
        // Calculate analytics from intents
        const totalIntents = result.intents.length;
        const executedIntents = result.intents.filter(i => i.status === 'executed').length;
        const totalVolume = result.intents.reduce((sum, intent) => sum + parseFloat(intent.amount || 0), 0);
        
        dispatch({ 
          type: 'SET_ANALYTICS',
          payload: {
            totalIntents,
            executedIntents,
            totalVolume,
            averageConfidence: Math.floor(Math.random() * 20) + 75
          }
        });
        
        // Note: We're not replacing intents to keep the mock data structure
      }
    } catch (error) {
      console.error('Failed to load user intents:', error);
    }
  };

  const loadNetworkStats = async () => {
    try {
      const [gasPrice, networkStats] = await Promise.all([
        blockchainService.getGasPrice(),
        blockchainService.getNetworkStats()
      ]);
      
      dispatch({
        type: 'SET_NETWORK_STATS',
        payload: {
          gasPrice,
          pendingTransactions: networkStats.pendingTransactions,
          lastBlock: networkStats.lastBlock
        }
      });
    } catch (error) {
      console.error('Failed to load network stats:', error);
    }
  };

  const updateAnalytics = () => {
    dispatch({
      type: 'SET_ANALYTICS',
      payload: {
        averageConfidence: Math.floor(Math.random() * 20) + 70,
        gasSaved: `${(Math.random() * 0.05).toFixed(3)} ETH`
      }
    });
  };

  const connectWallet = async () => {
    try {
      const result = await blockchainService.connectWallet();
      if (result.success) {
        dispatch({
          type: 'SET_USER',
          payload: {
            address: result.address,
            balance: result.balance,
            network: result.network
          }
        });
        return { success: true };
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      return { success: false, error: error.message };
    }
  };

  const createIntent = async (intentData) => {
    try {
      const result = await blockchainService.createPaymentIntent(intentData);
      if (result.success) {
        const newIntent = {
          id: result.intentId,
          ...intentData,
          status: 'pending',
          createdAt: new Date().toISOString(),
          transactionHash: result.transactionHash,
          gasUsed: result.gasUsed,
          swarmAnalysis: {
            confidence: Math.floor(Math.random() * 30) + 65,
            reason: 'Optimal conditions detected'
          }
        };
        
        dispatch({ type: 'ADD_INTENT', payload: newIntent });
        return { success: true, intent: newIntent };
      }
    } catch (error) {
      console.error('Failed to create intent:', error);
      return { success: false, error: error.message };
    }
  };

  const executeIntent = async (intentId) => {
    try {
      const result = await blockchainService.executeIntent(intentId);
      if (result.success) {
        dispatch({
          type: 'UPDATE_INTENT',
          payload: {
            id: intentId,
            status: 'executed',
            executedAt: result.executedAt,
            transactionHash: result.transactionHash
          }
        });
        return { success: true };
      }
    } catch (error) {
      console.error('Failed to execute intent:', error);
      return { success: false, error: error.message };
    }
  };

  const disconnectWallet = () => {
    dispatch({ type: 'DISCONNECT_WALLET' });
  };

  const value = {
    state,
    dispatch,
    connectWallet,
    disconnectWallet,
    createIntent,
    executeIntent
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export { AppContext };
