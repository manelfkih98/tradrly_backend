const mongoose = require("mongoose");

const propositionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "question", 
  },
});

module.exports = mongoose.model("proposition", propositionSchema);
