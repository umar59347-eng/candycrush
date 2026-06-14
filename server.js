const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API Routes
app.post('/api/score', (req, res) => {
    const { userId, score, level } = req.body;
    
    // یہاں اپنا database logic شامل کریں
    console.log(`User ${userId} scored ${score} at level ${level}`);
    
    res.json({ 
        success: true, 
        message: 'Score saved successfully',
        data: { userId, score, level }
    });
});

app.get('/api/leaderboard', (req, res) => {
    // یہاں leaderboard data شامل کریں
    res.json({
        success: true,
        leaderboard: [
            { rank: 1, name: 'Ali', score: 5000 },
            { rank: 2, name: 'Fatima', score: 4500 },
            { rank: 3, name: 'Hassan', score: 4000 }
        ]
    });
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ 
        success: false, 
        message: 'Server error',
        error: err.message 
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`
    ╔════════════════════════════════════════════════╗
    ║    🍬 Candy Crush - Telegram Mini App 🍬      ║
    ║                                                ║
    ║    Server running on:                          ║
    ║    http://localhost:${PORT}                      ║
    ║                                                ║
    ║    Open in Telegram Mini App:                  ║
    ║    https://t.me/your_bot_username?start=game   ║
    ╚════════════════════════════════════════════════╝
    `);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
    });
});
