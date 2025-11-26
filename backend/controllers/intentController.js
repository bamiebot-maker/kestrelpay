const SwarmEngine = require('../services/swarmEngine');

class IntentController {
    constructor() {
        this.swarmEngine = new SwarmEngine();
        
        // Mock data storage
        this.intents = new Map();
        this.analytics = {
            totalIntents: 0,
            executedIntents: 0,
            cancelledIntents: 0,
            totalVolume: 0,
            averageConfidence: 0
        };

        // Initialize with some sample data
        this.initializeSampleData();
        
        console.log('✅ IntentController initialized successfully');
    }

    initializeSampleData() {
        const sampleIntent = {
            id: 'sample-1',
            sender: '0xUser123...',
            receiver: '0xRecipient1...',
            amount: '0.5',
            token: 'ETH',
            conditionType: 'time',
            conditionValue: '2024-01-15T14:30',
            status: 'executed',
            createdAt: new Date().toISOString(),
            executedAt: new Date().toISOString(),
            swarmAnalysis: {
                confidence: 85,
                reason: 'Optimal gas prices'
            }
        };
        this.intents.set(sampleIntent.id, sampleIntent);
        this.analytics.totalIntents = 1;
        this.analytics.executedIntents = 1;
        this.analytics.totalVolume = 0.5;
        this.analytics.averageConfidence = 85;
    }
    
    async createIntent(req, res) {
        try {
            const { receiver, amount, conditionType, conditionValue } = req.body;
            
            // Validate input
            if (!receiver || !amount || conditionType === undefined) {
                return res.status(400).json({ error: 'Missing required fields' });
            }
            
            const intentData = {
                id: Date.now().toString(),
                sender: req.body.sender || '0xUserAddress',
                receiver,
                amount,
                conditionType,
                conditionValue,
                status: 'pending',
                createdAt: new Date().toISOString(),
                swarmAnalysis: null
            };
            
            // Store intent
            this.intents.set(intentData.id, intentData);
            this.analytics.totalIntents++;
            this.analytics.totalVolume += parseFloat(amount);
            
            // Initial swarm analysis
            const analysis = await this.swarmEngine.analyzeConditions(intentData);
            intentData.swarmAnalysis = analysis;
            
            res.json({
                success: true,
                intentId: intentData.id,
                swarmAnalysis: analysis,
                message: 'Intent created successfully'
            });
            
        } catch (error) {
            console.error('Error creating intent:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    
    async executeIntent(req, res) {
        try {
            const { id } = req.params;
            const intent = this.intents.get(id);
            
            if (!intent) {
                return res.status(404).json({ error: 'Intent not found' });
            }
            
            if (intent.status !== 'pending') {
                return res.status(400).json({ error: 'Intent not pending' });
            }
            
            // Final swarm check before execution
            const finalAnalysis = await this.swarmEngine.analyzeConditions(intent);
            
            if (!finalAnalysis.recommended) {
                return res.status(400).json({ 
                    error: 'Execution not recommended',
                    analysis: finalAnalysis 
                });
            }
            
            // Update intent status
            intent.status = 'executed';
            intent.executedAt = new Date().toISOString();
            intent.finalAnalysis = finalAnalysis;
            
            this.analytics.executedIntents++;
            
            console.log(`✅ Intent ${id} executed successfully`);
            
            res.json({
                success: true,
                intentId: id,
                analysis: finalAnalysis,
                message: 'Intent executed successfully'
            });
            
        } catch (error) {
            console.error('Error executing intent:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    
    getUserIntents(req, res) {
        try {
            const { address } = req.params;
            
            // Filter intents by user
            const userIntents = Array.from(this.intents.values())
                .filter(intent => intent.sender === address)
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            
            res.json({
                success: true,
                intents: userIntents,
                count: userIntents.length
            });
            
        } catch (error) {
            console.error('Error fetching user intents:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    
    getAnalytics(req, res) {
        try {
            const confidenceSum = Array.from(this.intents.values())
                .filter(intent => intent.swarmAnalysis)
                .reduce((sum, intent) => sum + intent.swarmAnalysis.confidence, 0);
            
            const intentCountWithAnalysis = Array.from(this.intents.values())
                .filter(intent => intent.swarmAnalysis).length;
            
            this.analytics.averageConfidence = intentCountWithAnalysis > 0 
                ? Math.round(confidenceSum / intentCountWithAnalysis) 
                : 0;
            
            res.json({
                success: true,
                analytics: this.analytics,
                swarmStatus: this.swarmEngine.getSwarmStatus()
            });
            
        } catch (error) {
            console.error('Error fetching analytics:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = new IntentController();
