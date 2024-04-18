const skillProviderTypesService = require('../services/skillProviderTypesService');

async function createSkillProviderType(req, res) {
    try {
        const { serviceType, subCategory, providerId } = req.body;

        // Call the service layer function to create the skill provider type
        const newSkillProviderType = await skillProviderTypesService.createSkillProviderType({ serviceType, subCategory, providerId });

        // Return success response with the newly created skill provider type data
        res.status(201).json({ success: true, skillProviderType: newSkillProviderType });
    } catch (error) {
        // Return error response if any error occurs during the process
        res.status(500).json({ success: false, error: error.message });
    }
}

async function getSkillProviderTypeById(req, res) {
    try {
        const skillProviderTypeId = req.params.id;
        const skillProviderType = await skillProviderTypesService.getSkillProviderTypeById(skillProviderTypeId);
        if (!skillProviderType) {
            res.status(404).json({ success: false, error: 'Skill provider type not found' });
            return;
        }
        res.status(200).json({ success: true, skillProviderType });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

async function getAllSkillProviderTypes(req, res) {
    try {
        const skillProviderTypes = await skillProviderTypesService.getAllSkillProviderTypes();
        res.status(200).json({ success: true, skillProviderTypes });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

async function updateSkillProviderType(req, res) {
    try {
        const skillProviderTypeId = req.params.id;
        const { serviceType, subCategory, providerId } = req.body;

        // Update skill provider type information
        const updatedSkillProviderType = await skillProviderTypesService.updateSkillProviderType(skillProviderTypeId, { serviceType, subCategory, providerId });

        res.status(200).json({ success: true, skillProviderType: updatedSkillProviderType });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

async function deleteSkillProviderType(req, res) {
    try {
        const skillProviderTypeId = req.params.id;
        await skillProviderTypesService.deleteSkillProviderType(skillProviderTypeId);
        res.status(200).json({ success: true, message: 'Skill provider type deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

module.exports = {
    createSkillProviderType,
    getSkillProviderTypeById,
    getAllSkillProviderTypes,
    updateSkillProviderType,
    deleteSkillProviderType,
};


// const skillProviderTypesService = require('../services/skillProviderTypesService');

// async function createSkillProviderType(req, res) {
//     try {
//         const { serviceType, subCategory, providerId } = req.body;
        
//         // Call the service layer function to create the skill provider type
//         const newType = await skillProviderTypesService.createSkillProviderType({ serviceType, subCategory, providerId });
        
//         // Return success response with the newly created skill provider type data
//         res.status(201).json({ success: true, type: newType });
//     } catch (error) {
//         // Return error response if any error occurs during the process
//         res.status(500).json({ success: false, error: error.message });
//     }
// }

// async function getAllSkillProviderTypes(req, res) {
//     try {
//         const types = await skillProviderTypesService.getAllSkillProviderTypes();
//         res.status(200).json({ success: true, types });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// }

// async function getSkillProviderTypeById(req, res) {
//     try {
//         const typeId = req.params.id;
//         const type = await skillProviderTypesService.getSkillProviderTypeById(typeId);
//         if (!type) {
//             res.status(404).json({ success: false, error: 'Skill Provider Type not found' });
//             return;
//         }
//         res.status(200).json({ success: true, type });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// }

// async function updateSkillProviderType(req, res) {
//     try {
//         const typeId = req.params.id;
//         const { serviceType, subCategory, providerId } = req.body;
        
//         // Update skill provider type information
//         const updatedType = await skillProviderTypesService.updateSkillProviderType(typeId, { serviceType, subCategory, providerId });
        
//         res.status(200).json({ success: true, type: updatedType });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// }

// async function deleteSkillProviderType(req, res) {
//     try {
//         const typeId = req.params.id;
//         await skillProviderTypesService.deleteSkillProviderType(typeId);
//         res.status(200).json({ success: true, message: 'Skill Provider Type deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// }

// module.exports = {
//     createSkillProviderType,
//     getAllSkillProviderTypes,
//     getSkillProviderTypeById,
//     updateSkillProviderType,
//     deleteSkillProviderType
// };
