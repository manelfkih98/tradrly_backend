const express = require("express");
const upload = require("../middleware/upload"); 
const { addPost,getAllPostStage,getAllPostJob,getPostsByJobId,refuser,accepter,addPostWithoutOffre,getPostWithoutOffre ,refuserDemande,accepterDemande,loginCandidat,markTestCompleted,verifier} = require("../controllers/postController");

const router=express.Router()


router.post("/addPost", addPost);
 router.get("/getAllPostStage",getAllPostStage)
 router.get("/getAllPostJob",getAllPostJob)
 router.get("/postByOffre/:jobId",getPostsByJobId)
 router.post("/refuser/:id",refuser)
 router.post("/accepter/:id",accepter)
 router.post("/addPostWithoutOffre",addPostWithoutOffre)
 router.get('/postWithoutOffre',getPostWithoutOffre)
 router.post("/refuserDemande/:id",refuserDemande)
 router.post("/accepterDemande/:id",accepterDemande)
 router.post("/connecter",loginCandidat)
 router.put("/mark-completed/:id", markTestCompleted);
router.get("/verifier/:id",verifier)



module.exports=router