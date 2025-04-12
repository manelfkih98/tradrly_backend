const express=require("express")
const{addProposition,getAllPropositions,getPropositionById,updateProposition,deleteProposition} =require("../controllers/propositionController")
const route=express.Router()

route.post('/addprop',addProposition)
route.get('/getAll',getAllPropositions)
route.get('/getById/:id',getPropositionById)
route.put('/updateProp/:id',updateProposition)
route.delete('/deleteprop/:id',deleteProposition)

module.exports=route