import React, { createContext, useReducer, useEffect } from 'react';
import blockchainService from '../services/blockchainService';

const AppContext = createContext();

// ===================== CONFIGURATION =====================
// EASY TO UPDATE AFTER DEPLOYMENT - JUST FILL THESE 3 THINGS:

// 1. YOUR CONTRACT ADDRESSES (ONE FOR EACH NETWORK)
const CONTRACT_ADDRESSES = {
  sepolia: '0xd9145CCE52D386f254917e481eB44e9943F39138', // ← YOUR SEPOLIA CONTRACT
  blockdag: '0x0000000000000000000000000000000000000000', // ← YOUR BLOCKDAG CONTRACT
  mumbai: '0x0000000000000000000000000000000000000000',   // ← YOUR MUMBAI CONTRACT (OPTIONAL)
};

// 2. YOUR CONTRACT ABI (SAME FOR ALL NETWORKS)
const CONTRACT_ABI = [
  // ⬇️⬇️⬇️ PASTE YOUR CONTRACT ABI HERE ⬇️⬇️⬇️
  // Get from Remix: Solidity Compiler tab → "ABI" button
  // Copy entire JSON and paste between these brackets
  // DELETE THIS COMMENT AND PASTE YOUR ABI
];

// 3. SUPPORTED NETWORKS
const SUPPORTED_NETWORKS = {
  // Ethereum
  11155111: { 
    name: 'Sepolia Testnet', 
    contract: CONTRACT_ADDRESSES.sepolia,
    explorer: 'https://sepolia.etherscan.io'
  },
  // BlockDAG
  3001: { 
    name: 'BlockDAG Testnet', 
    contract: CONTRACT_ADDRESSES.blockdag,
    explorer: 'https://blockdag-testnet-explorer.com' // UPDATE WITH REAL BLOCKDAG EXPLORER
  },
  30103: { 
    name: 'BlockDAG Mainnet', 
    contract: CONTRACT_ADDRESSES.blockdag,
    explorer: 'https://blockdag-explorer.com' // UPDATE WITH REAL BLOCKDAG EXPLORER
  },
  // Polygon
  80001: { 
    name: 'Polygon Mumbai', 
    contract: CONTRACT_ADDRESSES.mumbai,
    explorer: 'https://mumbai.polygonscan.com'
  },
};
// ===================== END CONFIGURATION =====================

