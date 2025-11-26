// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title KestrelIntent
 * @dev Smart contract for intent-based conditional payments on BlockDAG
 * Features: Time-based execution, gas price conditions, swarm intelligence integration
 */
contract KestrelIntent {
    // Enums
    enum Condition Type { Time, GasPrice, Manual }
    enum IntentStatus { Pending, Executed, Cancelled }
    
    // Structs
    struct PaymentIntent {
        address sender;
        address receiver;
        uint256 amount;
        ConditionType conditionType;
        uint256 conditionValue;
        IntentStatus status;
        uint256 createdAt;
        uint256 executedAt;
        string intentId; // For backend reference
    }
    
    // State variables
    mapping(string => PaymentIntent) public intents;
    mapping(address => string[]) public userIntents;
    uint256 public intentCount;
    
    address public owner;
    uint256 public constant GAS_THRESHOLD = 50 gwei;
    
    // Events
    event IntentCreated(
        string indexed intentId,
        address indexed sender,
        address indexed receiver,
        uint256 amount,
        ConditionType conditionType,
        uint256 conditionValue
    );
    
    event IntentExecuted(string indexed intentId, address indexed executor);
    event IntentCancelled(string indexed intentId, address indexed canceller);
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "KestrelIntent: Not contract owner");
        _;
    }
    
    modifier onlySender(string memory intentId) {
        require(intents[intentId].sender == msg.sender, "KestrelIntent: Not intent sender");
        _;
    }
    
    modifier intentExists(string memory intentId) {
        require(bytes(intents[intentId].intentId).length != 0, "KestrelIntent: Intent does not exist");
        _;
    }
    
    // Constructor
    constructor() {
        owner = msg.sender;
    }
    
    /**
     * @dev Create a new payment intent
     * @param intentId Unique identifier from backend
     * @param receiver Recipient address
     * @param conditionType Type of execution condition
     * @param conditionValue Value for the condition
     */
    function createIntent(
        string memory intentId,
        address receiver,
        ConditionType conditionType,
        uint256 conditionValue
    ) external payable returns (bool) {
        require(receiver != address(0), "KestrelIntent: Invalid receiver address");
        require(msg.value > 0, "KestrelIntent: Amount must be greater than 0");
        require(bytes(intentId).length > 0, "KestrelIntent: Intent ID required");
        require(bytes(intents[intentId].intentId).length == 0, "KestrelIntent: Intent ID already exists");
        
        // Create new intent
        PaymentIntent storage newIntent = intents[intentId];
        newIntent.sender = msg.sender;
        newIntent.receiver = receiver;
        newIntent.amount = msg.value;
        newIntent.conditionType = conditionType;
        newIntent.conditionValue = conditionValue;
        newIntent.status = IntentStatus.Pending;
        newIntent.createdAt = block.timestamp;
        newIntent.intentId = intentId;
        
        // Track user intents
        userIntents[msg.sender].push(intentId);
        intentCount++;
        
        emit IntentCreated(
            intentId,
            msg.sender,
            receiver,
            msg.value,
            conditionType,
            conditionValue
        );
        
        return true;
    }
    
    /**
     * @dev Execute a payment intent when conditions are met
     * @param intentId ID of the intent to execute
     */
    function executeIntent(string memory intentId) 
        external 
        intentExists(intentId) 
        returns (bool) 
    {
        PaymentIntent storage intent = intents[intentId];
        
        require(intent.status == IntentStatus.Pending, "KestrelIntent: Intent not pending");
        require(checkCondition(intentId), "KestrelIntent: Execution conditions not met");
        
        // Update intent status
        intent.status = IntentStatus.Executed;
        intent.executedAt = block.timestamp;
        
        // Transfer funds to receiver
        (bool success, ) = intent.receiver.call{value: intent.amount}("");
        require(success, "KestrelIntent: Transfer failed");
        
        emit IntentExecuted(intentId, msg.sender);
        return true;
    }
    
    /**
     * @dev Cancel a pending intent (only by sender)
     * @param intentId ID of the intent to cancel
     */
    function cancelIntent(string memory intentId) 
        external 
        intentExists(intentId)
        onlySender(intentId) 
        returns (bool) 
    {
        PaymentIntent storage intent = intents[intentId];
        
        require(intent.status == IntentStatus.Pending, "KestrelIntent: Intent not pending");
        
        // Update status
        intent.status = IntentStatus.Cancelled;
        
        // Refund to sender
        (bool success, ) = intent.sender.call{value: intent.amount}("");
        require(success, "KestrelIntent: Refund failed");
        
        emit IntentCancelled(intentId, msg.sender);
        return true;
    }
    
    /**
     * @dev Check if execution conditions are met for an intent
     * @param intentId ID of the intent to check
     */
    function checkCondition(string memory intentId) 
        public 
        view 
        intentExists(intentId) 
        returns (bool) 
    {
        PaymentIntent storage intent = intents[intentId];
        
        if (intent.conditionType == ConditionType.Time) {
            return block.timestamp >= intent.conditionValue;
        } else if (intent.conditionType == ConditionType.GasPrice) {
            return tx.gasprice <= intent.conditionValue;
        } else if (intent.conditionType == ConditionType.Manual) {
            return true; // Manual execution always possible
        }
        
        return false;
    }
    
    /**
     * @dev Get all intent IDs for a user
     * @param user Address of the user
     */
    function getUserIntents(address user) external view returns (string[] memory) {
        return userIntents[user];
    }
    
    /**
     * @dev Get details of a specific intent
     * @param intentId ID of the intent
     */
    function getIntentDetails(string memory intentId) 
        external 
        view 
        intentExists(intentId) 
        returns (PaymentIntent memory) 
    {
        return intents[intentId];
    }
    
    /**
     * @dev Get contract balance (for emergency purposes)
     */
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    /**
     * @dev Emergency withdrawal function (owner only)
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "KestrelIntent: No funds to withdraw");
        
        (bool success, ) = owner.call{value: balance}("");
        require(success, "KestrelIntent: Withdrawal failed");
    }
    
    /**
     * @dev Receive function to accept ETH
     */
    receive() external payable {}
    
    /**
     * @dev Fallback function
     */
    fallback() external payable {}
}
