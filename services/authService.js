

// const mysql = require('mysql');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const dotenv = require('dotenv');
// const sendEmailWithOTP = require('./sendEmail');

// dotenv.config();

// // Create a pool of MySQL connections
// const pool = mysql.createPool({
//     connectionLimit: process.env.CONNECTION_LIMIT,
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
// });

// // Helper function to execute SQL queries
// function query(sql, args) {
//     return new Promise((resolve, reject) => {
//         // Get a connection from the pool
//         pool.getConnection((err, connection) => {
//             if (err) {
//                 return reject(err);
//             }

//             // Execute the query using the acquired connection
//             connection.query(sql, args, (err, rows) => {
//                 // Release the connection back to the pool
//                 connection.release();

//                 if (err) {
//                     return reject(err);
//                 }

//                 resolve(rows);
//             });
//         });
//     });
// }

// // Function to sign JWT token
// const signToken = (id) => {
//     return jwt.sign({ id }, process.env.JWT_SECRET, {
//         expiresIn: process.env.JWT_EXPIRES_IN,
//     });
// };

// // Function to generate a random OTP
// const generateOTP = () => {
//     return Math.floor(100000 + Math.random() * 900000).toString();
// };



// const authenticationService = {};

// // Authenticate user with email/phone and password
// authenticationService.authenticateUser = async (loginData) => {
//     try {
//         // Ensure loginData is provided and contains emailOrPhone and password properties
//         if (!loginData || !loginData.emailOrPhone || !loginData.password) {
//             throw new Error('Both email/phone and password are required for authentication');
//         }

//         const emailOrPhone = loginData.emailOrPhone;
//         const password = loginData.password;

//         // Check if the login data is an email or phone number
//         const isEmail = emailOrPhone.includes('@');
//         const column = isEmail ? 'email' : 'phone';

//         // Fetch user data from the database based on email or phone
//         const selectQuery = `SELECT * FROM users WHERE ${column} = ?`;
//         const user = await query(selectQuery, [emailOrPhone]);

//         // If user not found, return error
//         if (user.length === 0) {
//             throw new Error('User not found');
//         }

//         // Verify password
//         const hashedPassword = user[0].password;
//         const isPasswordValid = await bcrypt.compare(password, hashedPassword);

//         // If password is invalid, return error
//         if (!isPasswordValid) {
//             throw new Error('Invalid password');
//         }

//         // Generate JWT token
//         const token = signToken(user[0].id);

//         // Return user data along with token
//         return { user: user[0], token };
//     } catch (error) {
//         throw error;
//     }
// };

// // Register a new user
// authenticationService.registerUser = async (userData) => {
//     try {
//         const { firstName, lastName, email, phone, password, role, userType } = userData;

//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, 12);

//         // Insert user data into the database
//         const insertQuery = 'INSERT INTO users (firstName, lastName, email, phone, password, role, userType) VALUES (?, ?, ?, ?, ?, ?, ?)';
//         const result = await query(insertQuery, [firstName, lastName, email, phone, hashedPassword, role, userType]);

//         // Check if user insertion was successful
//         if (!result.insertId) {
//             throw new Error('Failed to register user');
//         }

//         // Generate JWT token
//         const token = signToken(result.insertId);

//         // Return the newly registered user data along with the token
//         return { id: result.insertId, token, ...userData };
//     } catch (error) {
//         throw error;
//     }
// };

// // Request password reset: Generate OTP and send it via email
// authenticationService.requestPasswordReset = async (emailOrPhone) => {
//     try {
//         // Check if the provided email or phone exists in the database
//         const isEmail = emailOrPhone.includes('@');
//         const column = isEmail ? 'email' : 'phone';
//         const selectQuery = `SELECT * FROM users WHERE ${column} = ?`;
//         const user = await query(selectQuery, [emailOrPhone]);

//         // If user not found, return error
//         if (user.length === 0) {
//             throw new Error('User not found');
//         }

//         // Generate OTP
//         const otp = generateOTP();

//         // Store OTP in the database
//         const insertOtpQuery = 'INSERT INTO otps (user_id, otp) VALUES (?, ?)';
//         await query(insertOtpQuery, [user[0].id, otp]);

//         // Send OTP via email
//         await sendEmailWithOTP(user[0].email, otp);

//         // Return the generated OTP and user ID
//         return { userId: user[0].id, otp };
//     } catch (error) {
//         throw error;
//     }
// };

// // Reset password: Validate OTP, update password, and remove OTP from database
// authenticationService.resetPassword = async (resetData) => {
//     try {
//         const { userId, newPassword, otp } = resetData;

//         // Fetch OTP from the database
//         const selectOtpQuery = 'SELECT * FROM otps WHERE user_id = ? AND otp = ? ORDER BY created_at DESC LIMIT 1';
//         const otpRecord = await query(selectOtpQuery, [userId, otp]);

//         // If OTP not found or expired, return error
//         if (otpRecord.length === 0) {
//             throw new Error('Invalid or expired OTP');
//         }

//         // Hash the new password
//         const hashedPassword = await bcrypt.hash(newPassword, 12);