const initialState = {
  user: {
    address: null,
    balance: '0 ETH',
    network: null,
    chainId: null
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
  isConnected: false,
  isContractInitialized: false,
  contractAddress: null,
  loading: {
    userIntents: false,
    networkStats: false,
    contract: false
  }
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload },
        isConnected: !!action.payload.address
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
      
      const executedIntents = updatedIntents.filter(i => i.status === 'executed').length;
      const cancelledIntents = updatedIntents.filter(i => i.status === 'cancelled').length;
      
      return {
        ...state,
        recentIntents: updatedIntents,
        analytics: {
          ...state.analytics,
          executedIntents,
          cancelledIntents
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
    
    case 'SET_CONTRACT_INITIALIZED':
      return {
        ...state,
        isContractInitialized: action.payload.initialized,
        contractAddress: action.payload.address || null,
        loading: {
          ...state.loading,
          contract: false
        }
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        loading: { ...state.loading, ...action.payload }
      };
    
    case 'DISCONNECT_WALLET':
      return {
        ...initialState,
        loading: { ...initialState.loading }
      };
    
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Initialize contract based on connected network
  const initializeContract = async (chainId) => {
    try {
      dispatch({ 
        type: 'SET_LOADING', 
        payload: { contract: true } 
      });

      const networkConfig = SUPPORTED_NETWORKS[chainId];
      
      if (!networkConfig) {
        console.warn(`Network ${chainId} not supported, using mock mode`);
        dispatch({
          type: 'SET_CONTRACT_INITIALIZED',
          payload: {
            initialized: false,
            address: null
          }
        });
        return;
      }

      const contractAddress = networkConfig.contract;
      
      // Check if contract is deployed for this network
      if (!contractAddress || contractAddress === '0x0000000000000000000000000000000000000000') {
        console.warn(`No contract deployed for ${networkConfig.name}, using mock mode`);
        dispatch({
          type: 'SET_CONTRACT_INITIALIZED',
          payload: {
            initialized: false,
            address: null
          }
        });
        return;
      }

      // Initialize real contract
      const result = await blockchainService.initializeContract(
        contractAddress,
        CONTRACT_ABI
      );

      if (result.success) {
        console.log(`✅ Contract initialized on ${networkConfig.name}: ${contractAddress}`);
        dispatch({
          type: 'SET_CONTRACT_INITIALIZED',
          payload: {
            initialized: true,
            address: contractAddress
          }
        });
      } else {
        console.warn(`Contract initialization failed for ${networkConfig.name}:`, result.error);
        dispatch({
          type: 'SET_CONTRACT_INITIALIZED',
          payload: {
            initialized: false,
            address: null
          }
        });
      }
    } catch (error) {
      console.error('Failed to initialize contract:', error);
      dispatch({
        type: 'SET_CONTRACT_INITIALIZED',
        payload: {
          initialized: false,
          address: null
        }
      });
    }
  };

  // Load initial data when connected
  useEffect(() => {
    if (state.isConnected && state.user.address) {
      loadUserIntents();
      loadNetworkStats();
      
      if (state.user.chainId) {
        initializeContract(state.user.chainId);
      }
      
      const interval = setInterval(() => {
        loadNetworkStats();
        updateAnalytics();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [state.isConnected, state.user.address, state.user.chainId]);

  const loadUserIntents = async () => {
    try {
      dispatch({ 
        type: 'SET_LOADING', 
        payload: { userIntents: true } 
      });

      const result = await blockchainService.getUserIntents(state.user.address);
      
      if (result.success) {
        const totalIntents = result.intents.length;
        const executedIntents = result.intents.filter(i => i.status === 'executed').length;
        const cancelledIntents = result.intents.filter(i => i.status === 'cancelled').length;
        const totalVolume = result.intents.reduce((sum, intent) => 
          sum + parseFloat(intent.amount || 0), 0
        );
        
        dispatch({ 
          type: 'SET_ANALYTICS',
          payload: {
            totalIntents,
            executedIntents,
            cancelledIntents,
            totalVolume,
            averageConfidence: Math.floor(Math.random() * 20) + 75
          }
        });
      }
    } catch (error) {
      console.error('Failed to load user intents:', error);
    } finally {
      dispatch({ 
        type: 'SET_LOADING', 
        payload: { userIntents: false } 
      });
    }
  };

  const loadNetworkStats = async () => {
    try {
      dispatch({ 
        type: 'SET_LOADING', 
        payload: { networkStats: true } 
      });

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
    } finally {
      dispatch({ 
        type: 'SET_LOADING', 
        payload: { networkStats: false } 
      });
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
        // Get chain ID from blockchain service
        const chainId = blockchainService.network?.chainId || null;
        
        dispatch({
          type: 'SET_USER',
          payload: {
            address: result.address,
            balance: result.balance,
            network: result.network,
            chainId: chainId
          }
        });
        
        // Show network info
        const networkInfo = SUPPORTED_NETWORKS[chainId] || { name: 'Unknown Network' };
        console.log(`Connected to ${networkInfo.name} (Chain ID: ${chainId})`);
        
        return { 
          success: true,
          message: `Connected to ${networkInfo.name}` 
        };
      } else {
        return { 
          success: false, 
          error: result.error || 'Failed to connect wallet' 
        };
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to connect wallet' 
      };
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
        return { 
          success: true, 
          intent: newIntent,
          transactionHash: result.transactionHash
        };
      } else {
        return { 
          success: false, 
          error: result.error || 'Failed to create intent' 
        };
      }
    } catch (error) {
      console.error('Failed to create intent:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to create intent' 
      };
    }
  };

  const cancelIntent = async (intentId) => {
    try {
      const result = await blockchainService.cancelIntent(intentId);
      
      if (result.success) {
        dispatch({
          type: 'UPDATE_INTENT',
          payload: {
            id: intentId,
            status: 'cancelled',
            cancelledAt: result.cancelledAt || new Date().toISOString(),
            transactionHash: result.transactionHash
          }
        });
        
        return { 
          success: true,
          transactionHash: result.transactionHash,
          message: 'Intent cancelled successfully' 
        };
      } else {
        return { 
          success: false, 
          error: result.error || 'Failed to cancel intent' 
        };
      }
    } catch (error) {
      console.error('Failed to cancel intent:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to cancel intent' 
      };
    }
  };

  const executeIntent = async (intentId) => {
    try {
      // If contract is initialized, check condition
      if (state.isContractInitialized) {
        const conditionCheck = await blockchainService.checkIntentCondition(intentId);
        if (!conditionCheck.success || !conditionCheck.conditionMet) {
          return { 
            success: false, 
            error: 'Execution condition not met' 
          };
        }
      }

      const result = await blockchainService.executeIntent(intentId);
      
      if (result.success) {
        dispatch({
          type: 'UPDATE_INTENT',
          payload: {
            id: intentId,
            status: 'executed',
            executedAt: result.executedAt || new Date().toISOString(),
            transactionHash: result.transactionHash,
            gasUsed: result.gasUsed
          }
        });
        
        return { 
          success: true,
          transactionHash: result.transactionHash,
          message: 'Intent executed successfully' 
        };
      } else {
        return { 
          success: false, 
          error: result.error || 'Failed to execute intent' 
        };
      }
    } catch (error) {
      console.error('Failed to execute intent:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to execute intent' 
      };
    }
  };

  const disconnectWallet = () => {
    blockchainService.disconnect();
    dispatch({ type: 'DISCONNECT_WALLET' });
  };

  const refreshData = () => {
    if (state.isConnected && state.user.address) {
      loadUserIntents();
      loadNetworkStats();
    }
  };

  const getExplorerUrl = (hash, type = 'tx') => {
    const networkConfig = SUPPORTED_NETWORKS[state.user.chainId];
    if (!networkConfig || !networkConfig.explorer) return null;
    
    return `${networkConfig.explorer}/${type}/${hash}`;
  };

  const value = {
    state,
    dispatch,
    connectWallet,
    disconnectWallet,
    createIntent,
    executeIntent,
    cancelIntent,
    refreshData,
    initializeContract,
    getExplorerUrl
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export { AppContext };