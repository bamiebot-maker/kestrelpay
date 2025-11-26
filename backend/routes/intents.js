const express = require('express');
const router = express.Router();
const intentController = require('../controllers/intentController');

// Create new payment intent
router.post('/create', intentController.createIntent);

// Execute existing intent
router.post('/execute/:id', intentController.executeIntent);

// Get user's intents
router.get('/user/:address', intentController.getUserIntents);

// Get analytics overview
router.get('/analytics/overview', intentController.getAnalytics);

module.exports = router;
