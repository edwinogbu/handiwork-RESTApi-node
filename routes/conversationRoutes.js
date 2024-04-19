// routes/conversationRoutes.js

const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversationController');

router.post('/conversations', conversationController.createConversation);
router.get('/conversations/:conversationId/messages', conversationController.getConversationMessages);
router.post('/conversations/:conversationId/messages', conversationController.createMessage);
router.put('/messages/:messageId', conversationController.updateMessage);
router.delete('/messages/:messageId', conversationController.deleteMessage);

module.exports = router;
