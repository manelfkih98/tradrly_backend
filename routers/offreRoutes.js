const express = require('express');

const { addOffreStage,addOffreJob,getAllOffres,getOffreById ,updateOffre,activateOffre,deleteOffre,getOffreStage,getOffreJob,deactivateOffre} = require('../controllers/offreController');
//const auth = require('../middleware/auth');
const router = express.Router();
router.post('/addOffreStage', addOffreStage);
router.post('/addOffreJob',addOffreJob)
router.get('/all', getAllOffres);
router.get('/offreById/:id', getOffreById);
router.put('/update/:id', updateOffre);
router.delete('/delete/:id', deleteOffre);
router.get('/offreByStage',getOffreStage)
router.get('/offreByJob',getOffreJob)
router.put('/deactivateOffre/:id_offre',deactivateOffre)
router.put('/activateOffre/:id_offre',activateOffre)

module.exports = router;
