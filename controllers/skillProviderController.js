// const skillProviderService = require('../services/skillProviderService');

// async function createSkillProvider(req, res) {
//     try {
//         const { firstName, lastName, email, password, phone, secondPhone, stateOfResidence, city, street, serviceType, subCategory, openingHour, referralCode } = req.body;

//         // Check if an image file is uploaded
//         const imagePath = req.file ? req.file.path : null;

//         // Call the service layer function to create the skill provider with or without an image path
//         const newSkillProvider = await skillProviderService.createSkillProvider({ firstName, lastName, email, password, phone, secondPhone, stateOfResidence, city, street, serviceType, subCategory, openingHour, referralCode, imagePath });
        
//         // Return success response with the newly created skill provider data, including the imagePath
//         res.status(201).json({ success: true, skillProvider: newSkillProvider });
//     } catch (error) {
//         // Return error response if any error occurs during the process
//         res.status(500).json({ success: false, error: error.message });
//     }
// }

// async function getAllSkillProviders(req, res) {
//     try {
//         const skillProviders = await skillProviderService.getAllSkillProviders();
//         res.status(200).json({ success: true, skillProviders });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// }

// async function getSkillProviderById(req, res) {
//     try {
//         const skillProviderId = req.params.id;
//         const skillProvider = await skillProviderService.getSkillProviderById(skillProviderId);
//         if (!skillProvider) {
//             res.status(404).json({ success: false, error: 'Skill provider not found' });
//             return;
//         }
//         res.status(200).json({ success: true, skillProvider });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// }

// async function updateSkillProviderProfileWithImage(req, res) {
//     try {
//         const skillProviderId = req.params.id;
//         const { firstName, lastName, email, password, phone, secondPhone, stateOfResidence, city, street, serviceType, subCategory, openingHour, referralCode } = req.body;

//         // Check if an image file is uploaded
//         const imagePath = req.file ? req.file.path : null;
        
//         // Check if a file is uploaded
//         if (!req.file) {
//             return res.status(400).json({ success: false, error: 'No image uploaded' });
//         }

//         // Call the service layer function to update the skill provider profile with image
//         const updatedSkillProvider = await skillProviderService.updateSkillProviderProfileWithImage(skillProviderId, {  firstName, lastName, email, password, phone, secondPhone, stateOfResidence, city, street, serviceType, subCategory, openingHour, referralCode, imagePath });

//         res.status(200).json({ success: true, skillProvider: updatedSkillProvider });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// }

// async function deleteSkillProvider(req, res) {
//     try {
//         const skillProviderId = req.params.id;
//         await skillProviderService.deleteSkillProvider(skillProviderId);
//         res.status(200).json({ success: true, message: 'Skill provider deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// }

// async function createSkillType(req, res) {
//     try {
//         const { serviceType, subCategory } = req.body;
//         const skillTypeId = await skillProviderService.createSkillType(serviceType, subCategory);
//         res.status(201).json({ success: true, skillTypeId });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// }

// async function getSkillTypeById(req, res) {
//     try {
//         const typeId = req.params.id;
//         const skillType = await skillProviderService.getSkillTypeById(typeId);
//         res.status(200).json({ success: true, skillType });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// }

// async function getAllSkillTypes(req, res) {
//     try {
//         const skillTypes = await skillProviderService.getAllSkillTypes();
//         res.status(200).json({ success: true, skillTypes });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// }

// async function updateSkillType(req, res) {
//     try {
//         const { id, serviceType, subCategory } = req.body;
//         await skillProviderService.updateSkillType(id, serviceType, subCategory);
//         res.status(200).json({ success: true, message: 'Skill type updated successfully' });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// }

// async function deleteSkillType(req, res) {
//     try {
//         const typeId = req.params.id;
//         await skillProviderService.deleteSkillType(typeId);
//         res.status(200).json({ success: true, message: 'Skill type deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// }

// module.exports = {
//     createSkillProvider,
//     getAllSkillProviders,
//     getSkillProviderById,
//     updateSkillProviderProfileWithImage,
//     deleteSkillProvider,
//     createSkillType,
//     getSkillTypeById,
//     getAllSkillTypes,
//     updateSkillType,
//     deleteSkillType
// };


const skillProviderService = require('../services/skillProviderService');



