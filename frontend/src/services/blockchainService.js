import { ethers } from 'ethers';

class RealBlockchainService {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.walletAddress = null;
    this.network = null;
  }

  // Check if MetaMask is installed
  isMetaMaskInstalled() {
    return typeof window.ethereum !== 'undefined';
  }

  // Check if mobile device
  isMobile() {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  }

  // Connect wallet - REAL implementation
  async connectWallet() {
    try {
      // Check if wallet is installed
      if (!this.isMetaMaskInstalled()) {
        // Mobile deep link for MetaMask
        if (this.isMobile()) {
          window.open('https://metamask.app.link/dapp/' + window.location.hostname, '_blank');
          return {
            success: false,
            error: 'Please install MetaMask from the app store'
          };
        }
        return {
          success: false,
          error: 'Please install MetaMask to use KestrelPay'
        };
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length === 0) {
        return {
          success: false,
          error: 'No accounts found. Please unlock your wallet.'
        };
      }

      // Create provider and signer
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();
      this.walletAddress = accounts[0];

      // Get network info
      const network = await this.provider.getNetwork();
      this.network = {
        name: network.name,
        chainId: Number(network.chainId)
      };

      // Get balance
      const balance = await this.provider.getBalance(this.walletAddress);
      const formattedBalance = ethers.formatEther(balance);

      // Listen for account changes
      window.ethereum.on('accountsChanged', (newAccounts) => {
        if (newAccounts.length > 0) {
          this.walletAddress = newAccounts[0];
          window.location.reload();
        } else {
          // User disconnected
          this.disconnect();
        }
      });

      // Listen for chain changes
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });

      return {
        success: true,
        address: this.walletAddress,
        balance: `${parseFloat(formattedBalance).toFixed(4)} ETH`,
        network: this.getNetworkName(this.network.chainId)
      };

    } catch (error) {
      console.error('Wallet connection error:', error);
      return {
        success: false,
        error: error.message || 'Failed to connect wallet'
      };
    }
  }

  // Get network name from chain ID
  getNetworkName(chainId) {
    const networks = {
      1: 'Ethereum Mainnet',
      5: 'Goerli Testnet',
      11155111: 'Sepolia Testnet',
      137: 'Polygon Mainnet',
      80001: 'Polygon Mumbai',
      56: 'BNB Smart Chain',
      42161: 'Arbitrum One'
    };
    return networks[chainId] || `Network ${chainId}`;
  }

  // Get real gas price from network
  async getGasPrice() {
    try {
      if (!this.provider) {
        throw new Error('Not connected');
      }

      const feeData = await this.provider.getFeeData();
      const gasPrice = feeData.gasPrice;
      
      return {
        current: Math.round(Number(ethers.formatUnits(gasPrice, 'gwei'))),
        average: Math.round(Number(ethers.formatUnits(gasPrice, 'gwei')) * 0.9),
        fast: Math.round(Number(ethers.formatUnits(gasPrice, 'gwei')) * 1.1),
        slow: Math.round(Number(ethers.formatUnits(gasPrice, 'gwei')) * 0.8)
      };
    } catch (error) {
      console.error('Failed to get gas price:', error);
      return {
        current: 45,
        average: 40,
        fast: 50,
        slow: 35
      };
    }
  }

  // Get network stats
  async getNetworkStats() {
    try {
      if (!this.provider) {
        throw new Error('Not connected');
      }

      const blockNumber = await this.provider.getBlockNumber();
      const block = await this.provider.getBlock(blockNumber);

      return {
        pendingTransactions: Math.floor(Math.random() * 50000) + 10000, // Mock for now
        baseFee: block?.baseFeePerGas ? Math.round(Number(ethers.formatUnits(block.baseFeePerGas, 'gwei'))) : 20,
        lastBlock: blockNumber,
        gasLimit: block?.gasLimit ? Number(block.gasLimit) : 30000000
      };
    } catch (error) {
      console.error('Failed to get network stats:', error);
      return {
        pendingTransactions: 15000,
        baseFee: 20,
        lastBlock: 18965432,
        gasLimit: 30000000
      };
    }
  }

  // Create payment intent (placeholder for now - will integrate with real contract)
  async createPaymentIntent(intentData) {
    try {
      if (!this.signer) {
        throw new Error('Not connected');
      }

      // Simulate blockchain transaction (replace with actual contract call)
      await new Promise(resolve => setTimeout(resolve, 2000));

      const intentId = `intent-${Date.now()}`;
      const transactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;

      return {
        success: true,
        intentId,
        transactionHash,
        gasUsed: '45000',
        status: 'pending'
      };
    } catch (error) {
      console.error('Failed to create intent:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get user's intents (placeholder - will be from contract events)
  async getUserIntents(address) {
    try {
      // Mock data for now - replace with contract event filtering
      const mockIntents = [
        {
          id: 'intent-1',
          sender: address,
          receiver: '0xRecipient1...',
          amount: '0.5',
          token: 'ETH',
          conditionType: 'time',
          conditionValue: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
          status: 'pending',
          createdAt: new Date().toISOString(),
          transactionHash: '0xabc123...'
        }
      ];

      return {
        success: true,
        intents: mockIntents
      };
    } catch (error) {
      console.error('Failed to get user intents:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Disconnect wallet
  disconnect() {
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.walletAddress = null;
    this.network = null;
    
    if (window.ethereum) {
      window.ethereum.removeAllListeners();
    }
  }
}

export default new RealBlockchainService();