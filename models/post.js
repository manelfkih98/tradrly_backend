const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    jobId: {  
        type: mongoose.Schema.Types.ObjectId,  
        ref: 'offre', 
       
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, ]
    },
    number: {
        type: String,
        required: true
    },
    niveau: {
        type: String,
        required: true,
       
    },
    cv_local_url: {
        type: String, 
        required: true,
      },
      cv_google_drive_url: {
        type: String, 
        required: true,
      },
      password:{type:String,require},
      testCompleted: { type: Boolean, default: false }, 
      status: {
        type: String,
        enum: ['pending', 'refused', 'testPassed'],
        default: 'pending'
      },


    
}, { timestamps: true });  

const Post = mongoose.model('Post', PostSchema);
module.exports = Post;