//         // Update user's password in the database
//         const updatePasswordQuery = 'UPDATE users SET password = ? WHERE id = ?';
//         await query(updatePasswordQuery, [hashedPassword, userId]);

//         // Delete OTP record from the database
//         const deleteOtpQuery = 'DELETE FROM otps WHERE id = ?';
//         await query(deleteOtpQuery, [otpRecord[0].id]);

//         return { message: 'Password reset successful' };
//     } catch (error) {
//         throw error;
//     }
// };

// // Verify JWT token
// authenticationService.verifyToken = async (token) => {
//     try {
//         // Verify the provided JWT token
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         // Fetch user data based on the decoded user ID
//         const selectQuery = 'SELECT * FROM users WHERE id = ?';
//         const user = await query(selectQuery, [decoded.id]);

//         // If user not found, return error
//         if (user.length === 0) {
//             throw new Error('User not found');
//         }

//         // Return user data if token is valid
//         return user[0];
//     } catch (error) {
//         throw error;
//     }
// };

// // Get all users from the database
// authenticationService.getAllUsers = async () => {
//     try {
//         // Fetch all users from the database
//         const selectAllQuery = 'SELECT * FROM users';
//         const users = await query(selectAllQuery);

//         // Check if users array is empty
//         if (users.length === 0) {
//             return { message: "No users found" };
//         }

//         // Return all users
//         return users;
//     } catch (error) {
//         throw error;
//     }
// };

// module.exports = authenticationService;


const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const sendEmailWithOTP = require('./sendEmail');

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

// Function to generate a random OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const authenticationService = {};


// Authenticate user with email/phone and password
authenticationService.authenticateUser = async (loginData) => {
    try {
        // Ensure loginData is provided and contains emailOrPhone and password properties
        if (!loginData || !loginData.emailOrPhone || !loginData.password) {
            throw new Error('Both email/phone and password are required for authentication');
        }

        const emailOrPhone = loginData.emailOrPhone;
        const password = loginData.password;

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



// Register a new user
authenticationService.registerUser = async (userData) => {
    try {
        const { firstName, lastName, email, phone, password, role, userType } = userData;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Insert user data into the database
        const insertQuery = 'INSERT INTO users (firstName, lastName, email, phone, password, role, userType) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const result = await query(insertQuery, [firstName, lastName, email, phone, hashedPassword, role, userType]);

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

// Request password reset: Generate OTP and send it via email
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

        // Generate OTP
        const otp = generateOTP();

        // Store OTP in the database
        const insertOtpQuery = 'INSERT INTO otps (user_id, otp) VALUES (?, ?)';
        await query(insertOtpQuery, [user[0].id, otp]);

        // Send OTP via email
        await sendEmailWithOTP(user[0].email, otp);

        // Return the generated OTP and user ID
        return { userId: user[0].id, otp };
    } catch (error) {
        throw error;
    }
};

// Reset password: Validate OTP, update password, and remove OTP from database
authenticationService.resetPassword = async (resetData) => {
    try {
        const { userId, newPassword, otp } = resetData;

        // Fetch OTP from the database
        const selectOtpQuery = 'SELECT * FROM otps WHERE user_id = ? AND otp = ? ORDER BY created_at DESC LIMIT 1';
        const otpRecord = await query(selectOtpQuery, [userId, otp]);

        // If OTP not found or expired, return error
        if (otpRecord.length === 0) {
            throw new Error('Invalid or expired OTP');
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        // Update user's password in the database
        const updatePasswordQuery = 'UPDATE users SET password = ? WHERE id = ?';
        await query(updatePasswordQuery, [hashedPassword, userId]);

        // Delete OTP record from the database
        const deleteOtpQuery = 'DELETE FROM otps WHERE id = ?';
        await query(deleteOtpQuery, [otpRecord[0].id]);

        return { message: 'Password reset successful' };
    } catch (error) {
        throw error;
    }
};


// Verify OTP
authenticationService.verifyOTP = async (userId, otp) => {
    try {
        // Fetch OTP from the database
        const selectOtpQuery = 'SELECT * FROM otps WHERE user_id = ? AND otp = ? ORDER BY created_at DESC LIMIT 1';
        const otpRecord = await query(selectOtpQuery, [userId, otp]);

        // If OTP not found or expired, return false
        if (otpRecord.length === 0) {
            return { valid: false, message: 'Invalid or expired OTP' };
        }

        // Check if OTP is expired (assuming expiration time is stored in the database)
        const otpExpiration = otpRecord[0].created_at.getTime() + 5 * 60 * 1000; // Assuming 5 minutes expiration time
        const currentTime = Date.now();

        if (currentTime > otpExpiration) {
            // OTP has expired, delete it from the database
            const deleteOtpQuery = 'DELETE FROM otps WHERE id = ?';
            await query(deleteOtpQuery, [otpRecord[0].id]);

            return { valid: false, message: 'OTP has expired' };
        }

        // OTP is valid and not expired
        return { valid: true, message: 'OTP is valid' };
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


