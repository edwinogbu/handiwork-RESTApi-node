const mysql = require('mysql');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

dotenv.config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Helper function to execute SQL queries
function query(sql, args) {
    return new Promise((resolve, reject) => {
        connection.query(sql, args, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
}

// Create Users table if it doesn't exist
const createUsersTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        role ENUM('user', 'admin') DEFAULT 'user',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
        userType ENUM('SkillProvider', 'Customer') NOT NULL
    )
`;

connection.query(createUsersTableQuery, (err, result) => {
    if (err) {
        console.error('Error creating users table:', err);
        return;
    }
    console.log('Users table created successfully');
});

// CRUD operations for Users
exports.createUser = async (userData) => {
    try {
        const { username, password, email, role, userType } = userData;
        const hashedPassword = await bcrypt.hash(password, 12);
        const insertQuery = `
            INSERT INTO users (username, password, email, role, userType)
            VALUES (?, ?, ?, ?, ?)
        `;
        const result = await query(insertQuery, [username, hashedPassword, email, role, userType]);
        return { id: result.insertId, ...userData };
    } catch (error) {
        throw error;
    }
};

exports.getUserById = async (id) => {
    try {
        const selectQuery = 'SELECT * FROM users WHERE id = ?';
        const users = await query(selectQuery, [id]);
        return users[0];
    } catch (error) {
        throw error;
    }
};

exports.updateUser = async (id, updates) => {
    try {
        const updateQuery = `
            UPDATE users
            SET ?
            WHERE id = ?
        `;
        await query(updateQuery, [updates, id]);
        return { id, ...updates };
    } catch (error) {
        throw error;
    }
};

exports.deleteUser = async (id) => {
    try {
        const deleteQuery = 'DELETE FROM users WHERE id = ?';
        await query(deleteQuery, [id]);
        return { id };
    } catch (error) {
        throw error;
    }
};

// Export the connection for external use if needed
module.exports = connection;
