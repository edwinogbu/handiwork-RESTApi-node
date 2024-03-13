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
        imagePath VARCHAR(255),
        userId INT NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`;

// Create Users table if it doesn't exist
const createUsersTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
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
        const { firstName, lastName, email, password, phone, address, image } = customerData;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create new user
        const newUserQuery = 'INSERT INTO users (username, email, password, role, userType) VALUES (?, ?, ?, ?, ?)';
        const newUserResult = await query(newUserQuery, [email, email, hashedPassword, 'user', 'Customer']);

        // Check if user insertion was successful
        if (!newUserResult.insertId) {
            throw new Error('Failed to insert user');
        }

        // Generate JWT token
        const token = signToken(newUserResult.insertId);

        // Insert customer data into the customers table
        const insertQuery = `
            INSERT INTO customers (firstName, lastName, email, password, phone, address, userId, image)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const result = await query(insertQuery, [firstName, lastName, email, hashedPassword, phone, address, newUserResult.insertId, image]);

        // Check if customer insertion was successful
        if (!result.insertId) {
            throw new Error('Failed to insert customer');
        }

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

        // Check if customers array is empty
        if (customers.length === 0) {
            return { message: "Customers table is empty" };
        }

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

module.exports = customerService;

// const mysql = require('mysql');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const dotenv = require('dotenv');
// const multer = require('multer');
// const path = require('path');

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
//         fileId INT,
//         userId INT NOT NULL,
//         FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
//         FOREIGN KEY (fileId) REFERENCES files(id) ON DELETE SET NULL,
//         createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//     )
// `;

// // Create Files table if it doesn't exist
// const createFilesTableQuery = `
//     CREATE TABLE IF NOT EXISTS files (
//         id INT AUTO_INCREMENT PRIMARY KEY,
//         filename VARCHAR(255) NOT NULL,
//         path VARCHAR(255) NOT NULL,
//         createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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

// connection.query(createFilesTableQuery, (err, result) => {
//     if (err) {
//         console.error('Error creating files table:', err);
//         return;
//     }
//     console.log('Files table created successfully');
// });

// // Function to sign JWT token
// const signToken = (id) => {
//     return jwt.sign({ id }, process.env.JWT_SECRET, {
//         expiresIn: process.env.JWT_EXPIRES_IN,
//     });
// };

// // Helper function for image upload
// const uploadImage = async (file) => {
//     try {
//         const newFileQuery = 'INSERT INTO files (filename, path) VALUES (?, ?)';
//         const newFileResult = await query(newFileQuery, [file.originalname, file.path]);
//         return newFileResult.insertId;
//     } catch (error) {
//         throw error;
//     }
// };

// // Middleware for customer image upload
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/'); // Define the destination folder for uploaded files
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + '-' + file.originalname); // Define the file name for the uploaded file
//     }
// });

// const upload = multer({
//     storage: storage,
//     limits: {
//         fileSize: 1024 * 1024 * 50 // Set file size limit (50MB in this example)
//     },
//     fileFilter: (req, file, cb) => {
//         checkFileType(file, cb);
//     }
// }).single('file');

// function checkFileType(file, cb) {
//     // Allowed file extensions
//     const filetypes = /jpeg|jpg|png|gif/;
//     // Check the file extension
//     const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//     // Check the MIME type
//     const mimetype = filetypes.test(file.mimetype);

//     if (mimetype && extname) {
//         return cb(null, true);
//     } else {
//         cb('Error: Invalid file type!');
//     }
// }

// // CRUD operations for Customers
// const customerService = {};

// customerService.createCustomerWithOutImage = async (customerData) => {
//     try {
//         const { firstName, lastName, email, password, phone, address } = customerData;

//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, 12);

//         // Create new user
//         const newUserQuery = 'INSERT INTO users (username, email, password, role, userType) VALUES (?, ?, ?, ?, ?)';
//         const newUserResult = await query(newUserQuery, [email, email, hashedPassword, 'user', 'Customer']);

