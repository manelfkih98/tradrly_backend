const express  = require('express')
const {addProject,getAllProject,getProjectById,deleteProject,updateProject}=require("../controllers/projectController")
const router =express.Router()
const upload = require('../middleware/upload_team'); 
  

router.post("/addProject",upload.single("image"),addProject)
router.get("/allProject",getAllProject)
router.get("/getProjectById/:id",getProjectById)
router.delete("/deleteProject/:id",deleteProject)
router.put("/updateproject/:id",updateProject)

module.exports=router
