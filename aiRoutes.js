const express = require('express');
const { handleAIQuery } = require('../controllers/aiController');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

// @route   POST /api/ai/query
// @desc    Handle AI Chatbot Query
// @access  Private
router.post('/query', auth, handleAIQuery);

module.exports = router;
