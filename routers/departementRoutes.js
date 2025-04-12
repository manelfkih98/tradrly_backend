const express =require('express')
const {addDep,getAllDeps,getDepById,updateDep,deleteDep}=require("../controllers/departementControllr")
const auth = require('../middleware/auth');
const router=express.Router()

router.post('/add',addDep)
router.get('/allDep',getAllDeps)
router.get('/allDepById/:id',auth,getDepById)
router.put('/updateDep/:id',updateDep)
router.delete('/deleteDep/:id',deleteDep)
module.exports = router






