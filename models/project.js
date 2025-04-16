const mongoose=require('mongoose')

const ProjectSchema=new mongoose.Schema({
  name_project:{
    type:String,
    require:true
  },
  date_creation :{
    type:Date,
    require:true
  },
  image:{
    type:String,
    require:true
  },

  departementId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'departements',
        required: true
    }



})

const project = mongoose.model('Project', ProjectSchema);
module.exports = project;