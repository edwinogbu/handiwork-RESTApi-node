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

// // Function to sign JWT token
// const signToken = (id) => {
//     return jwt.sign({ id }, process.env.JWT_SECRET, {
//         expiresIn: process.env.JWT_EXPIRES_IN,
//     });
// };

// const authService = {};

// authService.signup = async (username, password, email, role, userType) => {
//     try {
//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, 12);

//         // Create new user
//         const newUserQuery = 'INSERT INTO users (username, email, password, role, userType) VALUES (?, ?, ?, ?, ?)';
//         const newUserResult = await query(newUserQuery, [username, email, hashedPassword, role, userType]);

//         // Check if user insertion was successful
//         if (!newUserResult.insertId) {
//             throw new Error('Failed to insert user');
//         }

//         // Generate JWT token
//         const token = signToken(newUserResult.insertId);

//         // Return token and user data
//         return { token, user: { id: newUserResult.insertId, username, email, role, userType } };
//     } catch (error) {
//         throw error;
//     }
// };

// authService.getUserByEmail = async (email) => {
//     try {
//         const selectUserQuery = 'SELECT * FROM users WHERE email = ?';
//         const users = await query(selectUserQuery, [email]);
//         return users.length > 0 ? users[0] : null;
//     } catch (error) {
//         throw error;
//     }
// };

// authService.login = async (email, password) => {
//     try {
//         // Check if user with the provided email exists
//         const user = await authService.getUserByEmail(email);

//         if (!user) {
//             throw new Error('User not found');
//         }

//         // Compare the provided password with the hashed password stored in the database
//         const isPasswordValid = await bcrypt.compare(password, user.password);
//         if (!isPasswordValid) {
//             throw new Error('Invalid password');
//         }

//         // Generate JWT token
//         const token = signToken(user.id);

//         // Remove sensitive data from the user object
//         delete user.password;

//         // Return user details along with the JWT token
//         return { token, user };
//     } catch (error) {
//         throw error;
//     }
// };

// // Add a service to retrieve all users
// authService.getAllUsers = async () => {
//     try {
//         const selectAllUsersQuery = 'SELECT * FROM users';
//         const users = await query(selectAllUsersQuery);

//         // Check if users array is empty
//         if (users.length === 0) {
//             return { message: "Users table is empty" };
//         }

//         return users;
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

// // Helper function to execute SQL queries
// function query(sql, args) {
//     return new Promise((resolve, reject) => {
//         connection.query(sql, args, (err, rows) => {
//             if (err) reject(err);
//             else resolve(rows);
//         });
//     });
// }

// // Function to sign JWT token
// const signToken = (id) => {
//     return jwt.sign({ id }, process.env.JWT_SECRET, {
//         expiresIn: process.env.JWT_EXPIRES_IN,
//     });
// };

// const authService = {};

// authService.login = async (identifier, password) => {
//     try {
//         // Check if the identifier is a valid email or phone format
//         let column;
//         if (identifier.includes('@')) {
//             column = 'email';
//         } else {
//             // Assume it's a phone number format
//             column = 'phone';
//         }

//         // Query the database to find the user by email or phone
//         const queryStr = `SELECT * FROM users WHERE ${column} = ?`;
//         const user = await query(queryStr, identifier);

//         if (!user || user.length === 0) {
//             throw new Error('User not found');
//         }

//         // Verify the password
//         const isPasswordValid = await bcrypt.compare(password, user[0].password);
//         if (!isPasswordValid) {
//             throw new Error('Invalid password');
//         }

//         // Sign JWT token
//         const token = signToken(user[0].id);

//         return { user: user[0], token };
//     } catch (error) {
//         throw error;
//     }
// };

// authService.getAllUsers = async () => {
//     try {
//         const selectAllUsersQuery = 'SELECT * FROM users';
//         const users = await query(selectAllUsersQuery);

//         // Check if users array is empty
//         if (users.length === 0) {
//             return { message: "Users table is empty" };
//         }

//         return users;
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

// // Helper function to execute SQL queries
// function query(sql, args) {
//     return new Promise((resolve, reject) => {
//         connection.query(sql, args, (err, rows) => {
//             if (err) reject(err);
//             else resolve(rows);
//         });
//     });
// }

// // Function to sign JWT token
// const signToken = (id) => {
//     return jwt.sign({ id }, process.env.JWT_SECRET, {
//         expiresIn: process.env.JWT_EXPIRES_IN,
//     });
// };

