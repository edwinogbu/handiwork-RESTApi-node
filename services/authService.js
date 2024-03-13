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

// Create Customers table if it doesn't exist
const createCustomersTableQuery = `
    CREATE TABLE IF NOT EXISTS customers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        firstName VARCHAR(255) NOT NULL,
        lastName VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        address VARCHAR(255),
        userId INT NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`;

connection.query(createCustomersTableQuery, (err, result) => {
    if (err) {
        console.error('Error creating customers table:', err);
        return;
    }
    console.log('Customers table created successfully');
});

// Function to sign JWT token
const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

// CRUD operations for Customers
const customerService = {};

customerService.createCustomer = async (customerData) => {
    try {
        const { firstName, lastName, email, password, phone, address } = customerData;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create new user
        const newUserQuery = 'INSERT INTO users (username, email, password, role, userType) VALUES (?, ?, ?, ?, ?)';
        const newUserResult = await query(newUserQuery, [email, email, hashedPassword, 'user', 'Customer']);

        // Generate JWT token
        const token = signToken(newUserResult.insertId);

        // Now that the user is created, insert customer data into the customers table
        const insertQuery = `
            INSERT INTO customers (firstName, lastName, email, password, phone, address, userId)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const result = await query(insertQuery, [firstName, lastName, email, hashedPassword, phone, address, newUserResult.insertId]);

        // Return the newly created customer data along with the user token
        return { id: result.insertId, token, ...customerData };
    } catch (error) {
        throw error;
    }
};

customerService.getCustomerById = async (id) => {
    try {
        const selectQuery = 'SELECT * FROM customers WHERE id = ?';
        const customers = await query(selectQuery, [id]);
        return customers[0];
    } catch (error) {
        throw error;
    }
};

customerService.getAllCustomers = async () => {
    try {
        const selectAllQuery = 'SELECT * FROM customers';
        const customers = await query(selectAllQuery);
        return customers;
    } catch (error) {
        throw error;
    }
};

customerService.updateCustomer = async (id, updates) => {
    try {
        const updateQuery = `
            UPDATE customers
            SET ?
            WHERE id = ?
        `;
        await query(updateQuery, [updates, id]);
        return { id, ...updates };
    } catch (error) {
        throw error;
    }
};

customerService.deleteCustomer = async (id) => {
    try {
        const deleteQuery = 'DELETE FROM customers WHERE id = ?';
        await query(deleteQuery, [id]);
        return { id };
    } catch (error) {
        throw error;
    }
};

// Export the customer service object
module.exports = customerService;


// const mysql = require('mysql');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const dotenv = require('dotenv');

// dotenv.config();

// const connection = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
// });

// // Helper function to execute SQL queries
// function query(sql, args) {
//     return new Promise((resolve, reject) => {
//         connection.query(sql, args, (err, rows) => {
//             if (err) return reject(err);
//             resolve(rows);
//         });
//     });
// }


// // Create users table if it doesn't exist
// const createUserTableQuery = `

//     CREATE TABLE IF NOT EXISTS users ( id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255) NOT NULL UNIQUE, password VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL UNIQUE, role ENUM('user', 'admin') DEFAULT 'user', createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updatedAt TIMESTAMP NULL DEFAULT NULL, userType ENUM('SkillProvider', 'Customer') NOT NULL );
// `;

// connection.query(createUserTableQuery, (err, result) => {
//     if (err) {
//         console.error('Error creating users table:', err);
//         return;
//     }
//     console.log('Users table created successfully');
// });



// // Function to sign JWT token
// const signToken = (id) => {
//     return jwt.sign({ id }, process.env.JWT_SECRET, {
//         expiresIn: process.env.JWT_EXPIRES_IN,
//     });
// };

// // Signup function
// exports.signup = async (username, password, email, role, userType) => {
//     try {
//         // Check if user with the same email already exists
//         const existingUserQuery = 'SELECT * FROM users WHERE email = ?';
//         const existingUser = await query(existingUserQuery, [email]);

//         if (existingUser.length > 0) {
//             throw new Error('User with this email already exists');
//         }

//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, 12);

//         // Create new user
//         const newUserQuery = 'INSERT INTO users (username, email, password, role, userType) VALUES (?, ?, ?, ?, ?)';
//         const newUser = await query(newUserQuery, [username, email, hashedPassword, role, userType]);

//         // Generate JWT token
//         const token = signToken(newUser.insertId);

//         return { token, user: { id: newUser.insertId, username, email, role, userType } };
//     } catch (error) {
//         throw error;
//     }
// };

// // Login function
// exports.login = async (email, password) => {
//     try {
//         // Find user by email
//         const userQuery = 'SELECT * FROM users WHERE email = ?';
//         const users = await query(userQuery, [email]);
//         const user = users[0];

//         // If user does not exist or password is incorrect, throw error
//         if (!user || !(await bcrypt.compare(password, user.password))) {
//             throw new Error('Incorrect email or password');
//         }

//         // Generate JWT token
//         const token = signToken(user.id);

//         return { token, user };
//     } catch (error) {
//         throw error;
//     }
// };


// module.exports = authService;





// const mysql = require('mysql');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const dotenv = require('dotenv');

// dotenv.config();

// const connection = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
// });

// const signToken = (id) => {
//     return jwt.sign({ id }, process.env.JWT_SECRET, {
//         expiresIn: process.env.JWT_EXPIRES_IN,
//     });
// };

// exports.signup = async (username, password, email, role, userType) => {
//     try {
//         // Check if user with the same email already exists
//         const existingUserQuery = 'SELECT * FROM users WHERE email = ?';
//         const existingUser = await query(existingUserQuery, [email]);

//         if (existingUser.length > 0) {
//             throw new Error('User with this email already exists');
//         }

//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, 12);

//         // Create new user
//         const newUserQuery = 'INSERT INTO users (username, email, password, role, userType) VALUES (?, ?, ?, ?, ?)';
//         const newUser = await query(newUserQuery, [username, email, hashedPassword, role, userType]);

//         // Generate JWT token
//         const token = signToken(newUser.insertId);

//         return { token, user: { id: newUser.insertId, username, email, role, userType } };
//     } catch (error) {
//         throw error;
//     }
// };

// exports.login = async (email, password) => {
//     try {
//         // Find user by email
//         const userQuery = 'SELECT * FROM users WHERE email = ?';
//         const users = await query(userQuery, [email]);
//         const user = users[0];

//         // If user does not exist or password is incorrect, throw error
//         if (!user || !(await bcrypt.compare(password, user.password))) {
//             throw new Error('Incorrect email or password');
//         }

//         // Generate JWT token
//         const token = signToken(user.id);

//         return { token, user };
//     } catch (error) {
//         throw error;
//     }
// };

// function query(sql, args) {
//     return new Promise((resolve, reject) => {
//         connection.query(sql, args, (err, rows) => {
//             if (err) return reject(err);
//             resolve(rows);
//         });
//     });
// }
