const express = require('express');
const userToken = require('./../middleware/userToken');
const customerController = require('../controllers/customerController');
const uploadMiddleware = require('../middleware/uploadMiddleware');


const router = express.Router();

router.post('/create', uploadMiddleware, customerController.createCustomer);

// router.post('/create', customerController.createCustomer);
router.get('/view/:id', customerController.getCustomerById);
router.get('/customers', customerController.getAllCustomers);
router.put('/update/:id', uploadMiddleware, customerController.updateCustomerWithImage);
// router.put('/update/:id', customerController.updateCustomer);
router.delete('/delete/:id', customerController.deleteCustomer);

module.exports = router;

