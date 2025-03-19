const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

// Game save endpoints
router.post('/save', gameController.saveGame);
router.get('/save/:id', gameController.loadGame);
router.get('/saves', gameController.listSaves);
router.delete('/save/:id', gameController.deleteGame);

// Game state synchronization
router.post('/gamestate', gameController.syncGameState);

// Server status endpoint
router.get('/status', (req, res) => {
  res.json({
    status: 'online',
    time: new Date().toISOString(),
    uptime: process.uptime()
  });
});

module.exports = router; 