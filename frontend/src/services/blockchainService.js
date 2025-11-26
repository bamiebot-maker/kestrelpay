// Mock blockchain service that simulates real blockchain interactions
class MockBlockchainService {
  constructor() {
    this.walletAddress = '0x742d35Cc6634C0532925a3b8D4B5e1A1E3a3F6b8';
    this.balance = '2.45 ETH';
    this.networkId = 1; // Mainnet
    this.gasPrice = '45 Gwei';
    this.intentCounter = 2; // Start from existing intents
  }

  // Simulate wallet connection
  async connectWallet() {
    await this.delay(1500);
    return {
      success: true,
      address: this.walletAddress,
      balance: this.balance,
      network: 'Ethereum Mainnet'
    };
  }

  // Simulate creating a payment intent
  async createPaymentIntent(intentData) {
    await this.delay(2000);
    
    const intentId = `intent-${Date.now()}`;
    const transactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;
    
    // Simulate on-chain event
    console.log(`Intent created on blockchain: ${intentId}`);
    console.log(`Transaction: ${transactionHash}`);
    
    return {
      success: true,
      intentId,
      transactionHash,
      gasUsed: '45000',
      status: 'pending'
    };
  }

  // Simulate executing an intent
  async executeIntent(intentId) {
    await this.delay(3000);
    
    const transactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;
    
    console.log(`Intent executed on blockchain: ${intentId}`);
    console.log(`Transaction: ${transactionHash}`);
    
    return {
      success: true,
      intentId,
      transactionHash,
      gasUsed: '65000',
      status: 'executed',
      executedAt: new Date().toISOString()
    };
  }

  // Simulate getting user's intents from blockchain
  async getUserIntents(address) {
    await this.delay(800);
    
    // Return mock intents that would come from blockchain events
    const mockIntents = [
      {
        id: 'intent-1',
        sender: address,
        receiver: '0xRecipient1...',
        amount: '0.5',
        token: 'ETH',
        conditionType: 'time',
        conditionValue: '2024-01-15T14:30',
        status: 'executed',
        createdAt: '2024-01-15T10:00:00Z',
        executedAt: '2024-01-15T14:30:00Z',
        transactionHash: '0xabc123...',
        gasUsed: '45000'
      },
      {
        id: 'intent-2', 
        sender: address,
        receiver: '0xRecipient2...',
        amount: '100',
        token: 'USDC',
        conditionType: 'gas',
        conditionValue: '45',
        status: 'pending',
        createdAt: '2024-01-15T11:00:00Z',
        transactionHash: '0xdef456...',
        gasUsed: '35000'
      }
    ];
    
    return {
      success: true,
      intents: mockIntents
    };
  }

  // Simulate getting current gas price
  async getGasPrice() {
    await this.delay(500);
    return {
      current: Math.floor(Math.random() * 50) + 20, // 20-70 Gwei
      average: 45,
      fast: 55,
      slow: 30
    };
  }

  // Simulate getting network stats
  async getNetworkStats() {
    await this.delay(700);
    return {
      pendingTransactions: Math.floor(Math.random() * 50000) + 10000,
      baseFee: Math.floor(Math.random() * 50) + 20,
      lastBlock: 18965432 + Math.floor(Math.random() * 100),
      gasLimit: 30000000
    };
  }

  // Utility function for delays
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new MockBlockchainService();
