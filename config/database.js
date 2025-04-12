const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://manel1:manel1232@cluster0.xl6lf.mongodb.net/tradrly", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Connexion à MongoDB réussie !");
    } catch (err) {
        console.error("Erreur de connexion à MongoDB :", err);
        process.exit(1); 
    }
};

module.exports = connectDB;
