

const { query } = require('./db');

// Function to create conversations table if not exists
const createConversationsTableQuery = `
    CREATE TABLE IF NOT EXISTS conversations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        participants JSON NOT NULL
    )
`;

// Function to create messages table if not exists
const createMessagesTableQuery = `
    CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        conversation_id INT NOT NULL,
        sender_id INT NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (conversation_id) REFERENCES conversations(id)
    )
`;

// Execute table creation queries
(async () => {
    try {
        await query(createConversationsTableQuery);
        await query(createMessagesTableQuery);
        console.log('Tables created successfully');
    } catch (error) {
        console.error('Error creating tables:', error);
    }
})();

exports.createConversation = async (participants) => {
    try {
        // Insert conversation into the database
        const insertConversationQuery = 'INSERT INTO conversations (participants) VALUES (?)';
        const result = await query(insertConversationQuery, [JSON.stringify(participants)]);

        // Return the ID of the newly created conversation
        return result.insertId;
    } catch (error) {
        throw error;
    }
};

exports.getConversationMessages = async (conversationId) => {
    try {
        // Retrieve messages for the specified conversation ID
        const selectMessagesQuery = 'SELECT * FROM messages WHERE conversation_id = ?';
        const messages = await query(selectMessagesQuery, [conversationId]);
        
        return messages;
    } catch (error) {
        throw error;
    }
};

exports.createMessage = async (conversationId, senderId, content) => {
    try {
        // Insert message into the database
        const insertMessageQuery = 'INSERT INTO messages (conversation_id, sender_id, content) VALUES (?, ?, ?)';
        const result = await query(insertMessageQuery, [conversationId, senderId, content]);

        // Return the ID of the newly created message
        return result.insertId;
    } catch (error) {
        throw error;
    }
};

exports.updateMessage = async (messageId, content) => {
    try {
        // Update message content in the database
        const updateMessageQuery = 'UPDATE messages SET content = ? WHERE id = ?';
        await query(updateMessageQuery, [content, messageId]);
    } catch (error) {
        throw error;
    }
};

exports.deleteMessage = async (messageId) => {
    try {
        // Delete message from the database
        const deleteMessageQuery = 'DELETE FROM messages WHERE id = ?';
        await query(deleteMessageQuery, [messageId]);
    } catch (error) {
        throw error;
    }
};
