const mongoose =require('mongoose')

const offreShema=new mongoose.Schema({

  titre: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true 
    },
    date_publi: {
        type: Date,
        default: Date.now
    },
    date_limite: {
        type: Date,
        required: true
    },
    departement: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'departements',
        required: true
    },
    type: {
        type: String,
        enum: ['job', 'stage'],
        required: true
    }
}, { timestamps: true });


const Offre = mongoose.model('offre', offreShema);
module.exports = Offre;
