const express = require('express');
const router = express.Router();
const skillProviderController = require('../controllers/skillProviderController');

// Route to create a new skill provider
router.post('/create', skillProviderController.createSkillProvider);

// Route to get all skill providers
router.get('/skillproviders', skillProviderController.getAllSkillProviders);

// Route to get a skill provider by ID
router.get('/view/:id', skillProviderController.getSkillProviderById);

// Route to update a skill provider by ID
router.put('/update/:id', skillProviderController.updateSkillProvider);

// Route to delete a skill provider by ID
router.delete('/delete/:id', skillProviderController.deleteSkillProvider);

module.exports = router;



// const express = require('express');
// const router = express.Router();
// const userToken = require('./../middleware/userToken');
// const skillProviderController = require('../controllers/skillProviderController');

// // POST request to create a new skill provider
// router.post('/create', userToken, skillProviderController.createSkillProvider);

// // GET request to get a skill provider by ID
// router.get('/view/:id', userToken, skillProviderController.getSkillProviderById);

// // PUT request to update a skill provider by ID
// router.put('/update/:id', userToken, skillProviderController.updateSkillProvider);

// // DELETE request to delete a skill provider by ID
// router.delete('/delete/:id', userToken, skillProviderController.deleteSkillProvider);

// module.exports = router;
