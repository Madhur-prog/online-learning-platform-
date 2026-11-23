const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');

// Stream endpoint for videos
router.get('/stream/:filename', videoController.streamVideo);
router.get('/:filename', videoController.streamVideo);

module.exports = router;
