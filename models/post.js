const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'offre',
  },
  nom: {
    type: String,
    required: true
  },
  prenom: {
    type: String,
    required: true
  },
  titre: {
    type: String,
    required: true
  },
  telephone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/]
  },
  adresse: {
    type: String,
    required: true
  },
  linkedin: {
    type: String,
    required: true
  },
  profil: {
    type: String,
    required: true
  },
  competences: {
    type: [String],
    required: true
  },
  generales: {
    type: [String],
    required: true
  },
  langues: {
    type: [String],
    required: true
  },
  dateNaissance: {
    type: Date,
    required: true
  },
 
  cv_google_drive_url: {
    type: String,
    required: true
  },
  password: {
    type: String,
    default: ""
  },
  testCompleted: {
    type: Boolean,
    default: false
  },
  testViewed: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pending', 'refused', 'testPassed'],
    default: 'pending'
  },

  // 🔽 Champs ajoutés pour le filtre
  niveauEtude: {
    type: String
  },
  departement: {
    type: String
  },

  scoreTechnique: {
    type: Number,
    default: null
  },
   fileName :{
    type: String,
    required: true
   }
  

}, { timestamps: true });

const Post = mongoose.model('Post', PostSchema);
module.exports = Post;
