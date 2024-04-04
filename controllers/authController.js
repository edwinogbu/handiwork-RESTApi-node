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




const authService = require('../services/authService');

async function signup(req, res) {
    try {
        const { username, password, email, role, userType } = req.body;
        const { token, user } = await authService.signup(username, password, email, role, userType);
        res.status(201).json({ token, user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function login(req, res) {
    try {
        const { identifier, password } = req.body;
        const { token, user } = await authService.login(identifier, password);
        res.json({ token, user });
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
}


async function getAllUsers(req, res) {
    try {
        const users = await authService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    signup,
    login,
    getAllUsers
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


