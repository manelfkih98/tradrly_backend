const express = require('express');

//const auth = require('../middleware/auth'); 
const upload = require('../middleware/upload'); 
const {addArticle,getAllActicle,getArticleById,deleteArticle,updateArticle}= require('../controllers/articleController');

const router = express.Router()
router.post('/add',  upload.array('images',5), addArticle);
router.get('/all',getAllActicle);
router.get('/articleById/:id', getArticleById);
router.delete('/deleteArticle/:id',deleteArticle)
router.put('/updateActicle/:id',updateArticle)

module.exports = router;