//         // Generate JWT token
//         const token = signToken(newUserResult.insertId);

//         // Now that the user is created, insert customer data into the customers table
//         const insertQuery = `
//             INSERT INTO customers (firstName, lastName, email, password, phone, address, userId)
//             VALUES (?, ?, ?, ?, ?, ?, ?)
//         `;
//         const result = await query(insertQuery, [firstName, lastName, email, hashedPassword, phone, address, newUserResult.insertId]);

//         // Return the newly created customer data along with the user token
//         return { id: result.insertId, token, ...customerData };
//     } catch (error) {
//         throw error;
//     }
// };

// customerService.createCustomerProfileWithImage = async (customerData, imageFile) => {
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

//         // Upload customer image and get file ID
//         let fileId = null;
//         if (imageFile) {
//             fileId = await uploadImage(imageFile);
//         }

//         // Insert customer data into the customers table
//         const insertQuery = `
//             INSERT INTO customers (firstName, lastName, email, password, phone, address, fileId, userId)
//             VALUES (?, ?, ?, ?, ?, ?, ?, ?)
//         `;
//         const result = await query(insertQuery, [firstName, lastName, email, hashedPassword, phone, address, fileId, newUserResult.insertId]);

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

// // Get customer profile by ID
// customerService.getCustomerProfile = async (id) => {
//     try {
//         const selectQuery = 'SELECT * FROM customers WHERE id = ?';
//         const customers = await query(selectQuery, [id]);
//         return customers[0];
//     } catch (error) {
//         throw error;
//     }
// };

// // Get profiles for all customers
// customerService.getAllCustomersProfile = async () => {
//     try {
//         const selectAllQuery = 'SELECT * FROM customers';
//         const customers = await query(selectAllQuery);
//         const profiles = customers.map(customer => {
//             const { id, firstName, lastName, email, phone, address, imagePath } = customer;
//             return { id, firstName, lastName, email, phone, address, imagePath };
//         });
//         return profiles;
//     } catch (error) {
//         throw error;
//     }
// };

// module.exports = customerService;



// const mysql = require('mysql');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const dotenv = require('dotenv');
// const multer = require('multer');
// const path = require('path');

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
//         fileId INT,
//         userId INT NOT NULL,
//         FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
//         FOREIGN KEY (fileId) REFERENCES files(id) ON DELETE SET NULL,
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

// // Create Files table if it doesn't exist
// const createFilesTableQuery = `
//     CREATE TABLE IF NOT EXISTS files (
//         id INT AUTO_INCREMENT PRIMARY KEY,
//         filename VARCHAR(255) NOT NULL,
//         path VARCHAR(255) NOT NULL,
//         createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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

// connection.query(createFilesTableQuery, (err, result) => {
//     if (err) {
//         console.error('Error creating files table:', err);
//         return;
//     }
//     console.log('Files table created successfully');
// });

// // Function to sign JWT token
// const signToken = (id) => {
//     return jwt.sign({ id }, process.env.JWT_SECRET, {
//         expiresIn: process.env.JWT_EXPIRES_IN,
//     });
// };

// // Helper function for image upload
// const uploadImage = async (file) => {
//     try {
//         const newFileQuery = 'INSERT INTO files (filename, path) VALUES (?, ?)';
//         const newFileResult = await query(newFileQuery, [file.originalname, file.path]);
//         return newFileResult.insertId;
//     } catch (error) {
//         throw error;
//     }
// };

// // Middleware for customer image upload
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/'); // Define the destination folder for uploaded files
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + '-' + file.originalname); // Define the file name for the uploaded file
//     }
// });

// const upload = multer({
//     storage: storage,
//     limits: {
//         fileSize: 1024 * 1024 * 50 // Set file size limit (50MB in this example)
//     },
//     fileFilter: (req, file, cb) => {
//         checkFileType(file, cb);
//     }
// }).single('file');

