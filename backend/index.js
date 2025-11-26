<<<<<<< HEAD
﻿const express = require('express');
const cors = require('cors');
const { ethers } = require('ethers');
const intentRoutes = require('./routes/intents');
const swarmRoutes = require('./routes/swarm');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/intents', intentRoutes);
app.use('/api/swarm', swarmRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        service: 'KestrelPay Backend',
        version: '2.0.0'
    });
});

app.listen(PORT, () => {
    console.log(`🚀 KestrelPay Backend running on port ${PORT}`);
    console.log(`🌊 Swarm Intelligence Engine: ACTIVE`);
    console.log(`💧 LiquidFlow Mode: ENABLED`);
});

module.exports = app;
=======
﻿console.log("Backend running placeholder");
>>>>>>> 856f61e275851dd523fe1640a39e18dae4942d86
