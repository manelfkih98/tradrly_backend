const {addResponce,getResponceById,getAllResponces,updateResponce,deleteResponce}=require("../controllers/reponceController")
const express=require('express')


const route=express.Router()

route.post('/addReponce',addResponce)
route.get('/getResponceById/:id',getResponceById)
route.get('/getAllResponces',getAllResponces)
route.put('/updateResponce/:id',updateResponce)
route.delete('/deleteResponce/:id',deleteResponce)


module.exports=route