// function checkFileType(file, cb) {
//     // Allowed file extensions
//     const filetypes = /jpeg|jpg|png|gif/;
//     // Check the file extension
//     const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//     // Check the MIME type
//     const mimetype = filetypes.test(file.mimetype);

//     if (mimetype && extname) {
//         return cb(null, true);
//     } else {
//         cb('Error: Invalid file type!');
//     }
// }

// // CRUD operations for Customers
// const customerService = {};

// customerService.createCustomerWithOutImage = async (customerData) => {
//     try {
//         const { firstName, lastName, email, password, phone, address } = customerData;

//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, 12);

//         // Create new user
//         const newUserQuery = 'INSERT INTO users (username, email, password, role, userType) VALUES (?, ?, ?, ?, ?)';
//         const newUserResult = await query(newUserQuery, [email, email, hashedPassword, 'user', 'Customer']);

//         // Generate JWT token
//         const token = signToken(newUserResult.insertId);

//         // Now that the user is created, insert customer data into the customers table
//         const insertQuery = `
//             INSERT INTO customers (firstName, lastName, email, password, phone, address, userId)
//             VALUES (?, ?, ?, ?, ?, ?, ?)
//         `;
//         const result = await query(insertQuery, [firstName, lastName, email, hashedPassword, phone, address, newUserResult.insertId]);

//         // Return the newly created customer data along with the user token
//         return { id: result.insertId, token, ...customerData };
//     } catch (error) {
//         throw error;
//     }
// };

// customerService.createCustomerProfileWithImage = async (customerData, imageFile) => {
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

//         // Upload customer image and get file ID
//         let fileId = null;
//         if (imageFile) {
//             fileId = await uploadImage(imageFile);
//         }

//         // Insert customer data into the customers table
//         const insertQuery = `
//             INSERT INTO customers (firstName, lastName, email, password, phone, address, fileId, userId)
//             VALUES (?, ?, ?, ?, ?, ?, ?, ?)
//         `;
//         const result = await query(insertQuery, [firstName, lastName, email, hashedPassword, phone, address, fileId, newUserResult.insertId]);

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

// // Get customer profile by ID
// customerService.getCustomerProfile = async (id) => {
//     try {
//         const selectQuery = 'SELECT * FROM customers WHERE id = ?';
//         const customers = await query(selectQuery, [id]);
//         return customers[0];
//     } catch (error) {
//         throw error;
//     }
// };

// // Get profiles for all customers
// customerService.getAllCustomersProfile = async () => {
//     try {
//         const selectAllQuery = 'SELECT * FROM customers';
//         const customers = await query(selectAllQuery);
//         const profiles = customers.map(customer => {
//             const { id, firstName, lastName, email, phone, address, imagePath } = customer;
//             return { id, firstName, lastName, email, phone, address, imagePath };
//         });
//         return profiles;
//     } catch (error) {
//         throw error;
//     }
// };

// module.exports = customerService;


// const mysql = require('mysql');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const dotenv = require('dotenv');
// const multer = require('multer');
// const path = require('path');

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
//         imagePath VARCHAR(255), 
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

// // Middleware for customer image upload
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/'); // Define the destination folder for uploaded files
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + '-' + file.originalname); // Define the file name for the uploaded file
//     }
// });

// const upload = multer({
//     storage: storage,
//     limits: {
//         fileSize: 1024 * 1024 * 50 // Set file size limit (50MB in this example)
//     },
//     fileFilter: (req, file, cb) => {
//         checkFileType(file, cb);
//     }
// }).single('file');

// function checkFileType(file, cb) {
//     // Allowed file extensions
//     const filetypes = /jpeg|jpg|png|gif/;
//     // Check the file extension
//     const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//     // Check the MIME type
//     const mimetype = filetypes.test(file.mimetype);

//     if (mimetype && extname) {
//         return cb(null, true);
//     } else {
//         cb('Error: Invalid file type!');
//     }
// }

