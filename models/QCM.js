const mongoose = require("mongoose");

const QCMSchema = new mongoose.Schema({
  post_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "question" }],
  resultat: { type: Number, require: true },
});

module.exports = mongoose.model("QCM", QCMSchema);
