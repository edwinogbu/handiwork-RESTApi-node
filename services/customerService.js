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
            secondPhone VARCHAR(20),
            stateOfResidence VARCHAR(255) NOT NULL,
            city VARCHAR(255) NOT NULL,
            street VARCHAR(255) NOT NULL,
            address VARCHAR(255),
            imagePath VARCHAR(255),
            userId INT NOT NULL,
            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
`;

// Create Users table if it doesn't exist
const createUsersTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        phone VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
        userType ENUM('Customer', 'Provider') NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`;

// Create tables if they don't exist
connection.query(createUsersTableQuery, (err, result) => {
    if (err) {
        console.error('Error creating users table:', err);
        return;
    }
    console.log('Users table created successfully');
});

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
        const { firstName, lastName, email, password, phone, secondPhone, stateOfResidence, city, street, imagePath } = customerData;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Construct full address
        const address = `${street}, ${city}, ${stateOfResidence}`; // Correct order for address components

        const username = `${firstName}, ${lastName}`;
        // const { latitude, longitude } = await geocodeAddress(address);

     

        // Create new user
        const newUserQuery = 'INSERT INTO users (username, email, phone, password, role, userType) VALUES (?, ?, ?, ?, ?, ?)';
        const newUserResult = await query(newUserQuery, [username, email, phone, hashedPassword, 'user', 'Customer']);

        // Check if user insertion was successful
        if (!newUserResult.insertId) {
            throw new Error('Failed to insert user');
        }

        // Generate JWT token
        const token = signToken(newUserResult.insertId);

        // Insert customer data into the customers table
        const insertQuery = `
            INSERT INTO customers (firstName, lastName, email, password, phone, secondPhone, stateOfResidence, city, street, address, imagePath, userId)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const result = await query(insertQuery, [firstName, lastName, email, hashedPassword, phone, secondPhone, stateOfResidence, city, street, address, imagePath, newUserResult.insertId]);

        // Check if customer insertion was successful
        if (!result.insertId) {
            throw new Error('Failed to insert customer');
        }

        // Return the newly created customer data along with the user token
        return { id: result.insertId, token, ...customerData, address };
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

        // Check if customers array is empty
        if (customers.length === 0) {
            return { message: "Customers table is empty" };
        }

        return customers;
    } catch (error) {
        throw error;
    }
};



customerService.updateCustomerWithImage = async (customerId, customerData) => {
    try {
        // Retrieve current customer data from the database
        const currentCustomer = await customerService.getCustomerById(customerId);
        if (!currentCustomer) {
            throw new Error('Customer not found');
        }

        // Check for changes in customer data
        const updatedCustomerData = { ...currentCustomer, ...customerData };
        const hasChanges = Object.keys(updatedCustomerData).some(key => updatedCustomerData[key] !== currentCustomer[key]);

        if (!hasChanges) {
            // No changes made, return current customer data
            return currentCustomer;
        }

        // Prepare update query based on changed fields
        const updateFields = Object.entries(customerData).filter(([key, value]) => value !== currentCustomer[key]);
        const updateValues = updateFields.map(([key, value]) => `${key}=?`).join(', ');
        const updateParams = updateFields.map(([key, value]) => value);

        // Add imagePath to updateParams
        updateParams.push(customerData.imagePath);

        // Update customer data in the database
        const updateQuery = `
            UPDATE customers 
            SET ${updateValues}, imagePath=?
            WHERE id=?
        `;
        await query(updateQuery, [...updateParams, customerId]);

        // Return updated customer data
        return { ...currentCustomer, ...customerData };
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

// // Create Customers table if it doesn't exist
// const createCustomersTableQuery = `
//     CREATE TABLE IF NOT EXISTS customers (
//         id INT AUTO_INCREMENT PRIMARY KEY,
//         firstName VARCHAR(255) NOT NULL,
//         lastName VARCHAR(255) NOT NULL,
//         email VARCHAR(255) NOT NULL UNIQUE,
//         password VARCHAR(255) NOT NULL,
//         phone VARCHAR(20),
//         address VARCHAR(255),
//         userId INT NOT NULL,
//         FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
//         createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//     )
// `;