// // CRUD operations for Customers
// const customerService = {};




// customerService.createCustomerWithOutImage = async (customerData) => {
//     try {
//         const { firstName, lastName, email, password, phone, address } = customerData;

//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, 12);

//         // Create new user
//         const newUserQuery = 'INSERT INTO users (username, email, password, role, userType) VALUES (?, ?, ?, ?, ?)';
//         const newUserResult = await query(newUserQuery, [email, email, hashedPassword, 'user', 'Customer']);

//         // Generate JWT token
//         const token = signToken(newUserResult.insertId);

//         // Now that the user is created, insert customer data into the customers table
//         const insertQuery = `
//             INSERT INTO customers (firstName, lastName, email, password, phone, address, userId)
//             VALUES (?, ?, ?, ?, ?, ?, ?)
//         `;
//         const result = await query(insertQuery, [firstName, lastName, email, hashedPassword, phone, address, newUserResult.insertId]);

//         // Return the newly created customer data along with the user token
//         return { id: result.insertId, token, ...customerData };
//     } catch (error) {
//         throw error;
//     }
// };




// customerService.createCustomerProfileWithImage = async (customerData, imageFile) => {
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

//         // Upload customer image
//         let imagePath = null;
//         if (imageFile) {
//             imagePath = imageFile.path;
//         }

//         // Insert customer data into the customers table
//         const insertQuery = `
//             INSERT INTO customers (firstName, lastName, email, password, phone, address, imagePath, userId)
//             VALUES (?, ?, ?, ?, ?, ?, ?, ?)
//         `;
//         const result = await query(insertQuery, [firstName, lastName, email, hashedPassword, phone, address, imagePath, newUserResult.insertId]);

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

// // Get customer profile by ID
// customerService.getCustomerProfile = async (id) => {
//     try {
//         const selectQuery = 'SELECT * FROM customers WHERE id = ?';
//         const customers = await query(selectQuery, [id]);
//         return customers[0];
//     } catch (error) {
//         throw error;
//     }
// };

// // Get profiles for all customers
// customerService.getAllCustomersProfile = async () => {
//     try {
//         const selectAllQuery = 'SELECT * FROM customers';
//         const customers = await query(selectAllQuery);
//         const profiles = customers.map(customer => {
//             const { id, firstName, lastName, email, phone, address, imagePath } = customer;
//             return { id, firstName, lastName, email, phone, address, imagePath };
//         });
//         return profiles;
//     } catch (error) {
//         throw error;
//     }
// };

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

//         console.log('Password:', password); // Check the value of password

//         if (!password || typeof password !== 'string') {
//             throw new Error('Password is missing or invalid');
//         }

//         // Generate a salt
//         const salt = await bcrypt.genSalt(10);
//         console.log('Salt:', salt); // Check the generated salt

//         // Hash the password with the generated salt
//         const hashedPassword = await bcrypt.hash(password, salt);

//         console.log('Hashed Password:', hashedPassword); // Check the hashed password

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




// // customerService.createCustomer = async (customerData) => {
// //     try {
// //         const { firstName, lastName, email, password, phone, address } = customerData;

// //         console.log('Password:', password); // Check the value of password

// //         if (!password || typeof password !== 'string') {
// //             throw new Error('Password is missing or invalid');
// //         }

// //         // Hash the password
// //         const hashedPassword = await bcrypt.hash(password, 12);

// //         console.log('Hashed Password:', hashedPassword); // Check the hashed password

// //         // Create new user
// //         const newUserQuery = 'INSERT INTO users (username, email, password, role, userType) VALUES (?, ?, ?, ?, ?)';
// //         const newUserResult = await query(newUserQuery, [email, email, hashedPassword, 'user', 'Customer']);

// //         // Check if user insertion was successful
// //         if (!newUserResult.insertId) {
// //             throw new Error('Failed to insert user');
// //         }

// //         // Generate JWT token
// //         const token = signToken(newUserResult.insertId);

