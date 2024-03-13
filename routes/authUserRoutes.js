const express = require('express');
const router = express.Router();
const authUserController = require('../controllers/authUserController');

router.post('/login', authUserController.login);

module.exports = router;
