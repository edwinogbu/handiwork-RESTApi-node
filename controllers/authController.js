// const authService = require('../services/authService');

// async function signup(req, res) {
//     try {
//         const { username, password, email, role, userType } = req.body;
//         const { token, user } = await authService.signup(username, password, email, role, userType);
//         res.status(201).json({ token, user });
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// }

// async function login(req, res) {
//     try {
//         const { email, password } = req.body;
//         const { token, user } = await authService.login(email, password);
//         res.json({ token, user });
//     } catch (error) {
//         res.status(401).json({ message: error.message });
//     }
// }

// async function getAllUsers(req, res) {
//     try {
//         const users = await authService.getAllUsers();
//         res.status(200).json(users);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// }

// module.exports = {
//     signup,
//     login,
//     getAllUsers
// };


// const authService = require('../services/authService');

// const authController = {};

// authController.login = async (req, res) => {
//     try {
//         const { identifier, password } = req.body;

//         // Check if identifier and password are provided
//         if (!identifier || !password) {
//             return res.status(400).json({ error: 'Identifier and password are required' });
//         }

//         // Call the login service function
//         const { user, token } = await authService.login(identifier, password);

//         // Send user details and token in the response
//         res.json({ user, token });
//     } catch (error) {
//         // Handle errors
//         console.error('Login error:', error.message);
//         if (error.message === 'User not found' || error.message === 'Invalid password') {
//             return res.status(401).json({ error: error.message });
//         }
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };

// authController.getAllUsers = async (req, res) => {
//     try {
//         const users = await authService.getAllUsers();
//         res.status(200).json(users);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// module.exports = authController;


// const authService = require('../services/authService');

// const authController = {};

// // Controller function to handle user login
// authController.login = async (req, res) => {
//     const { emailOrPhone, password } = req.body;

//     try {
//         // Authenticate user
//         const { token, user } = await authService.authenticate(emailOrPhone, password);

//         // Return token and user details
//         res.status(200).json({ token, user });
//     } catch (error) {
//         // Return error message if authentication fails
//         res.status(401).json({ error: error.message });
//     }
// };

// authController.getAllUsers = async (req, res) => {
//     try {
//         const users = await authService.getAllUsers();
//         res.status(200).json(users);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// }


// module.exports = authController;


// const authService = require('../services/authService');

// async function signup(req, res) {
//     try {
//         const { username, password, email, role, userType } = req.body;
//         const { token, user } = await authService.signup(username, password, email, role, userType);
//         res.status(201).json({ token, user });
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// }


// async function login(req, res) {
//     try {
//         const { email, username, phone, password } = req.body;
        
//         const identifier = email || username || phone; // Construct the identifier
              
//         if (!email && !username && !phone) {
//             throw new Error('Please provide either email, username, or phone');
//         }

//         const { token, user } = await authService.login(identifier, password);
//         res.json({ token, user });
//     } catch (error) {
//         res.status(401).json({ message: error.message });
//     }
// }



// // async function login(req, res) {
// //     try {
// //         const { email, username, phone, password } = req.body;
// //         const identifier = email || username || phone; // Construct the identifier
        
// //         if (!identifier) {
// //             throw new Error('Please provide either email, username, or phone');
// //         }

// //         const { token, user } = await authService.login(identifier, password);
// //         res.json({ token, user });
// //     } catch (error) {
// //         res.status(401).json({ message: error.message });
// //     }
// // }


// async function getAllUsers(req, res) {
//     try {
//         const users = await authService.getAllUsers();
//         res.status(200).json(users);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// }

// module.exports = {
//     signup,
//     login,
//     getAllUsers
// };


// const authService = require('./../services/authService');

// const authController = {};

// authController.signup = async (req, res) => {
//     const { username, password, email, role, userType } = req.body;
//     try {
//         const result = await authService.signup(username, password, email, role, userType);
//         res.status(201).json({ token: result.token, user: result.user });
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };

// authController.login = async (req, res) => {
//     const { identifier, password } = req.body;
//     try {
//         const result = await authService.login(identifier, password);
//         res.status(200).json({ token: result.token, user: result.user });
//     } catch (error) {
//         res.status(401).json({ message: error.message });
//     }
// };

// authController.getAllUsers = async (req, res) => {
//     try {
//         const users = await authService.getAllUsers();
//         res.status(200).json(users);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };


// module.exports = authController;


// const authService = require('../services/authService');

// const authController = {
//     // Authenticate user
//     authenticateUser: async (req, res) => {
//         try {
//             const { emailOrPhone, password } = req.body;
//             const token = await authService.authenticateUser(emailOrPhone, password);
//             if (token) {
//                 res.json({ token });
//             } else {
//                 res.status(401).json({ error: 'Invalid email/phone or password' });
//             }
//         } catch (error) {
//             console.error('Error authenticating user:', error);
//             res.status(500).json({ error: 'Internal Server Error' });
//         }
//     },