async function createSkillProvider(req, res) {
    try {
        const { firstName, lastName, email, password, phone, secondPhone, stateOfResidence, city, street, serviceType, subCategory, openingHour, referralCode } = req.body;

        // Check if an image file is uploaded
        const imagePath = req.file ? req.file.path : null;

        // If no image file is uploaded, return an error response
        // if (!imagePath) {
        //     return res.status(400).json({ success: false, error: 'No image uploaded' });
        // }

        // Call the service layer function to create the skill provider with or without an image path
        const newSkillProvider = await skillProviderService.createSkillProvider({ firstName, lastName, email, password, phone, secondPhone, stateOfResidence, city, street, serviceType, subCategory, openingHour, referralCode, imagePath });
        
        // Return success response with the newly created skill provider data, including the imagePath
        res.status(201).json({ success: true, skillProvider: newSkillProvider });
    } catch (error) {
        // Return error response if any error occurs during the process
        res.status(500).json({ success: false, error: error.message });
    }
}


async function getAllSkillProviders(req, res) {
    try {
        const skillProviders = await skillProviderService.getAllSkillProviders();
        res.status(200).json({ success: true, skillProviders });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

async function getSkillProviderById(req, res) {
    try {
        const skillProviderId = req.params.id;
        const skillProvider = await skillProviderService.getSkillProviderById(skillProviderId);
        if (!skillProvider) {
            res.status(404).json({ success: false, error: 'Skill provider not found' });
            return;
        }
        res.status(200).json({ success: true, skillProvider });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

// async function update(req, res){
//     try {
//         const { id } = req.params; // Extract skill provider ID from request parameters
//         const newData = req.body; // Extract updated data from request body

//         // Call the updateSkillProvider service function to update the skill provider
//         const updatedSkillProvider = await skillProviderService.update(id, newData);

//         // Send a success response with the updated skill provider data
//         res.status(200).json({
//             success: true,
//             message: 'Skill provider updated successfully',
//             skillProvider: updatedSkillProvider
//         });
//     } catch (error) {
//         // Handle errors
//         res.status(500).json({
//             success: false,
//             message: 'Failed to update skill provider',
//             error: error.message
//         });
//     }
// };


async function update (req, res) {
    try {
        const { id } = req.params; // Extract skill provider ID from request parameters
        const newData = req.body; // Extract updated data from request body

        // Retrieve existing skill provider data from the database
        const existingSkillProvider = await skillProviderService.getSkillProviderById(id);

        if (!existingSkillProvider) {
            return res.status(404).json({
                success: false,
                message: 'Skill provider not found'
            });
        }

        // Merge existing data with new data, updating only the provided parameters
        const updatedSkillProviderData = { ...existingSkillProvider, ...newData };

        // Call the updateSkillProvider service function to update the skill provider
        const updatedSkillProvider = await skillProviderService.update(id, updatedSkillProviderData);

        // Extract only the desired fields for the response
        const responseSkillProviderData = {
            firstName: updatedSkillProvider.firstName,
            lastName: updatedSkillProvider.lastName,
            email: updatedSkillProvider.email,
            phone: updatedSkillProvider.phone,
            secondPhone: updatedSkillProvider.secondPhone,
            stateOfResidence: updatedSkillProvider.stateOfResidence,
            city: updatedSkillProvider.city,
            street: updatedSkillProvider.street,
            address: updatedSkillProvider.address,
            serviceType: updatedSkillProvider.serviceType,
            subCategory: updatedSkillProvider.subCategory,
            openingHour: updatedSkillProvider.openingHour,
            referralCode: updatedSkillProvider.referralCode
        };

        // Send a success response with the updated skill provider data
        res.status(200).json({
            success: true,
            message: 'Skill provider updated successfully',
            skillProvider: responseSkillProviderData
        });
    } catch (error) {
        // Handle errors
        res.status(500).json({
            success: false,
            message: 'Failed to update skill provider',
            error: error.message
        });
    }
};


async function updateSkillProviderProfileWithImage(req, res) {
    try {
        const skillProviderId = req.params.id;
        const { firstName, lastName, email, password, phone, secondPhone, stateOfResidence, city, street, serviceType, subCategory, openingHour, referralCode } = req.body;

        // Check if an image file is uploaded
        const imagePath = req.file ? req.file.path : null;
        
        // Check if a file is uploaded
        if (!req.file) {
            return res.status(400).json({ success: false, error: 'No image uploaded' });
        }

        // Call the service layer function to update the skill provider profile with image
        const updatedSkillProvider = await skillProviderService.updateSkillProviderProfileWithImage(skillProviderId, {  firstName, lastName, email, password, phone, secondPhone, stateOfResidence, city, street, serviceType, subCategory, openingHour, referralCode, imagePath });

        res.status(200).json({ success: true, skillProvider: updatedSkillProvider });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}


// async function updateSkillProviderProfileWithImage(req, res) {
    
//     try {
//         const providerId = req.params.id;

//         const {  firstName, lastName, email, password, phone, secondPhone, stateOfResidence, city, street, serviceType, subCategory, openingHour, referralCode } = req.body;
//         // Check if a file is uploaded
        
//         const imagePath = req.file.path; // Assuming you're storing the image path in req.file.path
        
//         if (!imagePath) {
//             return res.status(400).json({ success: false, error: 'No image uploaded' });
//         }
//         // Update customer information including the image path
//         const updatedSkillProvider = await skillProviderService.updateSkillProviderProfileWithImage(providerId, {  firstName, lastName, email, password, phone, secondPhone, stateOfResidence, city, street, serviceType, subCategory, openingHour, referralCode, imagePath });

//         res.status(200).json({ success: true, skillProvider: updatedSkillProvider });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }

// };



async function patchUpdateSkillProvider(req, res) {
    try {
        const providerId = req.params.id;
        const updatedFields = req.body;

        // Check if an image file is uploaded
        const imagePath = req.file ? req.file.path : null;

        // Add imagePath to updatedFields if it exists
        if (imagePath) {
            updatedFields.imagePath = imagePath;
        }

        // Call the service layer function to update the skill provider profile with partial updates
        const updatedSkillProvider = await skillProviderService.patchUpdateSkillProvider(providerId, updatedFields);

        res.status(200).json({ success: true, skillProvider: updatedSkillProvider });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}


async function patchUpdateSkillProvider(req, res) {
    try {
        const providerId = req.params.id;
        const updatedFields = req.body;

        // Check if an image file is uploaded
        const imagePath = req.file ? req.file.path : null;

        // If an image file is uploaded, include its path in the update
        if (imagePath) {
            updatedFields.imagePath = imagePath;
        }

        // Call the service layer function to perform the update dynamically
        const updatedSkillProvider = await skillProviderService.patchUpdateSkillProvider(providerId, updatedFields);

        res.status(200).json({ success: true, skillProvider: updatedSkillProvider });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// const patchUpdateSkillProviderWithNoImage = async (req, res) => {
//     const providerId = req.params.id;
//     const updatedFields = req.body;

//     try {
//         const updatedProvider = await skillProviderService.patchUpdateSkillProviderWithNoImage(providerId, updatedFields);
//         res.status(200).json(updatedProvider);
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// };

const patchUpdateSkillProviderWithNoImage = async (req, res) => {
    const providerId = req.params.providerId;
    const updatedFields = req.body;

    try {
        const updatedProvider = await skillProviderService.patchUpdateSkillProvider(providerId, updatedFields);
        res.status(200).json({ success: true, data: updatedProvider });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};





// const patchUpdateSkillProviderWithNoImage = async (req, res, next) => {
//     const providerId = req.params.id;
//     const updatedFields = req.body;

//     try {
//         const updatedProvider = await skillProviderService.patchUpdateSkillProviderWithNoImage(providerId, updatedFields);
//         res.status(200).json(updatedProvider);
//     } catch (error) {
//         next(error);
//     }
// };



async function updateOnlyImage(req, res) {
    try {
        const providerId = req.params.id;
        const imagePath = req.file ? req.file.path : null;

        // Check if a file is uploaded
        if (!req.file) {
            return res.status(400).json({ success: false, error: 'No image uploaded' });
        }

        // Call the service layer function to update only the image of the skill provider
        const updatedSkillProvider = await skillProviderService.updateOnlyImage(providerId, imagePath);

        res.status(200).json({ success: true, skillProvider: updatedSkillProvider });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}



// async function patchUpdateSkillProvider(req, res) {
//     try {
//         const providerId = req.params.id;
//         const updatedFields = req.body;

//         const updatedProvider = await skillProviderService.patchUpdateSkillProvider(providerId, updatedFields);

//         res.status(200).json({ success: true, skillProvider: updatedProvider });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// }



async function deleteSkillProvider(req, res) {
    try {
        const skillProviderId = req.params.id;
        await skillProviderService.deleteSkillProvider(skillProviderId);
        res.status(200).json({ success: true, message: 'Skill provider deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}




module.exports = {
    update,
    createSkillProvider,
    getAllSkillProviders,
    getSkillProviderById,
    updateSkillProviderProfileWithImage,
    deleteSkillProvider,
    patchUpdateSkillProvider,
    updateOnlyImage,
    patchUpdateSkillProviderWithNoImage
};


// const skillProviderService = require('../services/skillProviderService');
// const fs = require('fs');


// const skillProviderController = {};





// skillProviderController.createSkillProvider = async (req, res) => {
//     try {
//         const { firstName, lastName, email, password, phone, secondPhone, stateOfResidence, city, street, serviceType, subCategory, openingHour, referralCode } = req.body;
//         const imagePath = req.file ? req.file.path : null; // Check if an image file is uploaded
        
//         // Call the service layer function to create the skill provider with or without an image path
//         const newSkillProvider = await skillProviderService.createSkillProvider({ firstName, lastName, email, password, phone, secondPhone, stateOfResidence, city, street, serviceType, subCategory, openingHour, referralCode, imagePath });
        
//         // Return success response with the newly created skill provider data
//         res.status(201).json({ success: true, skillProvider: newSkillProvider });
//     } catch (error) {
//         // Return error response if any error occurs during the process
//         res.status(500).json({ success: false, error: error.message });
//     }
// }




// // Controller function to handle creating a skill provider
// // skillProviderController.createSkillProvider = async (req, res) => {
// //     try {
// //         // Check for validation errors
// //         if (!req.files || Object.keys(req.files).length === 0) {
// //             return res.status(400).json({ success: false, message: 'No files were uploaded.' });
// //         }

// //         // Extract skill provider data from the request body
// //         const { firstName, lastName, email, password, phone, secondPhone, stateOfResidence, city, street, serviceType, subCategory, openingHour, referralCode } = req.body;

// //         // Extract image paths from the request files
// //         const { imagePath, cacImagePath } = req.files;

// //         // Call the service function to create the skill provider
// //         const skillProvider = await skillProviderService.createSkillProvider({ firstName, lastName, email, password, phone, secondPhone, stateOfResidence, city, street, serviceType, subCategory, openingHour, referralCode }, imagePath, cacImagePath);

// //         // Return success response
// //         res.status(201).json({ success: true, skillProvider });
// //     } catch (error) {
// //         console.error('Error creating skill provider:', error);
// //         res.status(500).json({ success: false, message: 'Internal server error' });
// //     }
// // };

// // // Controller function to handle updating a skill provider with image upload
// // skillProviderController.updateSkillProvider = async (req, res) => {
// //     try {
// //         // Check for validation errors
// //         if (!req.files || Object.keys(req.files).length === 0) {
// //             return res.status(400).json({ success: false, message: 'No files were uploaded.' });
// //         }

// //         // Extract skill provider data from the request body
// //         const { id } = req.params;
// //         const { firstName, lastName, email, phone, secondPhone, stateOfResidence, city, street, serviceType, subCategory, openingHour, referralCode } = req.body;

// //         // Extract image paths from the request files
// //         const { imagePath, cacImagePath } = req.files;

// //         // Call the service function to update the skill provider
// //         const updatedSkillProvider = await skillProviderService.updateSkillProvider(id, { firstName, lastName, email, phone, secondPhone, stateOfResidence, city, street, serviceType, subCategory, openingHour, referralCode }, imagePath, cacImagePath);

// //         // Return success response
// //         res.status(200).json({ success: true, skillProvider: updatedSkillProvider });
// //     } catch (error) {
// //         console.error('Error updating skill provider:', error);
// //         res.status(500).json({ success: false, message: 'Internal server error' });
// //     }
// // };


// // Create a new skill provider with google map
// skillProviderController.createSkillProviderWithGoogle = async (req, res) => {
//     try {
//         const skillProviderData = req.body;
//         const newSkillProvider = await skillProviderService.createSkillProviderWithGoogle(skillProviderData);
//         res.status(201).json(newSkillProvider);
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// };

// // Get all skill providers
// skillProviderController.getAllSkillProviders = async (req, res) => {
//     try {
//         const allSkillProviders = await skillProviderService.getAllSkillProviders();
//         res.status(200).json(allSkillProviders);
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// };

// // Get a skill provider by ID
// skillProviderController.getSkillProviderById = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const skillProvider = await skillProviderService.getSkillProviderById(id);
//         if (!skillProvider) {
//             return res.status(404).json({ success: false, error: 'Skill provider not found' });
//         }
//         res.status(200).json(skillProvider);
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// };

// // Update a skill provider by ID
// skillProviderController.updateSkillProvider = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const updates = req.body;
//         const updatedSkillProvider = await skillProviderService.updateSkillProvider(id, updates);
//         res.status(200).json(updatedSkillProvider);
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// };



// skillProviderController.updateSkillProviderProfileWithImage = async (req, res) => {
    
//     try {
//         const providerId = req.params.id;

//         const { firstName, lastName, email, password, phone, secondPhone, address, serviceType, serviceTypeCategory, openingHour, referralCode } = req.body;
//         // Check if a file is uploaded
        
//         const imagePath = req.file.path; // Assuming you're storing the image path in req.file.path
        
//         // if (!imagePath) {
//         //     return res.status(400).json({ success: false, error: 'No image uploaded' });
//         // }
//         // Update customer information including the image path
//         const updatedSkillProvider = await skillProviderService.updateSkillProviderProfileWithImage(providerId, { firstName, lastName, email, password, phone, secondPhone, address, serviceType, serviceTypeCategory, openingHour, referralCode, imagePath });

//         res.status(200).json({ success: true, skillProvider: updatedSkillProvider });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }

// };




// skillProviderController.deleteSkillProvider = async (req, res) => {
//     try {
//         const { id } = req.params;
//         await skillProviderService.deleteSkillProvider(id);
//         res.status(200).json({ success: true, message: 'Skill provider deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// };

// // Find nearest skill providers based on latitude and longitude
// skillProviderController.findNearestSkillProviders = async (req, res) => {
//     try {
//         const { latitude, longitude } = req.query;
//         const nearestSkillProviders = await skillProviderService.findNearestSkillProviders(latitude, longitude);
//         res.status(200).json(nearestSkillProviders);
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// };

// module.exports = skillProviderController;



// const skillProviderService = require('../services/skillProviderService');

// const skillProviderController = {};

// // Create a new skill provider
// skillProviderController.createSkillProvider = async (req, res) => {
//     try {
//         const skillProviderData = req.body;
//         const newSkillProvider = await skillProviderService.createSkillProvider(skillProviderData);
//         res.status(201).json(newSkillProvider);
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// };

// // Get all skill providers
// skillProviderController.getAllSkillProviders = async (req, res) => {
//     try {
//         const allSkillProviders = await skillProviderService.getAllSkillProviders();
//         res.status(200).json(allSkillProviders);
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// };

// // Get a skill provider by ID
// skillProviderController.getSkillProviderById = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const skillProvider = await skillProviderService.getSkillProviderById(id);
//         if (!skillProvider) {
//             return res.status(404).json({ success: false, error: 'Skill provider not found' });
//         }
//         res.status(200).json(skillProvider);
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// };

// // Update a skill provider by ID
// skillProviderController.updateSkillProvider = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const updates = req.body;
//         const updatedSkillProvider = await skillProviderService.updateSkillProvider(id, updates);
//         res.status(200).json(updatedSkillProvider);
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// };

// // Delete a skill provider by ID
// skillProviderController.deleteSkillProvider = async (req, res) => {
//     try {
//         const { id } = req.params;
//         await skillProviderService.deleteSkillProvider(id);
//         res.status(200).json({ success: true, message: 'Skill provider deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// };

// module.exports = skillProviderController;



// const SkillProviderService = require('../services/skillProviderService');

// // Controller function to handle creating a new skill provider
// exports.createSkillProvider = async (req, res, next) => {
//     try {
//         const { firstName, lastName, email, phone, address, serviceType, serviceTypeCategory, openingHour, referralCode, userId } = req.body;
//         const skillProviderData = { firstName, lastName, email, phone, address, serviceType, serviceTypeCategory, openingHour, referralCode, userId };
//         const skillProvider = await SkillProviderService.createSkillProvider(skillProviderData);
//         res.status(201).json({ success: true, data: skillProvider });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// };

// // Controller function to handle getting a skill provider by ID
// exports.getSkillProviderById = async (req, res, next) => {
//     try {
//         const { id } = req.params;
//         const skillProvider = await SkillProviderService.getSkillProviderById(id);
//         if (!skillProvider) {
//             res.status(404).json({ success: false, message: 'Skill provider not found' });
//             return;
//         }
//         res.status(200).json({ success: true, data: skillProvider });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// };

// // Controller function to handle updating a skill provider
// exports.updateSkillProvider = async (req, res, next) => {
//     try {
//         const { id } = req.params;
//         const updates = req.body;
//         const updatedSkillProvider = await SkillProviderService.updateSkillProvider(id, updates);
//         res.status(200).json({ success: true, data: updatedSkillProvider });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// };

// // Controller function to handle deleting a skill provider
// exports.deleteSkillProvider = async (req, res, next) => {
//     try {
//         const { id } = req.params;
//         await SkillProviderService.deleteSkillProvider(id);
//         res.status(200).json({ success: true, message: 'Skill provider deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// };
