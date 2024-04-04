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
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

// Function to sign JWT token
const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

const authService = {};

authService.signup = async (username, password, email, role, userType) => {
    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create new user
        const newUserQuery = 'INSERT INTO users (username, email, password, role, userType) VALUES (?, ?, ?, ?, ?)';
        const newUserResult = await query(newUserQuery, [username, email, hashedPassword, role, userType]);

        // Check if user insertion was successful
        if (!newUserResult.insertId) {
            throw new Error('Failed to insert user');
        }

        // Generate JWT token
        const token = signToken(newUserResult.insertId);

        // Return token and user data
        return { token, user: { id: newUserResult.insertId, username, email, role, userType } };
    } catch (error) {
        throw error;
    }
};

authService.getUserByEmailOrPhone = async (identifier) => {
    try {
        const selectUserQuery = 'SELECT * FROM users WHERE email = ? OR phone = ?';
        const users = await query(selectUserQuery, [identifier, identifier]);
        return users.length > 0 ? users[0] : null;
    } catch (error) {
        throw error;
    }
};

authService.login = async (identifier, password) => {
    try {
        // Check if user with the provided email or phone number exists
        // const user =  'SELECT * FROM users WHERE email = ? OR phone = ?';
        const user = await authService.getUserByEmailOrPhone(identifier);

        if (!user) {
            throw new Error('User not found');
        }

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

authService.getAllUsers = async () => {
    try {
        const selectAllUsersQuery = 'SELECT * FROM users';
        const users = await query(selectAllUsersQuery);

        // Check if users array is empty
        if (users.length === 0) {
            return { message: "Users table is empty" };
        }

        return users;
    } catch (error) {
        throw error;
    }
};

module.exports = authService;



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


