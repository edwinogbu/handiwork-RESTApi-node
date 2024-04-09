// const express = require('express');
// const router = express.Router();
// const authenticationController = require('../controllers/authController');
// const db = require('../services/db');
// const jsonwebtoken = require('jsonwebtoken');
// const cookieParser = require('cookie-parser');

// router.use(cookieParser());

// router.post('/register', authenticationController.registerUser);
// router.post('/reset-password/request', authenticationController.requestPasswordReset);
// router.post('/reset-password', authenticationController.resetPassword);
// router.get('/verify-token', authenticationController.verifyToken);
// router.get('/users', authenticationController.getAllUsers);

// // router.post('/login', async (req, res, next) => {
// //     try {
// //         const email = req.body.email;
// //         const password = req.body.password;
// //         const user = await db.getUserByEmail(email);
        
// //         if (!user) {
// //             return res.status(401).json({ message: "Invalid email or password" });
// //         }
        
// //         const isValidPassword = compareSync(password, user.password);
        
// //         if (isValidPassword) {
// //             user.password = undefined;
// //             const jsontoken = jsonwebtoken.sign({ user: user }, process.env.SECRET_KEY, { expiresIn: '30m' });
// //             res.cookie('token', jsontoken, { httpOnly: true, secure: true, sameSite: 'Strict', expires: new Date(Date.now() + 30 * 60 * 1000) });
// //             res.json({ token: jsontoken });
// //         } else {
// //             return res.status(401).json({ message: "Invalid email or password" });
// //         }
// //     } catch (error) {
// //         console.error(error);
// //         res.status(500).json({ message: "Internal server error" });
// //     }
// // });


// router.post('/login', async (req, res, next) => {
//     try {
//         const identifier = req.body.identifier;
//         const password = req.body.password;

//         // Check if the provided identifier is an email or phone number
//         const isEmail = identifier.includes('@');
//         const column = isEmail ? 'email' : 'phone';

//         // Fetch user data from the database based on the identifier
//         const user = await db.getUserByColumn(column, identifier);

//         // If user not found, return error
//         if (!user) {
//             return res.status(401).json({ message: "Invalid email or phone number" });
//         }

//         // Validate password
//         const isValidPassword = compareSync(password, user.password);

//         if (isValidPassword) {
//             user.password = undefined;
//             const jsontoken = jsonwebtoken.sign({ user: user }, process.env.SECRET_KEY, { expiresIn: '30m' });
//             // res.cookie('token', jsontoken, { httpOnly: true, secure: true, sameSite: 'Strict', expires: new Date(Date.now() + 30 * 60 * 1000) });
//             res.json({ token: jsontoken });
//         } else {
//             return res.status(401).json({ message: "Invalid password" });
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// });


// router.get('/test', (req, res) => {
//     return res.json({ message: "Welcome to the Authentications API server" });
// });

// module.exports = router;




const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');


// Route to authenticate user
router.post('/login', authController.authenticateUser);

// Route to register new user
router.post('/register', authController.registerUser);

// Route to request password reset
router.post('/forgot-password', authController.requestPasswordReset);

// Route to reset password
router.post('/reset-password', authController.resetPassword);

router.get('/users', authController.getAllUsers);

module.exports = router;




// const express = require('express');
// const router = express.Router();
// const authController = require('../controllers/authController');

// const userToken = require('./../middleware/userToken');
// // Route to signup
// router.post('/signup', authController.signup);

// // Route to login
// router.post('/login', authController.login);
// router.get('/users', authController.getAllUsers);

// // Add more authentication-related routes as needed

// module.exports = router;
