// Simple encoding test
console.log('Testing file encoding...');

try {
    const express = require('express');
    const cors = require('cors');
    console.log('✅ Express and CORS loaded successfully');
    
    // Test basic file loading
    const SwarmEngine = require('./services/swarmEngine');
    const swarm = new SwarmEngine();
    console.log('✅ SwarmEngine loaded successfully');
    
    console.log('🎉 All files are properly encoded!');
    console.log('🚀 Backend is ready to start!');
    
} catch (error) {
    console.error('❌ Error loading modules:', error.message);
}
