const express =require('express')
const {getDashboardData,getPostulationsParOffreJob,getPostulationsParOffreStage}=require("../controllers/dashboardController")
const router=express.Router()


router.get('/getDataDashboard',getDashboardData)
router.get('/postulations-par-offre-job', getPostulationsParOffreJob);
router.get('/postulations-par-offre-stage', getPostulationsParOffreStage);


module.exports = router






