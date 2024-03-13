const customerService = require('./../services/customerService');

async function createCustomer(req, res) {
    try {
        const { firstName, lastName, email, password, phone, address } = req.body;
        const { filename } = req.file; // Extract filename from uploaded file

        const newCustomerData = {
            firstName,
            lastName,
            email,
            password,
            phone,
            address,
            image: filename, // Add filename to customer data
        };

        // Create customer
        const newCustomer = await customerService.createCustomer(newCustomerData);
        res.status(201).json({ success: true, customer: newCustomer });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}


async function getCustomerById(req, res) {
    try {
        const customerId = req.params.id;
        const customer = await customerService.getCustomerById(customerId);
        if (!customer) {
            res.status(404).json({ success: false, error: 'Customer not found' });
            return;
        }
        res.status(200).json({ success: true, customer });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

async function getAllCustomers(req, res) {
    try {
        const customers = await customerService.getAllCustomers();
        res.status(200).json({ success: true, customers });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

async function updateCustomer(req, res) {
    try {
        const customerId = req.params.id;
        const updates = req.body;
        const updatedCustomer = await customerService.updateCustomer(customerId, updates);
        res.status(200).json({ success: true, customer: updatedCustomer });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

async function deleteCustomer(req, res) {
    try {
        const customerId = req.params.id;
        await customerService.deleteCustomer(customerId);
        res.status(200).json({ success: true, message: 'Customer deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

module.exports = {
    createCustomer,
    getCustomerById,
    getAllCustomers,
    updateCustomer,
    deleteCustomer
};



// const customerService = require('./../services/customerService');

// const customerController = {};


// customerController.createCustomer = async (req, res, next) => {
//     try {
//         const { firstName, lastName, email, password, phone, address } = req.body;
//         const customerData = { firstName, lastName, email, password, phone, address };
        
//         // Check if image file is uploaded
//         if (req.file) {
//             const createdCustomer = await customerService.createCustomerProfileWithImage(customerData, req.file);
//             res.status(201).json(createdCustomer);
//         } else {
//             const createdCustomer = await customerService.createCustomerWithOutImage(customerData);
//             res.status(201).json(createdCustomer);
//         }
//     } catch (error) {
//         next(error);
//     }
// };

// // customerController.getCustomerById = async (req, res, next) => {
// //     try {
// //         const { id } = req.params;
// //         const customer = await customerService.getCustomerById(id);
// //         res.status(200).json(customer);
// //     } catch (error) {
// //         next(error);
// //     }
// // };


// // Controller function to handle creating a new customer without an image
// customerController.createCustomerWithOutImage = async (req, res, next) => {
//     try {
//         const customerData = req.body;
//         const newCustomer = await customerService.createCustomerWithOutImage(customerData);
//         res.status(201).json(newCustomer);
//     } catch (error) {
//         next(error);
//     }
// };

// // Controller function to handle creating a new customer profile with an image
// customerController.createCustomerProfileWithImage = async (req, res, next) => {
//     try {
//         const customerData = req.body;
//         const imageFile = req.file;
//         const newCustomer = await customerService.createCustomerProfileWithImage(customerData, imageFile);
//         res.status(201).json(newCustomer);
//     } catch (error) {
//         next(error);
//     }
// };

// // Controller function to handle retrieving a customer by ID
// customerController.getCustomerById = async (req, res, next) => {
//     try {
//         const customerId = req.params.id;
//         const customer = await customerService.getCustomerById(customerId);
//         if (!customer) {
//             return res.status(404).json({ error: 'Customer not found' });
//         }
//         res.status(200).json(customer);
//     } catch (error) {
//         next(error);
//     }
// };

// // Controller function to handle retrieving all customers
// customerController.getAllCustomers = async (req, res, next) => {
//     try {
//         const customers = await customerService.getAllCustomers();
//         res.status(200).json(customers);
//     } catch (error) {
//         next(error);
//     }
// };

// // Controller function to handle updating a customer's information
// customerController.updateCustomer = async (req, res, next) => {
//     try {
//         const customerId = req.params.id;
//         const updates = req.body;
//         const updatedCustomer = await customerService.updateCustomer(customerId, updates);
//         res.status(200).json(updatedCustomer);
//     } catch (error) {
//         next(error);
//     }
// };

// // Controller function to handle deleting a customer
// customerController.deleteCustomer = async (req, res, next) => {
//     try {
//         const customerId = req.params.id;
//         await customerService.deleteCustomer(customerId);
//         res.status(204).end();
//     } catch (error) {
//         next(error);
//     }
// };

// // Controller function to handle retrieving a customer profile by ID
// customerController.getCustomerProfile = async (req, res, next) => {
//     try {
//         const customerId = req.params.id;
//         const customerProfile = await customerService.getCustomerProfile(customerId);
//         if (!customerProfile) {
//             return res.status(404).json({ error: 'Customer profile not found' });
//         }
//         res.status(200).json(customerProfile);
//     } catch (error) {
//         next(error);
//     }
// };

// // Controller function to handle retrieving profiles for all customers
// customerController.getAllCustomersProfile = async (req, res, next) => {
//     try {
//         const customerProfiles = await customerService.getAllCustomersProfile();
//         res.status(200).json(customerProfiles);
//     } catch (error) {
//         next(error);
//     }
// };

// module.exports = customerController;



// const customerService = require('../services/customerService');

//  (req, res) {
//     try {
//         const { firstName, lastName, email, password, phone, address } = req.body;
//         const newCustomer = await customerService.createCustomer({ firstName, lastName, email, password, phone, address });
//         res.status(201).json({ success: true, customer: newCustomer });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// }

// async function getCustomerById(req, res) {
//     try {
//         const customerId = req.params.id;
//         const customer = await customerService.getCustomerById(customerId);
//         if (!customer) {
//             res.status(404).json({ success: false, error: 'Customer not found' });
//             return;
//         }
//         res.status(200).json({ success: true, customer });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// }

// async function getAllCustomers(req, res) {
//     try {
//         const customers = await customerService.getAllCustomers();
//         res.status(200).json({ success: true, customers });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// }

// async function updateCustomer(req, res) {
//     try {
//         const customerId = req.params.id;
//         const updates = req.body;
//         const updatedCustomer = await customerService.updateCustomer(customerId, updates);
//         res.status(200).json({ success: true, customer: updatedCustomer });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// }

// async function deleteCustomer(req, res) {
//     try {
//         const customerId = req.params.id;
//         await customerService.deleteCustomer(customerId);
//         res.status(200).json({ success: true, message: 'Customer deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// }

// module.exports = {
//     createCustomer,
//     getCustomerById,
//     getAllCustomers,
//     updateCustomer,
//     deleteCustomer
// };


