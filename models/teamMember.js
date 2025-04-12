const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String, 
    required: true,
  },
  quote: {
    type: String,
    required: true,
  },
  linkedin: {
    type: String,
    required: true, 
  },
}, { timestamps: true }); // Adds createdAt and updatedAt fields

module.exports = mongoose.model('teamMember', teamMemberSchema);