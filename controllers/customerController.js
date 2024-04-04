const customerService = require('../services/customerService');
const fs = require('fs');

async function createCustomer(req, res) {
    try {
        const { firstName, lastName, email, password, phone, secondPhone, stateOfResidence, city, street } = req.body;
        const imagePath = req.file ? req.file.path : null; // Check if an image file is uploaded
        
        // Call the service layer function to create the customer with or without an image path
        const newCustomer = await customerService.createCustomer({ firstName, lastName, email, password, phone, secondPhone, stateOfResidence, city, street, imagePath });
        
        // Return success response with the newly created customer data
        res.status(201).json({ success: true, customer: newCustomer });
    } catch (error) {
        // Return error response if any error occurs during the process
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

async function updateCustomerWithImage(req, res) {
    try {
        const customerId = req.params.id;
        const { firstName, lastName, email, password, phone, address, stateOfResidence, city, street } = req.body;
        
        // Check if a file is uploaded
        if (!req.file) {
            return res.status(400).json({ success: false, error: 'No image uploaded' });
        }

        const imagePath = req.file.path; // Assuming you're storing the image path in req.file.path
        
        // Update customer information including the image path
        const updatedCustomer = await customerService.updateCustomerWithImage(customerId, { firstName, lastName, email, password, phone, secondPhone, address,  stateOfResidence, city, street, imagePath });

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
    updateCustomerWithImage,
    deleteCustomer
};



// const customerService = require('../services/customerService');
// const fs = require('fs');


// async function createCustomer(req, res) {
//     try {
//         const { firstName, lastName, email, password, phone, secondPhone, stateOfResidence, city, street } = req.body;
//         const imagePath = req.file ? req.file.path : null; // Check if an image file is uploaded
        
//         // Call the service layer function to create the customer with or without an image path
//         const newCustomer = await customerService.createCustomer({ firstName, lastName, email, password, phone, secondPhone, stateOfResidence, city, street, imagePath });
        
//         // Return success response with the newly created customer data
//         res.status(201).json({ success: true, customer: newCustomer });
//     } catch (error) {
//         // Return error response if any error occurs during the process
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




// async function updateCustomerWithImage(req, res) {
//     try {
//         const customerId = req.params.id;
//         const { firstName, lastName, email, password, phone, address, stateOfResidence, city, street } = req.body;
        
//         // Check if a file is uploaded
//         if (!req.file) {
//             return res.status(400).json({ success: false, error: 'No image uploaded' });
//         }

//         const imagePath = req.file.path; // Assuming you're storing the image path in req.file.path
        
//         // Update customer information including the image path
//         const updatedCustomer = await customerService.updateCustomerWithImage(customerId, { firstName, lastName, email, password, phone, secondPhone, address,  stateOfResidence, city, street, imagePath });

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
//     updateCustomerWithImage,
//     deleteCustomer
// };




// const customerService = require('../services/customerService');

// async function createCustomer(req, res) {
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




// const CustomerService = require('../services/customerService');

// // Controller function to handle creating a new customer
// exports.createCustomer = async (req, res, next) => {
//     try {
//         const { firstName, lastName, email, phone, address, userId } = req.body;
//         const customerData = { firstName, lastName, email, phone, address, userId };
//         const customer = await CustomerService.createCustomer(customerData);
//         res.status(201).json({ success: true, data: customer });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// };

// // Controller function to handle getting a customer by ID
// exports.getCustomerById = async (req, res, next) => {
//     try {
//         const { id } = req.params;
//         const customer = await CustomerService.getCustomerById(id);
//         if (!customer) {
//             res.status(404).json({ success: false, message: 'Customer not found' });
//             return;
//         }
//         res.status(200).json({ success: true, data: customer });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// };

// // Controller function to handle updating a customer
// exports.updateCustomer = async (req, res, next) => {
//     try {
//         const { id } = req.params;
//         const updates = req.body;
//         const updatedCustomer = await CustomerService.updateCustomer(id, updates);
//         res.status(200).json({ success: true, data: updatedCustomer });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// };

// // Controller function to handle deleting a customer
// exports.deleteCustomer = async (req, res, next) => {
//     try {
//         const { id } = req.params;
//         await CustomerService.deleteCustomer(id);
//         res.status(200).json({ success: true, message: 'Customer deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// };



// const customerService = require('../services/customerService');

// async function createCustomer(req, res) {
//     try {
//         const { firstName, lastName, email, password, phone, address } = req.body;
//         const imagePath = req.file.path; // Assuming you're storing the image path in req.file.path
//         const newCustomer = await customerService.createCustomer({ firstName, lastName, email, password, phone, address, imagePath });
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