// const authService = {};

// // Authenticate user by email or phone and password
// authService.authenticate = async (emailOrPhone, password) => {
//     try {
//         // Check if the user exists by email
//         let user = await query('SELECT * FROM users WHERE email = ?', [emailOrPhone]);
//         if (!user || user.length === 0) {
//             // If user does not exist by email, check by phone
//             user = await query('SELECT * FROM users WHERE phone = ?', [emailOrPhone]);
//         }

//         if (!user || user.length === 0) {
//             // If user does not exist by email or phone, return error
//             throw new Error('User not found');
//         }

//         user = user[0]; // Extract the user object

//         // Verify password
//         const passwordMatch = await bcrypt.compare(password, user.password);
//         if (!passwordMatch) {
//             throw new Error('Invalid password');
//         }

//         // Generate JWT token
//         const token = signToken(user.id);

//         return { token, user }; // Return token and user details
//     } catch (error) {
//         throw error;
//     }
// };


// authService.getAllUsers = async () => {
//     try {
//         const selectAllUsersQuery = 'SELECT * FROM users';
//         const users = await query(selectAllUsersQuery);

//         // Check if users array is empty
//         if (users.length === 0) {
//             return { message: "Users table is empty" };
//         }

//         return users;
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

// // Helper function to execute SQL queries
// function query(sql, args) {
//     return new Promise((resolve, reject) => {
//         connection.query(sql, args, (err, rows) => {
//             if (err) reject(err);
//             else resolve(rows);
//         });
//     });
// }

// // Function to sign JWT token
// const signToken = (id) => {
//     return jwt.sign({ id }, process.env.JWT_SECRET, {
//         expiresIn: process.env.JWT_EXPIRES_IN,
//     });
// };

// const authService = {};

// authService.signup = async (username, password, email, phone, role, userType) => {
//     try {
//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, 12);

//         // Create new user
//         const newUserQuery = 'INSERT INTO users (username, email, phone, password, role, userType) VALUES (?, ?, ?, ?, ?, ?)';
//         const newUserResult = await query(newUserQuery, [username, email, phone, hashedPassword, role, userType]);

//         // Check if user insertion was successful
//         if (!newUserResult.insertId) {
//             throw new Error('Failed to insert user');
//         }

//         // Generate JWT token
//         const token = signToken(newUserResult.insertId);

//         // Return token and user data
//         return { token, user: { id: newUserResult.insertId, username, email, phone, role, userType } };
//     } catch (error) {
//         throw error;
//     }
// };

// authService.getUserByIdentifier = async (identifier) => {
//     try {
//         console.log("Identifier:", identifier); // Log the identifier being passed
        
//         const selectUserQuery = 'SELECT * FROM users WHERE email = ? OR username = ? OR phone = ?';
//         const users = await query(selectUserQuery, [identifier, identifier, identifier]);

//         console.log("Database Query Result:", users); // Log the results returned by the database query
        
//         return users.length > 0 ? users[0] : null;
//     } catch (error) {
//         throw error;
//     }
// };

// // Function to handle user login
// authService.login = async (identifier, password) => {
//     try {
//         // Check if user with the provided identifier exists
//         const user = await authService.getUserByIdentifier(identifier);

//         if (!user) {
//             throw new Error('User not found');
//         }

//         // Compare the provided password with the hashed password stored in the database
//         const isPasswordValid = await bcrypt.compare(password, user.password);
//         if (!isPasswordValid) {
//             throw new Error('Invalid password');
//         }

//         // Generate JWT token
//         const token = signToken(user.id);

//         // Remove sensitive data from the user object
//         delete user.password;

//         // Return user details along with the JWT token
//         return { token, user };
//     } catch (error) {
//         throw error;
//     }
// };

// // Add a service to retrieve all users
// authService.getAllUsers = async () => {
//     try {
//         const selectAllUsersQuery = 'SELECT * FROM users';
//         const users = await query(selectAllUsersQuery);

//         // Check if users array is empty
//         if (users.length === 0) {
//             return { message: "Users table is empty" };
//         }

//         return users;
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

// // Helper function to execute SQL queries
// function query(sql, args) {
//     return new Promise((resolve, reject) => {
//         connection.query(sql, args, (err, rows) => {
//             if (err) reject(err);
//             else resolve(rows);
//         });
//     });
// }

