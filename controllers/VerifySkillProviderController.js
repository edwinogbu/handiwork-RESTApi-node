const verifySkillProviderService = require('../services/verifySkillProviderService');

const fs = require('fs');

async function createVerifySkillProvider(req, res) {
    try {
        const { bio, profileUrl, socialPlatform, socialPlatformUrl, providerId, followers } = req.body;
        
        // Check if an image file is uploaded
        const cacImagePath = req.file ? req.file.path : null;

        // If no image file is uploaded, return an error response
        if (!cacImagePath) {
            return res.status(400).json({ success: false, error: 'No image uploaded' });
        }


        // Call the service layer function to create the verifySkillProvider with or without an image path
        const newVerifySkillProvider = await verifySkillProviderService.createVerifySkillProvider({ bio, profileUrl, socialPlatform, socialPlatformUrl, cacImagePath, providerId, followers });
        
        // Return success response with the newly created verifySkillProvider data
        res.status(201).json({ success: true, verifySkillProvider: newVerifySkillProvider });
    } catch (error) {
        // Return error response if any error occurs during the process
        res.status(500).json({ success: false, error: error.message });
    }
}

async function getVerifySkillProviderById(req, res) {
    try {
        const verifySkillProviderId = req.params.id;
        const verifySkillProvider = await verifySkillProviderService.getVerifySkillProviderById(verifySkillProviderId);
        if (!verifySkillProvider) {
            res.status(404).json({ success: false, error: 'Verify skill provider not found' });
            return;
        }
        res.status(200).json({ success: true, verifySkillProvider });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

async function getAllVerifySkillProviders(req, res) {
    try {
        const verifySkillProviders = await verifySkillProviderService.getAllVerifySkillProviders();
        res.status(200).json({ success: true, verifySkillProviders });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

async function updateVerifySkillProvider(req, res) {
    try {
        const verifySkillProviderId = req.params.id;
        const { bio, profileUrl, socialPlatform, socialPlatformUrl, providerId, followers } = req.body;
        
        // Check if a file is uploaded
        if (!req.file) {
            return res.status(400).json({ success: false, error: 'No image uploaded' });
        }

        const cacImagePath = req.file.path; // Assuming you're storing the image path in req.file.path
        
        // Update verifySkillProvider information including the image path
        const updatedVerifySkillProvider = await verifySkillProviderService.updateVerifySkillProvider(verifySkillProviderId, { bio, profileUrl, socialPlatform, socialPlatformUrl, providerId, followers, cacImagePath });

        res.status(200).json({ success: true, verifySkillProvider: updatedVerifySkillProvider });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

async function deleteVerifySkillProvider(req, res) {
    try {
        const verifySkillProviderId = req.params.id;
        await verifySkillProviderService.deleteVerifySkillProvider(verifySkillProviderId);
        res.status(200).json({ success: true, message: 'Verify skill provider deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

const getVerifySkillProviderDetailsById = async (req, res) => {
    try {
        const { id } = req.params;
        const skillProviderDetails = await verifySkillProviderService.getVerifySkillProviderDetailsById(id);
        if (skillProviderDetails) {
            res.status(200).json(skillProviderDetails);
        } else {
            res.status(404).json({ error: 'Skill provider not found' });
        }
    } catch (error) {
        console.error('Error getting skill provider details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};




// const updateSkillProviderDetails = async (req, res, next) => {
//     const skillProviderId = req.params.id;
//     const skillProviderData = req.body.skillProviderData;
//     const verifySkillProviderData = req.body.verifySkillProviderData;

//     try {
//         // Update both skill provider and verify skill provider details
//         const updatedSkillProvider = await skillProviderService.updateSkillProviderDetails(skillProviderId, skillProviderData);
//         const updatedVerifySkillProvider = await verifySkillProviderService.updateVerifySkillProviderDetails(skillProviderId, verifySkillProviderData);

//         res.json({
//             success: true,
//             message: 'Skill provider details updated successfully',
//             skillProvider: updatedSkillProvider,
//             verifySkillProvider: updatedVerifySkillProvider
//         });
//     } catch (error) {
//         next(error);
//     }
// };


// const updateSkillProviderDetails = async (req, res, next) => {
//     try {
//         const { id } = req.params;
//         const { skillProviderData, verifySkillProviderData } = req.body;

//         // Check if both skillProviderData and verifySkillProviderData are provided
//         if (!skillProviderData || !verifySkillProviderData) {
//             return res.status(400).json({ error: "Both skillProviderData and verifySkillProviderData are required" });
//         }

//         // Update skill provider and verify skill provider details
//         const updatedSkillProvider = await verifySkillProviderService.updateSkillProviderDetails(id, skillProviderData, verifySkillProviderData);
//         res.json(updatedSkillProvider);
//     } catch (error) {
//         next(error);
//     }
// };

const updateSkillProviderDetails = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { skillProviderData, verifySkillProviderData } = req.body;

        // Check if both skillProviderData and verifySkillProviderData are provided
        if (!skillProviderData || !verifySkillProviderData) {
            return res.status(400).json({ error: "Both skillProviderData and verifySkillProviderData are required" });
        }

        // Update skill provider and verify skill provider details
        const updatedSkillProvider = await verifySkillProviderService.updateSkillProviderDetails(id, skillProviderData, verifySkillProviderData);
        res.json(updatedSkillProvider);
    } catch (error) {
        next(error);
    }
};


// const addSocialMedia = async (req, res) => {
//     const { id } = req.params;
//     const { socialPlatform, socialPlatformUrl } = req.body;

//     try {
//         const updatedSocialMedia = await verifySkillProviderService.addSocialMedia(id, { socialPlatform, socialPlatformUrl });
//         res.json(updatedSocialMedia);
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to add or update social media data' });
//     }
// };


const checkVerificationStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const verificationStatus = await verifySkillProviderService.checkVerificationStatus(id);
        res.status(200).json(verificationStatus);
    } catch (error) {
        next(error);
    }
};




// Controller function to update the CAC image path
const updateCACImage = async (req, res) => {
    const { id } = req.params;
    const { cacImageFilePath } = req.body;
    try {
        const result = await verifySkillProviderService.updateCACImage(id, cacImageFilePath);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controller function to view all CAC images
const viewAllCAC = async (req, res) => {
    try {
        const result = await verifySkillProviderService.viewAllCAC();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controller function to delete a CAC image
const deleteCAC = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await verifySkillProviderService.deleteCAC(id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controller function to create a new entry in verify_skill_providers table with CAC image file
const createSkillProviderCAC = async (req, res) => {
    const { cacImageFile } = req.body;
    try {
        const result = await verifySkillProviderService.createSkillProviderCAC(cacImageFile);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = {
    createVerifySkillProvider,
    getVerifySkillProviderById,
    getAllVerifySkillProviders,
    updateVerifySkillProvider,
    deleteVerifySkillProvider,
    getVerifySkillProviderDetailsById,
    updateSkillProviderDetails,
    // addSocialMedia,
    checkVerificationStatus,
    updateCACImage,
viewAllCAC,
deleteCAC,
createSkillProviderCAC,
};
