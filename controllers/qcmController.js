
const question = require("../models/question");
const Departement = require("../models/departement");
const Post = require("../models/post");
const { all } = require("../routers/adminRoutes");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const QCM = require("../models/qcm");



exports.generatQcm = async (req, res) => {
  try {
    const postId = req.params.postId;

    if (!postId) {
      return res.status(400).json({ message: "L'ID du post est requis." });
    }

    const post = await Post.findById(postId).populate("jobId");

    if (!post) {
      return res.status(404).json({ message: "Post non trouvé." });
    }

    const departementFind = await Departement.findById(post.jobId.departement);

    if (!departementFind) {
      return res
        .status(404)
        .json({ message: "Département non trouvé pour ce post." });
    }

    const questions = await question.aggregate([
      { $match: { departement: departementFind._id } },
      { $sample: { size: 4 } },
    ]);

    if (!questions.length) {
      return res.status(404).json({
        message: "Aucune question trouvée pour ce département.",
      });
    }

   
    const newQCM = new QCM({
      post_id: postId,
      questions: questions.map((q) => q._id),
      resultat: 0,
    });

    const savedQCM = await newQCM.save();

    const populatedQCM = await QCM.findById(savedQCM._id).populate("questions");

    // Envoi de l'email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "manelfkih123@gmail.com",
        pass: "uwze prbc lohc kfzh",
      },
    });

    const plaintextPassword = generatePassword(8); // Increased length for security
    const hashedPassword = await bcrypt.hash(plaintextPassword, 10);

    // Update post with hashed password and invitation status
    post.password = hashedPassword;
    await post.save();

    const mailOptions = {
      from: `"Tradrly Recrutement" <${process.env.EMAIL_USER}>`,
      to: post.email,
      subject: `Invitation au test pour le poste de ${post.jobId.titre}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 >Bonjour ${post.name},</h2>
          <p>Nous vous remercions pour votre candidature au poste de <strong>${post.jobId.titre}</strong> chez Tradrly. Après examen de votre dossier, nous vous invitons à passer un test technique pour évaluer vos compétences.</p>
         <p>Veuillez utiliser le mot de passe suivant pour accéder à la plateforme :</p>

<p style="font-size: 16px; font-weight: bold;" >Identifiant : ${post.email}</p>

<p style="font-size: 16px; font-weight: bold; ">Mot de passe : ${plaintextPassword}</p> 


          <p>
            <a href="http://localhost:3000/loginCandidat/${postId}" style="display: inline-block; padding: 10px 20px; background-color: #4F46E5; color: #fff; text-decoration: none; border-radius: 5px;">Accéder au test</a>
          </p>
          <p>Nous vous souhaitons bonne chance !</p>
          <p style="margin-top: 20px;">
            <strong>Cordialement,</strong><br>
            L'équipe de recrutement<br>
            Tradrly
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    await Post.findByIdAndUpdate(postId, { status: 'testPassed' });

    return res.status(201).json({
      message: "QCM généré et email envoyé avec succès !",
      qcm: populatedQCM,
      emailInfo: info,
    });
  } catch (error) {
    console.error("Erreur lors de la création du QCM :", error);
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
};
exports.getAllQcm = async (req, res) => {
  try {
    const allQCM = await QCM.find().populate("post_id");
    


   

    return res.status(200).json(allQCM);
  } catch (error) {
    console.error("Erreur lors de la récupération des QCM :", error);
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
};

function generatePassword(length = 8) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }
  return password;
}

exports.updateResultat = async (req, res) => {
  try {
    const { id } = req.params;
    const { resultatQcm } = req.body;
    const qcm = await QCM.findOneAndUpdate(
      { post_id: id },
      { $set: { resultat: resultatQcm } },
      { new: true }
    );

    if (!qcm) {
      return res.status(404).json({ message: "QCM non trouvé" });
    }
    return res.status(200).json({ message: "QCM mis à jour avec succès" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
};

exports.getQuestionByPost = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);

    const qcm = await QCM.findOne({ post_id: id }).populate("questions");
    console.log(qcm);

    if (!qcm) {
      return res.status(404).json({ message: "QCM non trouvée" });
    }

    return res.status(200).json({ questions: qcm.questions });
  } catch (error) {
    console.error("Erreur lors de la récupération des questions :", error);
    return res.status(500).json({ message: error.message });
  }
};
exports.generatQcmDemande = async (req, res) => {
  try {
    const postId = req.params.postId;

    if (!postId) {
      return res.status(400).json({ message: "L'ID du post est requis." });
    }

    const post = await Post.findById(postId).populate("jobId");

    if (!post) {
      return res.status(404).json({ message: "Post non trouvé." });
    }

    

    const questions = await question.aggregate([
      
      { $sample: { size: 4 } },
    ]);

    if (!questions.length) {
      return res.status(404).json({
        message: "Aucune question trouvée pour ce département.",
      });
    }

    // Création du QCM
    const newQCM = new QCM({
      post_id: postId,
      questions: questions.map((q) => q._id),
      resultat: 0,
    });

    const savedQCM = await newQCM.save();

    const populatedQCM = await QCM.findById(savedQCM._id).populate("questions");

    // Envoi de l'email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "manelfkih123@gmail.com",
        pass: "uwze prbc lohc kfzh",
      },
    });

    const plaintextPassword = generatePassword(8);
    // Increased length for security
    const hashedPassword = await bcrypt.hash(plaintextPassword, 10);

    // Update post with hashed password and invitation status
    post.password = hashedPassword;
    await post.save();

    const mailOptions = {
      from: `"Tradrly Recrutement" <${process.env.EMAIL_USER}>`,
      to: post.email,
      subject: `Invitation au test `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 >Bonjour ${post.name},</h2>
          <p>Nous vous remercions pour votre candidature au poste  chez Tradrly. Après examen de votre dossier, nous vous invitons à passer un test technique pour évaluer vos compétences.</p>
         <p>Veuillez utiliser le mot de passe suivant pour accéder à la plateforme :</p>

<p style="font-size: 16px; font-weight: bold;" >Identifiant : ${post.email}</p>

<p style="font-size: 16px; font-weight: bold; ">Mot de passe : ${plaintextPassword}</p> 


          <p>
            <a href="http://localhost:3000/loginCandidat/${postId}" style="display: inline-block; padding: 10px 20px; background-color: #4F46E5; color: #fff; text-decoration: none; border-radius: 5px;">Accéder au test</a>
          </p>
          <p>Nous vous souhaitons bonne chance !</p>
          <p style="margin-top: 20px;">
            <strong>Cordialement,</strong><br>
            L'équipe de recrutement<br>
            Tradrly
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    await Post.findByIdAndUpdate(postId, { status: 'testPassed' });

    return res.status(201).json({
      message: "QCM généré et email envoyé avec succès !",
      qcm: populatedQCM,
      emailInfo: info,
    });
    
  } catch (error) {
    console.error("Erreur lors de la création du QCM :", error);
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
};
