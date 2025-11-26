const express = require('express');
const router = express.Router();
const SwarmEngine = require('../services/swarmEngine');

const swarmEngine = new SwarmEngine();

// Get swarm status
router.get('/status', (req, res) => {
    try {
        const status = swarmEngine.getSwarmStatus();
        res.json({
            success: true,
            status: status
        });
    } catch (error) {
        console.error('Error getting swarm status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get execution recommendation
router.get('/recommendation', async (req, res) => {
    try {
        const { intentData } = req.query;
        const parsedData = intentData ? JSON.parse(intentData) : {};
        
        const recommendation = await swarmEngine.analyzeConditions(parsedData);
        
        res.json({
            success: true,
            recommendation: recommendation
        });
    } catch (error) {
        console.error('Error getting recommendation:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
