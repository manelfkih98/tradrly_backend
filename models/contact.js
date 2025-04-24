const mongoose = require("mongoose");

const CantactShema = new mongoose.Schema(
  {
    object: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      required: true,
      match: [
        /^[ a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
 
        "Veuillez entrer un email valide.",
      ],
    },
    subject: { type: String, required: true },
  },
  { timeseries: true }
);

const cantact = mongoose.model("Cantact", CantactShema);
module.exports = cantact;