// // Function to sign JWT token
// const signToken = (id) => {
//     return jwt.sign({ id }, process.env.JWT_SECRET, {
//         expiresIn: process.env.JWT_EXPIRES_IN,
//     });
// };

// const authService = {};

// authService.signup = async (username, password, email, role, userType) => {
//     try {
//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, 12);

//         // Create new user
//         const newUserQuery = 'INSERT INTO users (username, email, password, role, userType) VALUES (?, ?, ?, ?, ?)';
//         const newUserResult = await query(newUserQuery, [username, email, hashedPassword, role, userType]);

//         // Check if user insertion was successful
//         if (!newUserResult.insertId) {
//             throw new Error('Failed to insert user');
//         }

//         // Generate JWT token
//         const token = signToken(newUserResult.insertId);

//         // Return token and user data
//         return { token, user: { id: newUserResult.insertId, username, email, role, userType } };
//     } catch (error) {
//         throw error;
//     }
// };

// authService.getUserByEmailOrPhone = async (identifier) => {
//     try {
//         const selectUserQuery = 'SELECT * FROM users WHERE email = ? OR phone = ?';
//         const users = await query(selectUserQuery, [identifier, identifier]);
//         return users.length > 0 ? users[0] : null;
//     } catch (error) {
//         throw error;
//     }
// };

// authService.login = async (identifier, password) => {
//     try {
//         // Check if user with the provided email or phone number exists
//         // const user =  'SELECT * FROM users WHERE email = ? OR phone = ?';
//         const user = await authService.getUserByEmailOrPhone(identifier);

//         if (!user) {
//             throw new Error('User not found');
//         }

//         // Compare the provided password with the hashed password stored in the database
//         const isPasswordValid = await bcrypt.compare(password, user.password);
//         if (!isPasswordValid) {
//             throw new Error('Invalid password');
//         }

//         // Generate JWT token
//         const token = signToken(user.id);

//         // Remove sensitive data from the user object
//         delete user.password;

//         // Return user details along with the JWT token
//         return { token, user };
//     } catch (error) {
//         throw error;
//     }
// };

// authService.getAllUsers = async () => {
//     try {
//         const selectAllUsersQuery = 'SELECT * FROM users';
//         const users = await query(selectAllUsersQuery);

//         // Check if users array is empty
//         if (users.length === 0) {
//             return { message: "Users table is empty" };
//         }

//         return users;
//     } catch (error) {
//         throw error;
//     }
// };

// module.exports = authService;


// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const db = require('./db');

// const authService = {};

// // Function to sign JWT token
// const signToken = (id) => {
//     return jwt.sign({ id }, process.env.JWT_SECRET, {
//         expiresIn: process.env.JWT_EXPIRES_IN,
//     });
// };

// authService.signup = async (username, password, email, role, userType) => {
//     try {
//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, 12);

//         // Create new user
//         const userId = await db.insertUser(username, email, hashedPassword, role, userType);

//         // Generate JWT token
//         const token = signToken(userId);

//         // Return token and user data
//         return { token, user: { id: userId, username, email, role, userType } };
//     } catch (error) {
//         throw error;
//     }
// };

// authService.login = async (identifier, password) => {
//     try {
//         // Check if user with the provided email or phone number exists
//         const user = await db.getUserByEmailOrPhone(identifier);

//         if (!user) {
//             throw new Error('User not found');
//         }

//         // Compare the provided password with the hashed password stored in the database
//         const isPasswordValid = await bcrypt.compare(password, user.password);
//         if (!isPasswordValid) {
//             throw new Error('Invalid password');
//         }

//         // Generate JWT token
//         const token = signToken(user.id);

//         // Remove sensitive data from the user object
//         delete user.password;

//         // Return user details along with the JWT token
//         return { token, user };
//     } catch (error) {
//         throw error;
//     }
// };

// authService.getAllUsers = async () => {
//     try {
//         const users = await db.allUser();
//         return users;
//     } catch (error) {
//         throw error;
//     }
// };


// module.exports = authService;



// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const db = require('./db');

// const authService = {
//     // Authenticate user with email or phone number and password
//     authenticateUser: async (emailOrPhone, password) => {
//         try {
//             const user = await db.getUserByEmailOrPhone(emailOrPhone);
//             if (!user) {
//                 return null; // User not found
//             }

