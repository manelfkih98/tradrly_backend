const express = require("express");
const upload = require("../middleware/upload"); 
const { addPost,
    getAllPostStage,
    getAllPostJob,
    getPostsByJobId,
    refuser,
    accepter,
    addPostWithoutOffre,
    getPostWithoutOffre,
    refuserDemande,
    accepterDemande,
    loginCandidat,
    markTestCompleted,
    verifier,
    getPostByEmail,
loginEmail,
markTestViewed ,
getPostByFileName,
updatePost,

updateCv} = require("../controllers/postController");

const router=express.Router()


router.post("/addPost",upload.none(), addPost);
 router.get("/getAllPostStage",getAllPostStage)
 router.get("/getAllPostJob",getAllPostJob)
 router.get("/postByOffre/:jobId",getPostsByJobId)
 router.post("/refuser/:id",refuser)
 router.post("/accepter/:id",accepter)
 router.post("/addPostWithoutOffre", upload.none(),addPostWithoutOffre)
 router.get('/postWithoutOffre',getPostWithoutOffre)
 router.post("/refuserDemande/:id",refuserDemande)
 router.post("/accepterDemande/:id",accepterDemande)
 router.post("/connecter",loginCandidat)
 router.put("/mark-completed/:id", markTestCompleted);
router.get("/verifier/:id",verifier)
router.post("/postByEmail",getPostByEmail)
router.post("/loginEmail",loginEmail)
router.put('/update-cv',  updateCv);
router.put('/mark-viewed/:id', markTestViewed);
router.get('/getPostByFileName/:fileName', getPostByFileName);
router.put('/updatePost/:id', updatePost);




module.exports=router