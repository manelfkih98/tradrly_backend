const mongoose=require('mongoose')

const ProjectSchema=new mongoose.Schema({
  name_project:{
    type:String,
    require:true
  },
  description_project :{

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