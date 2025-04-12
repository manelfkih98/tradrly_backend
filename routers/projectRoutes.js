const express  = require('express')
const {addProject,getAllProject,getProjectById,deleteProject,updateProject}=require("../controllers/projectController")
const router =express.Router()
  

router.post("/addProject",addProject)
router.get("/allProject",getAllProject)
router.get("/getProjectById/:id",getProjectById)
router.delete("/deleteProject/:id",deleteProject)
router.put("/updateproject/:id",updateProject)

module.exports=router
