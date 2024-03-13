const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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

// Function to sign JWT token
const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

const authUserService = {};

authUserService.login = async (email, password) => {
    try {
        // Check if user with the provided email exists
        const selectUserQuery = 'SELECT * FROM users WHERE email = ?';
        const users = await query(selectUserQuery, [email]);

        if (users.length === 0) {
            throw new Error('User not found');
        }

        const user = users[0];

        // Compare the provided password with the hashed password stored in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }

        // Generate JWT token
        const token = signToken(user.id);

        // Remove sensitive data from the user object
        delete user.password;

        // Return user details along with the JWT token
        return { token, user };
    } catch (error) {
        throw error;
    }
};

module.exports = authUserService;