//     // User Registration
//     registerUser: async (req, res) => {
//         try {
//             const { username, email, phone, password } = req.body;
//             const userId = await authService.registerUser(username, email, phone, password);
//             res.status(201).json({ userId });
//         } catch (error) {
//             console.error('Error registering user:', error);
//             res.status(500).json({ error: 'Internal Server Error' });
//         }
//     },

//     // Request Password Reset
//     requestPasswordReset: async (req, res) => {
//         try {
//             const { email } = req.body;
//             await authService.requestPasswordReset(email);
//             res.status(200).json({ message: 'Password reset email sent' });
//         } catch (error) {
//             console.error('Error requesting password reset:', error);
//             res.status(500).json({ error: 'Internal Server Error' });
//         }
//     },

//     // Reset Password
//     resetPassword: async (req, res) => {
//         try {
//             const { token, newPassword } = req.body;
//             await authService.resetPassword(token, newPassword);
//             res.status(200).json({ message: 'Password reset successfully' });
//         } catch (error) {
//             console.error('Error resetting password:', error);
//             res.status(500).json({ error: 'Internal Server Error' });
//         }
//     },

//     // Verify JWT token
//     verifyToken: async (req, res, next) => {
//         try {
//             const token = req.headers.authorization.split(' ')[1];
//             if (!token) {
//                 return res.status(401).json({ error: 'Token not provided' });
//             }
            
//             const decodedToken = authService.verifyToken(token);
//             req.userId = decodedToken.userId;
//             next();
//         } catch (error) {
//             console.error('Error verifying token:', error);
//             return res.status(401).json({ error: 'Invalid token' });
//         }
//     },
//     getAllUsers: async (req, res, next) => {
//         try {
//             const users = await authService.getAllUsers();
//             res.status(200).json(users);
//         } catch (error) {
//             res.status(500).json({ message: error.message });
//         }
//     },
// };

// module.exports = authController;




const authenticationService = require('../services/authService');

async function authenticateUser(req, res) {
    try {
        const { emailOrPhone, password } = req.body;
        const result = await authenticationService.authenticateUser({ emailOrPhone, password });
        res.status(200).json({ success: true, user: result.user, token: result.token });
    } catch (error) {
        res.status(401).json({ success: false, error: error.message });
    }
}

async function registerUser(req, res) {
    try {
        const userData = req.body;
        const result = await authenticationService.registerUser(userData);
        res.status(201).json({ success: true, user: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

async function requestPasswordReset(req, res) {
    try {
        const emailOrPhone = req.body.emailOrPhone;
        const resetToken = await authenticationService.requestPasswordReset(emailOrPhone);
        res.status(200).json({ success: true, resetToken });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
}

async function resetPassword(req, res) {
    try {
        const resetData = req.body;
        await authenticationService.resetPassword(resetData);
        res.status(200).json({ success: true, message: 'Password reset successful' });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
}

async function verifyToken(req, res) {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const user = await authenticationService.verifyToken(token);
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(401).json({ success: false, error: error.message });
    }
}

async function getAllUsers(req, res) {
    try {
        const users = await authenticationService.getAllUsers();
        res.status(200).json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

module.exports = {
    authenticateUser,
    registerUser,
    requestPasswordReset,
    resetPassword,
    verifyToken,
    getAllUsers,
};



// const authService = require('../services/authService');

// async function signup(req, res) {
//     try {
//         const { username, password, email, role, userType } = req.body;
//         const { token, user } = await authService.signup(username, password, email, role, userType);
//         res.status(201).json({ token, user });
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// }

// async function login(req, res) {
//     try {
//         const { identifier, password } = req.body;
//         const { token, user } = await authService.login(identifier, password);
//         res.json({ token, user });
//     } catch (error) {
//         res.status(401).json({ message: error.message });
//     }
// }


// async function getAllUsers(req, res) {
//     try {
//         const users = await authService.getAllUsers();
//         res.status(200).json(users);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// }

// module.exports = {
//     signup,
//     login,
//     getAllUsers
// };


// const authService = require('../services/authService');

// async function signup(req, res) {
//     try {
//         const { username, password, email, role, userType } = req.body;
//         const { token, user } = await authService.signup(username, password, email, role, userType);
//         res.status(201).json({ token, user });
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// }

// async function login(req, res) {
//     try {
//         const { email, password } = req.body;
//         const { token, user } = await authService.login(email, password);
//         res.json({ token, user });
//     } catch (error) {
//         res.status(401).json({ message: error.message });
//     }
// }

// async function getAllUsers(req, res) {
//     try {
//         const users = await authService.getAllUsers();
//         res.status(200).json(users);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// }

// module.exports = {
//     signup,
//     login,
//     getAllUsers
// };


