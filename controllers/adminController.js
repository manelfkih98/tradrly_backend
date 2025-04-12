const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Admin = require("../models/admin");

const generateAccessToken = (admin) => {
    return jwt.sign({ id: admin._id, email: admin.email }, process.env.JWT_SECRET_KEY, { expiresIn: "1m" });
};

const generateRefreshToken = (admin) => {
    return jwt.sign({ id: admin._id, email: admin.email }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

const registerAdmin = async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: "Email déjà utilisé !" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newAdmin = new Admin({ fullName, email, password: hashedPassword });
        await newAdmin.save();
      
        const accessToken = generateAccessToken(newAdmin);
        const refreshToken = generateRefreshToken(newAdmin);

     
        newAdmin.refreshTokens.push(refreshToken);
        await newAdmin.save();

        res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "Strict" });
        res.status(201).json({ message: "Admin inscrit avec succès !", accessToken });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", errorr:error.message });
    }
};

const loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email });
        if (!admin) return res.status(400).json({ message: "Admin non trouvé !" });

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(401).json({ message: "Mot de passe incorrect !" });

        const accessToken = generateAccessToken(admin);
        const refreshToken = generateRefreshToken(admin);

       
        admin.refreshTokens.push(refreshToken);
        await admin.save();

        res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "Strict" });
        res.json({ message: "Connexion réussie", accessToken });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

module.exports = { registerAdmin, loginAdmin };
