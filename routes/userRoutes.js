const express = require('express');
const router = express.Router();
const userToken = require('./../middleware/userToken');
const userController = require('../controllers/userController');

// POST request to create a new user
router.post('/create', userController.createUser);

// GET request to get a user by ID
router.get('/view/:id', userToken, userController.getUserById);

// PUT request to update a user by ID
router.put('/update/:id', userToken, userController.updateUser);

// DELETE request to delete a user by ID
router.delete('/delete/:id', userToken, userController.deleteUser);

module.exports = router;


// const express = require('express');
// const router = express.Router();
// const userToken = require('../middleware/userToken');
// const userController = require('../controllers/userController');

// // POST request to create a new user
// router.post('/create', userController.createUser);

// // GET request to get a user by ID
// router.get('/view/:id', userToken, userController.getUserById);

// // PUT request to update a user by ID
// router.put('/update/:id', userToken, userController.updateUser);

// // DELETE request to delete a user by ID
// router.delete('/delete/:id', userToken, userController.deleteUser);

// module.exports = router;


// const express = require('express');
// const router = express.Router();
// const userToken = require('../middleware/userToken');
// const userController = require('../controllers/userController');

// // POST request to create a new user
// router.post('/create', userController.createUser);

// // GET request to get a user by ID
// router.get('/view/:id', userToken, userController.getUserById);

// // PUT request to update a user by ID
// router.put('/update/:id', userToken, userController.updateUser);

// // DELETE request to delete a user by ID
// router.delete('/delete/:id', userToken, userController.deleteUser);

// module.exports = router;


// const express = require('express');
// const router = express.Router();
// const userToken = require('./../middleware/userToken');
// const uploadMiddleware = require('../middlewares/uploadMiddleware');
// const userController = require('../controllers/userController');

// // POST request to create a new user
// // router.post('/', uploadMiddleware.single('avatar'), userController.createUser);
// router.post('/', userToken, userController.createUser);

// // router.post('/file/upload', userToken, uploadMiddleware, userController.createUser); // Route to upload a file


// // GET request to get a user by ID
// router.get('/:id', userToken, userController.getUserById);

// // PUT request to update a user by ID
// router.put('/:id', userToken, userController.updateUser);

// // DELETE request to delete a user by ID
// router.delete('/:id', userToken, userController.deleteUser);

// module.exports = router;
