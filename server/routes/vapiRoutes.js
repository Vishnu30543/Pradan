const express = require('express');
const router = express.Router();
const { handleToolCall } = require('../controllers/vapiController');

// Route for handling tool calls from Vapi
router.post('/tool-call', handleToolCall);

module.exports = router;
