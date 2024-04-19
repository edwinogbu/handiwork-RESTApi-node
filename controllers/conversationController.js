// controllers/conversationController.js

const conversationService = require('../services/conversationService');

exports.createConversation = async (req, res) => {
    try {
        const { participants } = req.body;

        // Create conversation
        const conversationId = await conversationService.createConversation(participants);
        
        res.status(201).json({ conversationId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getConversationMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;

        // Retrieve messages for the conversation
        const messages = await conversationService.getConversationMessages(conversationId);
        
        res.status(200).json({ messages });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.createMessage = async (req, res) => {
    try {
        const { conversationId, senderId, content } = req.body;

        // Send message
        const messageId = await conversationService.createMessage(conversationId, senderId, content);
        
        res.status(201).json({ messageId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.updateMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const { content } = req.body;

        // Update message
        await conversationService.updateMessage(messageId, content);
        
        res.status(200).json({ message: 'Message updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;

        // Delete message
        await conversationService.deleteMessage(messageId);
        
        res.status(200).json({ message: 'Message deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
// services/conversationService.js
