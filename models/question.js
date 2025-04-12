const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
    trim: true,
  },
  reponse: {
    type: String,
    required: true,
    trim: true,
  },
  propositions: [
    {
      type: String,
      required: true,
      trim: true,
    },
  ],
  departement: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "departements",
    required: true,
  },
  
});

module.exports = mongoose.model("question", questionSchema);
