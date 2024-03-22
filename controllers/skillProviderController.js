const skillProviderService = require('../services/skillProviderService');

const skillProviderController = {};


// Create a new skill provider
// skillProviderController.createSkillProvider = async (req, res) => {
//     try {
//         const skillProviderData = req.body;
//         const newSkillProvider = await skillProviderService.createSkillProvider(skillProviderData);
//         res.status(201).json(newSkillProvider);
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// };



// Create a new skill provider
skillProviderController.createSkillProvider = async (req, res) => {
    try {
        const skillProviderData = req.body;
        const newSkillProvider = await skillProviderService.createSkillProvider(skillProviderData);
        res.status(201).json(newSkillProvider);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Create a new skill provider with google map
skillProviderController.createSkillProviderWithGoogle = async (req, res) => {
    try {
        const skillProviderData = req.body;
        const newSkillProvider = await skillProviderService.createSkillProviderWithGoogle(skillProviderData);
        res.status(201).json(newSkillProvider);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get all skill providers
skillProviderController.getAllSkillProviders = async (req, res) => {
    try {
        const allSkillProviders = await skillProviderService.getAllSkillProviders();
        res.status(200).json(allSkillProviders);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get a skill provider by ID
skillProviderController.getSkillProviderById = async (req, res) => {
    try {
        const { id } = req.params;
        const skillProvider = await skillProviderService.getSkillProviderById(id);
        if (!skillProvider) {
            return res.status(404).json({ success: false, error: 'Skill provider not found' });
        }
        res.status(200).json(skillProvider);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Update a skill provider by ID
skillProviderController.updateSkillProvider = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const updatedSkillProvider = await skillProviderService.updateSkillProvider(id, updates);
        res.status(200).json(updatedSkillProvider);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


skillProviderController.updateSkillProviderProfileWithImage = async (req, res) => {
    const { id } = req.params; // Extract skill provider ID from request params
    const updates = req.body; // Extract profile updates from request body
    const image = req.file; // Extract uploaded image from request

    try {
        // Call service function to update skill provider profile
        const updatedProfile = await skillProviderService.updateSkillProviderProfileWithImage(id, updates, image);

        // Return updated profile as JSON response
        res.json({
            success: true,
            message: 'Skill provider profile updated successfully',
            profile: updatedProfile
        });
    } catch (error) {
        // Handle errors and return error response
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
 
};

// Delete a skill provider by ID
skillProviderController.deleteSkillProvider = async (req, res) => {
    try {
        const { id } = req.params;
        await skillProviderService.deleteSkillProvider(id);
        res.status(200).json({ success: true, message: 'Skill provider deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Find nearest skill providers based on latitude and longitude
skillProviderController.findNearestSkillProviders = async (req, res) => {
    try {
        const { latitude, longitude } = req.query;
        const nearestSkillProviders = await skillProviderService.findNearestSkillProviders(latitude, longitude);
        res.status(200).json(nearestSkillProviders);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = skillProviderController;



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
