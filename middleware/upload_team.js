const multer = require("multer");
const path = require("path");

// Configuration du stockage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Dossier de stockage
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Ex: 1688327923.png
  },
});

const upload = multer({ storage });

module.exports = upload;
