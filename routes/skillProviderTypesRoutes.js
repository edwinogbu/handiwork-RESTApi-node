const express = require('express');
const userToken = require('../middleware/userToken');
const skillProviderTypesController = require('../controllers/skillProviderTypesController');

const router = express.Router();

router.post('/create', skillProviderTypesController.createSkillProviderType);
router.get('/types', skillProviderTypesController.getAllSkillProviderTypes);
router.get('/type/:id', skillProviderTypesController.getSkillProviderTypeById);
router.put('/update/:id', skillProviderTypesController.updateSkillProviderType);
router.delete('/delete/:id', skillProviderTypesController.deleteSkillProviderType);

module.exports = router;