// //         // Insert customer data into the customers table
// //         const insertQuery = `
// //             INSERT INTO customers (firstName, lastName, email, password, phone, address, userId)
// //             VALUES (?, ?, ?, ?, ?, ?, ?)
// //         `;
// //         const result = await query(insertQuery, [firstName, lastName, email, hashedPassword, phone, address, newUserResult.insertId]);

// //         // Check if customer insertion was successful
// //         if (!result.insertId) {
// //             throw new Error('Failed to insert customer');
// //         }

// //         // Return the newly created customer data along with the user token
// //         return { id: result.insertId, token, ...customerData };
// //     } catch (error) {
// //         throw error;
// //     }
// // };


// // customerService.createCustomer = async (customerData) => {
// //     try {
// //         const { firstName, lastName, email, password, phone, address } = customerData;

// //         if (!password || typeof password !== 'string') {
// //             throw new Error('Password is missing or invalid');
// //         }

// //         // Hash the password
// //         const hashedPassword = await bcrypt.hash(password, 12);

// //         // Create new user
// //         const newUserQuery = 'INSERT INTO users (username, email, password, role, userType) VALUES (?, ?, ?, ?, ?)';
// //         const newUserResult = await query(newUserQuery, [email, email, hashedPassword, 'user', 'Customer']);

// //         // Check if user insertion was successful
// //         if (!newUserResult.insertId) {
// //             throw new Error('Failed to insert user');
// //         }

// //         // Generate JWT token
// //         const token = signToken(newUserResult.insertId);

// //         // Insert customer data into the customers table
// //         const insertQuery = `
// //             INSERT INTO customers (firstName, lastName, email, password, phone, address, userId)
// //             VALUES (?, ?, ?, ?, ?, ?, ?)
// //         `;
// //         const result = await query(insertQuery, [firstName, lastName, email, hashedPassword, phone, address, newUserResult.insertId]);

// //         // Check if customer insertion was successful
// //         if (!result.insertId) {
// //             throw new Error('Failed to insert customer');
// //         }

// //         // Return the newly created customer data along with the user token
// //         return { id: result.insertId, token, ...customerData };
// //     } catch (error) {
// //         throw error;
// //     }
// // };


// // customerService.createCustomer = async (customerData) => {
// //     try {
// //         const { firstName, lastName, email, password, phone, address } = customerData;

// //         // Hash the password
// //         const hashedPassword = await bcrypt.hash(password, 12);

// //         // Create new user
// //         const newUserQuery = 'INSERT INTO users (username, email, password, role, userType) VALUES (?, ?, ?, ?, ?)';
// //         const newUserResult = await query(newUserQuery, [email, email, hashedPassword, 'user', 'Customer']);

// //         // Check if user insertion was successful
// //         if (!newUserResult.insertId) {
// //             throw new Error('Failed to insert user');
// //         }

// //         // Generate JWT token
// //         const token = signToken(newUserResult.insertId);

// //         // Insert customer data into the customers table
// //         const insertQuery = `
// //             INSERT INTO customers (firstName, lastName, email, password, phone, address, userId)
// //             VALUES (?, ?, ?, ?, ?, ?, ?)
// //         `;
// //         const result = await query(insertQuery, [firstName, lastName, email, hashedPassword, phone, address, newUserResult.insertId]);

// //         // Check if customer insertion was successful
// //         if (!result.insertId) {
// //             throw new Error('Failed to insert customer');
// //         }

// //         // Return the newly created customer data along with the user token
// //         return { id: result.insertId, token, ...customerData };
// //     } catch (error) {
// //         throw error;
// //     }
// // };

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

// // customerService.getAllCustomers = async () => {
// //     try {
// //         const selectAllQuery = 'SELECT * FROM customers';
// //         const customers = await query(selectAllQuery);
// //         return customers;
// //     } catch (error) {
// //         throw error;
// //     }
// // };

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
