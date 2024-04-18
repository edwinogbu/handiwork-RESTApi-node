

// const express = require('express');
// const router = express.Router();
// const authController = require('../controllers/authController');
// const cache = require('memory-cache');

// // Route to authenticate user
// router.post('/login', authController.authenticateUser, clearCacheForAllRoutes);

// // Route to register new user
// router.post('/register', authController.registerUser);

// // Route to request password reset
// router.post('/forgot-password', authController.requestPasswordReset);

// // Route to reset password
// router.post('/reset-password', authController.resetPassword);

// // Route to get all users
// router.get('/users', cacheMiddleware(), authController.getAllUsers);

// module.exports = router;

// // Middleware to handle caching
// function cacheMiddleware() {
//     return (req, res, next) => {
//         const key = req.originalUrl || req.url;
//         const cachedData = cache.get(key);
//         if (cachedData) {
//             return res.status(200).json(cachedData);
//         }
//         // If not found in cache, proceed to the route handler
//         next();
//     };
// }

// // Middleware to clear cache for all routes
// function clearCacheForAllRoutes(req, res, next) {
//     cache.clear();
//     next();
// }



const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const cache = require('memory-cache');

// Route to authenticate user
router.post('/login', authController.authenticateUser);

// Route to register new user
router.post('/register', authController.registerUser);

// Route to request password reset
router.post('/forgot-password', authController.requestPasswordReset);

// Route to reset password
router.post('/reset-password', authController.resetPassword);

// Route to get all users
router.get('/users', cacheMiddleware(), authController.getAllUsers);

// Route to verify OTP
router.post('/verify-otp', authController.verifyOTP);

module.exports = router;

// Middleware to handle caching
function cacheMiddleware() {
    return (req, res, next) => {
        const key = req.originalUrl || req.url;
        const cachedData = cache.get(key);
        if (cachedData) {
            return res.status(200).json(cachedData);
        }
        // If not found in cache, proceed to the route handler
        next();
    };
}





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
