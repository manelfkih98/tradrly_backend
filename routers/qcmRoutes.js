const express=require('express')
const {generatQcm,updateResultat,getAllQcm,getQuestionByPost,generatQcmDemande}=require('../controllers/qcmController')
const router=express.Router()


router.post('/generatQcm/:postId',generatQcm)
router.put('/updateResultat/:id',updateResultat)
router.get('/allQcm',getAllQcm)
router.get('/getQuestionByPost/:id',getQuestionByPost)
router.post('/generatQcmDemande/:postId',generatQcmDemande)


module.exports=router