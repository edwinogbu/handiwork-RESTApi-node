const express = require('express');
const router = express.Router();
const userToken = require('./../middleware/userToken');
const customerController = require('../controllers/customerController');
const uploadMiddleware = require('../middleware/uploadMiddleware');



// Route to create a customer with file upload
// router.post('/create', uploadMiddleware, customerController.createCustomer);
router.post('/create', uploadMiddleware.single('file'), customerController.createCustomer);


// Route to retrieve a customer by ID
router.get('/view/:id', userToken, customerController.getCustomerById);

// Route to retrieve all customers
router.get('/customers', customerController.getAllCustomers);

// Route to update a customer's information
router.put('/update/:id', customerController.updateCustomer);

// Route to delete a customer
router.delete('/delete/:id', customerController.deleteCustomer);



module.exports = router;




// const express = require('express');
// const router = express.Router();
// const userToken = require('./../middleware/userToken');
// const customerController = require('../controllers/customerController');



// router.post('/create', customerController.createCustomer);
// router.get('/view/:id', customerController.getCustomerById);
// router.get('/customers', customerController.getAllCustomers);
// router.put('/update/:id', customerController.updateCustomer);
// router.delete('/delete/:id', customerController.deleteCustomer);

// module.exports = router;