//             // Compare password hash
//             const passwordMatch = await bcrypt.compare(password, user.password);
//             if (!passwordMatch) {
//                 return null; // Password incorrect
//             }

//             // Generate JWT token
//             const token = authService.generateToken(user.id);

//             return token;
//         } catch (error) {
//             throw error;
//         }
//     },

//     // Generate JWT token
//     generateToken: (userId) => {
//         return jwt.sign({ userId }, process.env.JWT_SECRET, {
//             expiresIn: process.env.JWT_EXPIRES_IN,
//         });
//     },

//     // Verify JWT token
//     verifyToken: (token) => {
//         return jwt.verify(token, process.env.JWT_SECRET);
//     },

//     // Register new user
//     registerUser: async (username, email, phone, password) => {
//         try {
//             // Check if email or phone already exists
//             const existingUser = await db.getUserByEmailOrPhone(email) || await db.getUserByEmailOrPhone(phone);
//             if (existingUser) {
//                 throw new Error('Email or phone already exists');
//             }

//             // Hash password
//             const hashedPassword = await bcrypt.hash(password, 10);

//             // Create user
//             const userId = await db.insertUser(username, email, phone, hashedPassword);
//             return userId;
//         } catch (error) {
//             throw error;
//         }
//     },

//     // Request password reset
//     requestPasswordReset: async (email) => {
//         try {
//             // Check if user exists
//             const user = await db.getUserByEmail(email);
//             if (!user) {
//                 throw new Error('User not found');
//             }

//             // Generate password reset token
//             const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
//                 expiresIn: '1h', // Token expires in 1 hour
//             });

//             // Send password reset email (implementation not shown)

//             return token;
//         } catch (error) {
//             throw error;
//         }
//     },

//     // Reset password
//     resetPassword: async (token, newPassword) => {
//         try {
//             // Verify token
//             const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

//             // Hash new password
//             const hashedPassword = await bcrypt.hash(newPassword, 10);

//             // Update user's password
//             await db.updatePassword(decodedToken.userId, hashedPassword);
//         } catch (error) {
//             throw error;
//         }
//     },

//     getAllUsers: async () => {
//         try {
//             const selectAllUsersQuery = 'SELECT * FROM users';
//             const users = await query(selectAllUsersQuery);
    
//             // Check if users array is empty
//             if (users.length === 0) {
//                 return { message: "Users table is empty" };
//             }
    
//             return users;
//         } catch (error) {
//             throw error;
//         }
//     }
// };



// module.exports = authService;







const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

