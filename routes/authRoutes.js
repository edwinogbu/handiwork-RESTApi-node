const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST route for user login
router.post('/login', authController.login);
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
