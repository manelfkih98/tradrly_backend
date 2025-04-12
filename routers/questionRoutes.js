const express=require('express')
const {addQuestion,getAllQuestion,updateQuestion,deleteQuestion}=require('../controllers/questionController')
const router=express.Router()


router.post('/addQuestion',addQuestion)
router.get('/getAllQuestion',getAllQuestion)
router.put('/updateQuestion/:id',updateQuestion)
router.delete('/deleteQuestion/:id',deleteQuestion)

module.exports=router