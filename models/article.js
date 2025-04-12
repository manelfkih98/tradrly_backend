const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    
    name_article: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: 
       [ {type : String}]   
    
}, { timestamps: true });

const article = mongoose.model('article', articleSchema);
module.exports = article;