// // Create Users table if it doesn't exist
// const createUsersTableQuery = `
//     CREATE TABLE IF NOT EXISTS users (
//         id INT AUTO_INCREMENT PRIMARY KEY,
//         username VARCHAR(255) NOT NULL UNIQUE,
//         email VARCHAR(255) NOT NULL UNIQUE,
//         password VARCHAR(255) NOT NULL,
//         role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
//         userType ENUM('Customer', 'Provider') NOT NULL,
//         createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//     )
// `;

// // Create tables if they don't exist
// connection.query(createUsersTableQuery, (err, result) => {
//     if (err) {
//         console.error('Error creating users table:', err);
//         return;
//     }
//     console.log('Users table created successfully');
// });

// connection.query(createCustomersTableQuery, (err, result) => {
//     if (err) {
//         console.error('Error creating customers table:', err);
//         return;
//     }
//     console.log('Customers table created successfully');
// });

// // Function to sign JWT token
// const signToken = (id) => {
//     return jwt.sign({ id }, process.env.JWT_SECRET, {
//         expiresIn: process.env.JWT_EXPIRES_IN,
//     });
// };

// // CRUD operations for Customers
// const customerService = {};

// customerService.createCustomer = async (customerData) => {
//     try {
//         const { firstName, lastName, email, password, phone, address } = customerData;

//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, 12);

//         // Create new user
//         const newUserQuery = 'INSERT INTO users (username, email, password, role, userType) VALUES (?, ?, ?, ?, ?)';
//         const newUserResult = await query(newUserQuery, [email, email, hashedPassword, 'user', 'Customer']);

//         // Check if user insertion was successful
//         if (!newUserResult.insertId) {
//             throw new Error('Failed to insert user');
//         }

//         // Generate JWT token
//         const token = signToken(newUserResult.insertId);

//         // Insert customer data into the customers table
//         const insertQuery = `
//             INSERT INTO customers (firstName, lastName, email, password, phone, address, userId)
//             VALUES (?, ?, ?, ?, ?, ?, ?)
//         `;
//         const result = await query(insertQuery, [firstName, lastName, email, hashedPassword, phone, address, newUserResult.insertId]);

//         // Check if customer insertion was successful
//         if (!result.insertId) {
//             throw new Error('Failed to insert customer');
//         }

//         // Return the newly created customer data along with the user token
//         return { id: result.insertId, token, ...customerData };
//     } catch (error) {
//         throw error;
//     }
// };

// customerService.getCustomerById = async (id) => {
//     try {
//         const selectQuery = 'SELECT * FROM customers WHERE id = ?';
//         const customers = await query(selectQuery, [id]);
//         return customers[0];
//     } catch (error) {
//         throw error;
//     }
// };


// customerService.getAllCustomers = async () => {
//     try {
//         const selectAllQuery = 'SELECT * FROM customers';
//         const customers = await query(selectAllQuery);

//         // Check if customers array is empty
//         if (customers.length === 0) {
//             return { message: "Customers table is empty" };
//         }

//         return customers;
//     } catch (error) {
//         throw error;
//     }
// };



// customerService.updateCustomer = async (id, updates) => {
//     try {
//         const updateQuery = `
//             UPDATE customers
//             SET ?
//             WHERE id = ?
//         `;
//         await query(updateQuery, [updates, id]);
//         return { id, ...updates };
//     } catch (error) {
//         throw error;
//     }
// };

// customerService.deleteCustomer = async (id) => {
//     try {
//         const deleteQuery = 'DELETE FROM customers WHERE id = ?';
//         await query(deleteQuery, [id]);
//         return { id };
//     } catch (error) {
//         throw error;
//     }
// };

// // Export the customer service object
// module.exports = customerService;



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

