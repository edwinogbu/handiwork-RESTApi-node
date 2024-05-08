const express = require('express');
const router = express.Router();
const userToken = require('./../middleware/userToken');
const skillProviderController = require('../controllers/skillProviderController');
const uploadMiddleware = require('../middleware/uploadMiddleware');

// Route to create a new skill provider
router.post('/create', uploadMiddleware, skillProviderController.createSkillProvider);

// Route to create a new skill provider
// router.post('/createWithCoordinate', skillProviderController.createSkillProviderWithGoogle);

// Route to get all skill providers
router.get('/skillproviders',  skillProviderController.getAllSkillProviders);

// Route to get a skill provider by ID
router.get('/view/:id', skillProviderController.getSkillProviderById);

// Route to update a skill provider by ID
// router.put('/update/:id', skillProviderController.updateSkillProvider);
router.put('/updateSkillProvider/:id', uploadMiddleware, skillProviderController.updateSkillProviderProfileWithImage);

// PATCH route to update a skill provider by ID
router.patch('/update/:id',  uploadMiddleware, skillProviderController.update);

// Route to update a skill provider by ID using PATCH
router.patch('/updateSkillParam/:id', uploadMiddleware, skillProviderController.patchUpdateSkillProvider);
// router.patch('/patchUpdate/:id', uploadMiddleware, skillProviderController.patchUpdate);


// Route to delete a skill provider by ID
router.delete('/delete/:id', userToken, skillProviderController.deleteSkillProvider);
// router.delete('/find-skillProvider/:id', skillProviderController.findNearestSkillProviders);

// const { updateOnlyImage } = require('../controllers/skillProviderController');

// Route to update only the image of a skill provider
router.put('/providers-image/:id', uploadMiddleware, skillProviderController.updateOnlyImage);

// Route for updating a skill provider
// router.patch('/updateProvider-withNoImage/:id', skillProviderController.patchUpdateSkillProviderWithNoImage);

// Route for updating a skill provider without updating the image
router.patch('/updateOnlyParams/:id', uploadMiddleware, skillProviderController.patchUpdateSkillProviderWithNoImage);

// Route for updating a skill provider without updating the image
// router.patch('/parametersUpdate/:id', uploadMiddleware, skillProviderController.updateSkillProvidersOnly);

// Skill Type Routes
// router.post('/types/create', skillProviderController.createSkillType);
// router.get('/types/all', skillProviderController.getAllSkillTypes);
// router.get('/types/:id', skillProviderController.getSkillTypeById);
// router.put('/types/update/:id', skillProviderController.updateSkillType);
// router.delete('/types/delete/:id', skillProviderController.deleteSkillType);



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