// Create a pool of MySQL connections
const pool = mysql.createPool({
    connectionLimit: process.env.CONNECTION_LIMIT,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Helper function to execute SQL queries
function query(sql, args) {
    return new Promise((resolve, reject) => {
        // Get a connection from the pool
        pool.getConnection((err, connection) => {
            if (err) {
                return reject(err);
            }

            // Execute the query using the acquired connection
            connection.query(sql, args, (err, rows) => {
                // Release the connection back to the pool
                connection.release();

                if (err) {
                    return reject(err);
                }

                resolve(rows);
            });
        });
    });
}

// Function to sign JWT token
const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

const authenticationService = {};


authenticationService.authenticateUser = async (loginData) => {
    try {
        console.log(loginData);
        // Ensure loginData is provided and contains emailOrPhone and password properties
        if (!loginData || !loginData.emailOrPhone || !loginData.password) {
            throw new Error('Both email/phone and password are required for authentication');
        }

        const emailOrPhone = loginData.emailOrPhone;
        const password = loginData.password;
        console.log("emailOrPhone loginData:" + emailOrPhone);
        console.log("password loginData:" + password);

        // Check if the login data is an email or phone number
        const isEmail = emailOrPhone.includes('@');
        const column = isEmail ? 'email' : 'phone';

        // Fetch user data from the database based on email or phone
        const selectQuery = `SELECT * FROM users WHERE ${column} = ?`;
        const user = await query(selectQuery, [emailOrPhone]);

        // If user not found, return error
        if (user.length === 0) {
            throw new Error('User not found');
        }

        // Verify password
        const hashedPassword = user[0].password;
        const isPasswordValid = await bcrypt.compare(password, hashedPassword);

        // If password is invalid, return error
        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }

        // Generate JWT token
        const token = signToken(user[0].id);

        // Return user data along with token
        return { user: user[0], token };
    } catch (error) {
        throw error;
    }
};



authenticationService.registerUser = async (userData) => {
    try {
        const { username, email, phone, password, role, userType } = userData;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Insert user data into the database
        const insertQuery = 'INSERT INTO users (username, email, phone, password, role, userType) VALUES (?, ?, ?, ?, ?, ?)';
        const result = await query(insertQuery, [username, email, phone, hashedPassword, role, userType]);

        // Check if user insertion was successful
        if (!result.insertId) {
            throw new Error('Failed to register user');
        }

        // Generate JWT token
        const token = signToken(result.insertId);

        // Return the newly registered user data along with the token
        return { id: result.insertId, token, ...userData };
    } catch (error) {
        throw error;
    }
};

authenticationService.requestPasswordReset = async (emailOrPhone) => {
    try {
        // Check if the provided email or phone exists in the database
        const isEmail = emailOrPhone.includes('@');
        const column = isEmail ? 'email' : 'phone';
        const selectQuery = `SELECT * FROM users WHERE ${column} = ?`;
        const user = await query(selectQuery, [emailOrPhone]);

        // If user not found, return error
        if (user.length === 0) {
            throw new Error('User not found');
        }

        // Generate and return a password reset token (can be implemented as needed)
        const resetToken = generateResetToken(); // Implement your token generation logic
        return resetToken;
    } catch (error) {
        throw error;
    }
};

authenticationService.resetPassword = async (resetData) => {
    try {
        const { emailOrPhone, newPassword, resetToken } = resetData;

        // Validate reset token (can be implemented as needed)
        const isTokenValid = validateResetToken(resetToken); // Implement your token validation logic

        if (!isTokenValid) {
            throw new Error('Invalid reset token');
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        // Update user's password in the database
        const isEmail = emailOrPhone.includes('@');
        const column = isEmail ? 'email' : 'phone';
        const updateQuery = `UPDATE users SET password = ? WHERE ${column} = ?`;
        await query(updateQuery, [hashedPassword, emailOrPhone]);

        return { message: 'Password reset successful' };
    } catch (error) {
        throw error;
    }
};

authenticationService.verifyToken = async (token) => {
    try {
        // Verify the provided JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch user data based on the decoded user ID
        const selectQuery = 'SELECT * FROM users WHERE id = ?';
        const user = await query(selectQuery, [decoded.id]);

        // If user not found, return error
        if (user.length === 0) {
            throw new Error('User not found');
        }

        // Return user data if token is valid
        return user[0];
    } catch (error) {
        throw error;
    }
};

authenticationService.getAllUsers = async () => {
    try {
        // Fetch all users from the database
        const selectAllQuery = 'SELECT * FROM users';
        const users = await query(selectAllQuery);

        // Check if users array is empty
        if (users.length === 0) {
            return { message: "No users found" };
        }

        // Return all users
        return users;
    } catch (error) {
        throw error;
    }
};

module.exports = authenticationService;




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
//             if (err) reject(err);
//             else resolve(rows);
//         });
//     });
// }

// // Function to sign JWT token
// const signToken = (id) => {
//     return jwt.sign({ id }, process.env.JWT_SECRET, {
//         expiresIn: process.env.JWT_EXPIRES_IN,
//     });
// };

// const authService = {};

// authService.signup = async (username, password, email, phone, role, userType) => {
//     try {
//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, 12);

//         // Create new user
//         const newUserQuery = 'INSERT INTO users (username, email, password, role, userType) VALUES (?, ?, ?, ?, ?)';
//         const newUserResult = await query(newUserQuery, [username, email, phone, hashedPassword, role, userType]);

//         // Check if user insertion was successful
//         if (!newUserResult.insertId) {
//             throw new Error('Failed to insert user');
//         }

//         // Generate JWT token
//         const token = signToken(newUserResult.insertId);

//         // Return token and user data
//         return { token, user: { id: newUserResult.insertId, username, email, phone, role, userType } };
//     } catch (error) {
//         throw error;
//     }
// };


// // Function to fetch user by identifier (email, username, or phone)
// // authService.getUserByIdentifier = async (identifier) => {
// //     try {
// //         const selectUserQuery = 'SELECT * FROM users WHERE email = ? OR username = ? OR phone = ?';
// //         const users = await query(selectUserQuery, [identifier, identifier, identifier]);
// //         return users.length > 0 ? users[0] : null;
// //     } catch (error) {
// //         throw error;
// //     }
// // };


// authService.getUserByIdentifier = async (identifier) => {
//     try {
//         console.log("Identifier:", identifier); // Log the identifier being passed
        
//         const selectUserQuery = 'SELECT * FROM users WHERE email = ? OR username = ? OR phone = ?';
//         const users = await query(selectUserQuery, [identifier, identifier, identifier]);

//         console.log("Database Query Result:", users); // Log the results returned by the database query
        
//         return users.length > 0 ? users[0] : null;
//     } catch (error) {
//         throw error;
//     }
// };



// // Function to handle user login
// authService.login = async (identifier, password) => {
//     try {

//         console.log(identifier);
//         // const {email, username, phone} = identifier
//         // const identifier =`SELECT * FROM users WHERE email = 'email' OR phone = 'phone' OR username = 'username`;
//         // Check if user with the provided identifier exists
//         const user = await authService.getUserByIdentifier(identifier);

//         if (!user) {
//             throw new Error('User not found');
//         }

//         // Compare the provided password with the hashed password stored in the database
//         const isPasswordValid = await bcrypt.compare(password, user.password);
//         if (!isPasswordValid) {
//             throw new Error('Invalid password');
//         }

//         // Generate JWT token
//         const token = signToken(user.id);

//         // Remove sensitive data from the user object
//         delete user.password;

//         // Return user details along with the JWT token
//         return { token, user };
//     } catch (error) {
//         throw error;
//     }
// };

// // Add a service to retrieve all users
// authService.getAllUsers = async () => {
//     try {
//         const selectAllUsersQuery = 'SELECT * FROM users';
//         const users = await query(selectAllUsersQuery);

//         // Check if users array is empty
//         if (users.length === 0) {
//             return { message: "Users table is empty" };
//         }

//         return users;
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

// // Helper function to execute SQL queries
// function query(sql, args) {
//     return new Promise((resolve, reject) => {
//         connection.query(sql, args, (err, rows) => {
//             if (err) return reject(err);
//             resolve(rows);
//         });
//     });
// }

// // Function to sign JWT token
// const signToken = (id) => {
//     return jwt.sign({ id }, process.env.JWT_SECRET, {
//         expiresIn: process.env.JWT_EXPIRES_IN,
//     });
// };

// const authService = {};

// authService.signup = async (username, password, email, role, userType) => {
//     try {
//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, 12);

//         // Create new user
//         const newUserQuery = 'INSERT INTO users (username, email, password, role, userType) VALUES (?, ?, ?, ?, ?)';
//         const newUserResult = await query(newUserQuery, [username, email, hashedPassword, role, userType]);

//         // Check if user insertion was successful
//         if (!newUserResult.insertId) {
//             throw new Error('Failed to insert user');
//         }

//         // Generate JWT token
//         const token = signToken(newUserResult.insertId);

//         // Return token and user data
//         return { token, user: { id: newUserResult.insertId, username, email, role, userType } };
//     } catch (error) {
//         throw error;
//     }
// };

// authService.getUserByEmail = async (email) => {
//     try {
//         const selectUserQuery = 'SELECT * FROM users WHERE email = ?';
//         const users = await query(selectUserQuery, [email]);
//         return users.length > 0 ? users[0] : null;
//     } catch (error) {
//         throw error;
//     }
// };

// authService.login = async (email, password) => {
//     try {
//         // Check if user with the provided email exists
//         const user = await authService.getUserByEmail(email);

//         if (!user) {
//             throw new Error('User not found');
//         }

//         // Compare the provided password with the hashed password stored in the database
//         const isPasswordValid = await bcrypt.compare(password, user.password);
//         if (!isPasswordValid) {
//             throw new Error('Invalid password');
//         }

//         // Generate JWT token
//         const token = signToken(user.id);

//         // Remove sensitive data from the user object
//         delete user.password;

//         // Return user details along with the JWT token
//         return { token, user };
//     } catch (error) {
//         throw error;
//     }
// };

// // Add a service to retrieve all users
// authService.getAllUsers = async () => {
//     try {
//         const selectAllUsersQuery = 'SELECT * FROM users';
//         const users = await query(selectAllUsersQuery);

//         // Check if users array is empty
//         if (users.length === 0) {
//             return { message: "Users table is empty" };
//         }

//         return users;
//     } catch (error) {
//         throw error;
//     }
// };

// module.exports = authService;