// // Create Customers table if it doesn't exist
// const createCustomersTableQuery = `
//     CREATE TABLE IF NOT EXISTS customers (
//         id INT AUTO_INCREMENT PRIMARY KEY,
//         firstName VARCHAR(255) NOT NULL,
//         lastName VARCHAR(255) NOT NULL,
//         email VARCHAR(255) NOT NULL UNIQUE,
//         password VARCHAR(255) NOT NULL,
//         phone VARCHAR(20),
//         address VARCHAR(255),
//         userId INT NOT NULL,
//         imagePath VARCHAR(255), // New column for storing image path
//         FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
//         createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//     )
// `;

// // Create Users table if it doesn't exist
// const createUsersTableQuery = `
//     CREATE TABLE IF NOT EXISTS users (
//         id INT AUTO_INCREMENT PRIMARY KEY,
//         username VARCHAR(255) NOT NULL UNIQUE,
//         email VARCHAR(255) NOT NULL UNIQUE,
//         password VARCHAR(255) NOT NULL,
//         role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
//         userType ENUM('Customer', 'Provider') NOT NULL,
//         createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//     )
// `;

// // Create tables if they don't exist
// connection.query(createUsersTableQuery, (err, result) => {
//     if (err) {
//         console.error('Error creating users table:', err);
//         return;
//     }
//     console.log('Users table created successfully');
// });

// connection.query(createCustomersTableQuery, (err, result) => {
//     if (err) {
//         console.error('Error creating customers table:', err);
//         return;
//     }
//     console.log('Customers table created successfully');
// });

// // Function to sign JWT token
// const signToken = (id) => {
//     return jwt.sign({ id }, process.env.JWT_SECRET, {
//         expiresIn: process.env.JWT_EXPIRES_IN,
//     });
// };

// // CRUD operations for Customers
// const customerService = {};

// customerService.createCustomer = async (customerData) => {
//     try {
//         const { firstName, lastName, email, password, phone, address, imagePath } = customerData;

//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, 12);

//         // Create new user
//         const newUserQuery = 'INSERT INTO users (username, email, password, role, userType) VALUES (?, ?, ?, ?, ?)';
//         const newUserResult = await query(newUserQuery, [email, email, hashedPassword, 'user', 'Customer']);

//         // Check if user insertion was successful
//         if (!newUserResult.insertId) {
//             throw new Error('Failed to insert user');
//         }

//         // Generate JWT token
//         const token = signToken(newUserResult.insertId);

//         // Insert customer data into the customers table
//         const insertQuery = `
//             INSERT INTO customers (firstName, lastName, email, password, phone, address, userId, imagePath)
//             VALUES (?, ?, ?, ?, ?, ?, ?, ?)
//         `;
//         const result = await query(insertQuery, [firstName, lastName, email, hashedPassword, phone, address, newUserResult.insertId, imagePath]);

//         // Check if customer insertion was successful
//         if (!result.insertId) {
//             throw new Error('Failed to insert customer');
//         }

//         // Return the newly created customer data along with the user token
//         return { id: result.insertId, token, ...customerData };
//     } catch (error) {
//         throw error;
//     }
// };

// customerService.getCustomerById = async (id) => {
//     try {
//         const selectQuery = 'SELECT * FROM customers WHERE id = ?';
//         const customers = await query(selectQuery, [id]);
//         return customers[0];
//     } catch (error) {
//         throw error;
//     }
// };

// customerService.getAllCustomers = async () => {
//     try {
//         const selectAllQuery = 'SELECT * FROM customers';
//         const customers = await query(selectAllQuery);

//         // Check if customers array is empty
//         if (customers.length === 0) {
//             return { message: "Customers table is empty" };
//         }

//         return customers;
//     } catch (error) {
//         throw error;
//     }
// };

// customerService.updateCustomer = async (id, updates) => {
//     try {
//         const updateQuery = `
//             UPDATE customers
//             SET ?
//             WHERE id = ?
//         `;
//         await query(updateQuery, [updates, id]);
//         return { id, ...updates };
//     } catch (error) {
//         throw error;
//     }
// };

// customerService.deleteCustomer = async (id) => {
//     try {
//         const deleteQuery = 'DELETE FROM customers WHERE id = ?';
//         await query(deleteQuery, [id]);
//         return { id };
//     } catch (error) {
//         throw error;
//     }
// };

// module.exports = customerService;
