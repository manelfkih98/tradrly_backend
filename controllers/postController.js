const Post = require("../models/post");
const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

const auth = new google.auth.GoogleAuth({
  keyFile: "C:/teest_tradrly/meniproject.json",
  scopes: ["https://www.googleapis.com/auth/drive.file"],
});
const drive = google.drive({ version: "v3", auth });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

async function uploadFileToDrive(filePath, fileName) {
  try {
    const response = await drive.files.create({
      requestBody: {
        name: fileName,
        mimeType: "application/pdf",
        parents: ["1hoyiqu8KlpuRBfeka3CQG88XJG9AW_So"],
      },
      media: {
        mimeType: "application/pdf",
        body: fs.createReadStream(filePath),
      },
    });

    
    await drive.permissions.create({
      fileId: response.data.id,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

   
    const result = await drive.files.get({
      fileId: response.data.id,
      fields: "webViewLink",
    });

    return result.data.webViewLink;
  } catch (error) {
    console.error("Erreur lors de l'upload vers Google Drive:", error);
    throw error;
  }
}

exports.addPost = async (req, res) => {
  try {
    upload.single("file")(req, res, async (err) => {
      if (err) {
        return res
          .status(400)
          .json({ message: "Erreur lors de l'upload du fichier" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "Le fichier CV est requis." });
      }

      const { name, email, number, niveau, jobId } = req.body;
      console.log(req.body);

      if (!name || !email || !number || !niveau || !jobId) {
        return res.status(400).json({
          message:
            "Tous les champs sont requis, y compris l'ID de l'offre d'emploi.",
        });
      }

      const filePath = req.file.path;
      const fileName = req.file.filename;

      const localCvUrl = `/uploads/${fileName}`;

      const googleDriveCvUrl = await uploadFileToDrive(filePath, fileName);

      /*const password = generatePassword(5);
      const salt = await bcrypt.genSalt(5);
      const hashedPassword = await bcrypt.hash(password, salt);*/

      const newPost = new Post({
        name,
        email,
        number,
        niveau,
        cv_local_url: localCvUrl,
        cv_google_drive_url: googleDriveCvUrl,
        jobId,
        password: "",
       // password: hashedPassword,
        
      });

      await newPost.save();

      res.status(201).json({
        message: "Candidature ajoutée avec succès",
        post: newPost,
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur lors de l'ajout de la candidature",
      error: error.message,
    });
  }
};

exports.getAllPostStage = async (req, res) => {
  try {
    const postes = await Post.find({ jobId: { $ne: null } })
    .populate("jobId");
  
  const filtered = postes.filter(post => post.jobId && post.jobId.type === "stage");
    if (!filtered || filtered.length === 0) {
      return res.status(404).json({ message: "Aucune candidature trouvée" });
    }

    const postsWithCvUrls = filtered.map((post) => ({
      ...post._doc,
      cv_local_url: `${req.protocol}://${req.get(
        "host"
      )}/uploads/${path.basename(post.cv_local_url)}`,
      cv_google_drive_url: post.cv_google_drive_url, 
    }));

    res.status(200).json(postsWithCvUrls);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};


exports.getAllPostJob = async (req, res) => {
  try {
    const postes = await Post.find({ jobId: { $ne: null } })
    .populate("jobId");
  
  const filtered = postes.filter(post => post.jobId && post.jobId.type === "job");
    if (!filtered || filtered.length === 0) {
      return res.status(404).json({ message: "Aucune candidature trouvée" });
    }

    const postsWithCvUrls = filtered.map((post) => ({
      ...post._doc,
      cv_local_url: `${req.protocol}://${req.get(
        "host"
      )}/uploads/${path.basename(post.cv_local_url)}`,
      cv_google_drive_url: post.cv_google_drive_url, 
    }));

    res.status(200).json(postsWithCvUrls);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};


exports.getPostsByJobId = async (req, res) => {
  try {
    const { jobId } = req.params;

    const posts = await Post.find({ jobId });

    if (posts.length === 0) {
      return res.status(404).json({
        message: "Aucune candidature trouvée pour cette offre d'emploi.",
      });
    }

    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur lors de la récupération des candidatures",
      error: error.message,
    });
  }
};

exports.refuser = async (req, res) => {
  try {
    const poste = await Post.findById(req.params.id).populate("jobId");
    if (!poste) {
      return res.status(404).json({ message: "Candidature non trouvée." });
    }
    if (!poste.jobId) {
      return res
        .status(404)
        .json({ message: "Offre d'emploi associée non trouvée." });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "manelfkih123@gmail.com",
        pass: process.env.GMAIL_APP_PASSWORD,

      },
    });

    const mailOptions = {
      from: `"Tradrly Recrutement" <${process.env.EMAIL_USER}>`,
   
      to: poste.email,
      subject: `Suite à votre candidature pour le poste de ${poste.jobId.titre}`,
      html: `
        <div style="font-family: Arial, sans-serif; font-size: 15px; color: #333; line-height: 1.6;">
          <p>Bonjour <strong>${poste.name}</strong>,</p>
    
          <p>
            Nous vous remercions sincèrement pour l’intérêt que vous avez porté à notre entreprise <strong>Tradrly</strong> 
            en postulant au poste de <strong>${poste.jobId.titre}</strong>.
          </p>
    
          <p>
            Après un examen attentif de votre candidature, nous avons le regret de vous informer que votre profil n’a pas été retenu pour la suite du processus de recrutement.
          </p>
    
          <p>
            Cette décision ne remet pas en question la qualité de votre parcours. 
            Nous vous encourageons vivement à consulter régulièrement nos offres et à postuler à celles qui correspondent à vos compétences et aspirations.
          </p>
    
          <p>
            Nous vous souhaitons plein succès dans la suite de vos démarches professionnelles.
          </p>
    
          <p style="margin-top: 30px;">
            Bien cordialement,<br/>
            <strong>L’équipe Recrutement</strong><br/>
            Tradrly
          </p>
        </div>
      `,
    };
    
    const info = await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email envoyé avec succès!", info });
    await Post.findByIdAndUpdate(req.params.id, { status: 'refused' });

   
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de l'envoi de l'email", error });
  }
};

exports.accepter = async (req, res) => {
  try {
    // Validate post ID
    const postId = req.params.id;
    if (!postId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "ID de candidature invalide." });
    }

    // Find post and populate jobId
    const poste = await Post.findById(postId).populate("jobId");
    if (!poste) {
      return res.status(404).json({ message: "Candidature non trouvée." });
    }
    if (!poste.jobId) {
      return res.status(404).json({ message: "Offre d'emploi associée non trouvée." });
    }
    if (poste.testCompleted) {
      return res.status(403).json({ message: "Vous avez déjà passé le test." });
    }

    // Generate and hash password
    const plaintextPassword = generatePassword(8); // Increased length for security
    const salt = await bcrypt.genSalt(10); // Increased salt rounds for security
    const hashedPassword = await bcrypt.hash(plaintextPassword, salt);

    // Update post with hashed password and invitation status
    poste.password = hashedPassword;
    
    await poste.save();

    // Send email with plaintext password
    const mailOptions = {
      from: `"Tradrly Recrutement" <${process.env.EMAIL_USER}>`,
      to: poste.email,
      subject: `Invitation au test pour le poste de ${poste.jobId.titre}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #4F46E5;">Bonjour ${poste.name},</h2>
          <p>Nous vous remercions pour votre candidature au poste de <strong>${poste.jobId.titre}</strong> chez Tradrly. Après examen de votre dossier, nous vous invitons à passer un test technique pour évaluer vos compétences.</p>
          <p>Veuillez utiliser le mot de passe suivant pour accéder à la plateforme :</p>
          <p style="font-size: 18px; font-weight: bold; color: #4F46E5;">${plaintextPassword}</p>
          <p>
            <a href="http://localhost:3000/test/${postId}" style="display: inline-block; padding: 10px 20px; background-color: #4F46E5; color: #fff; text-decoration: none; border-radius: 5px;">Accéder au test</a>
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

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Email d'invitation au test envoyé avec succès !" });
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
    if (error.name === "MongoError") {
      return res.status(500).json({ message: "Erreur de base de données." });
    }
    if (error.code === "EAUTH") {
      return res.status(500).json({ message: "Erreur d'authentification email." });
    }
    res.status(500).json({ message: "Erreur serveur lors de l'envoi de l'email." });
  }
}



exports.addPostWithoutOffre = async (req, res) => {
  try {
    upload.single("file")(req, res, async (err) => {
      if (err) {
        return res
          .status(400)
          .json({ message: "Erreur lors de l'upload du fichier" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "Le fichier CV est requis." });
      }

      const { name, email, number, niveau } = req.body;

      if (!name || !email || !number || !niveau) {
        return res.status(400).json({
          message:
            "Tous les champs sont requis, y compris l'ID de l'offre d'emploi.",
        });
      }

      const filePath = req.file.path;
      const fileName = req.file.filename;

      const localCvUrl = `/uploads/${fileName}`;

      const googleDriveCvUrl = await uploadFileToDrive(filePath, fileName);

      

      const newPost = new Post({
        name,
        email,
        number,
        niveau,
        cv_local_url: localCvUrl,
        cv_google_drive_url: googleDriveCvUrl,
        password: "",
        jobId: null, 

      });

      await newPost.save();

      res.status(201).json({
        message: "Candidature sans offre ajoutée avec succès",
        post: newPost,
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur lors de l'ajout de la candidature",
      error: error.message,
    });
  }
};

exports.getPostWithoutOffre = async (req, res) => {
  try {
    // Récupération des candidatures sans offre associée
    const postes = await Post.find({ jobId: null });

    // Si aucun résultat
    if (!postes ) {
      return res.json({ message: "Aucune candidature trouvée." });
    }

    // Formatage des URLs de CV (local et Google Drive)
    const postsFormatted = postes.map((post) => {
      return {
        ...post._doc,
        cv_local_url: `${req.protocol}://${req.get("host")}/uploads/${path.basename(post.cv_local_url)}`,
        cv_google_drive_url: post.cv_google_drive_url || null,
      };
    });

    return res.status(200).json(postsFormatted);
  } catch (error) {
    console.error("Erreur lors de la récupération des candidatures sans offre :", error);
    return res.status(500).json({ message: "Erreur interne du serveur", error: error.message });
  }
};
exports.accepterDemande = async (req, res) => {
  try {
    const poste = await Post.findById(req.params.id);
    if (!poste) {
      return res.status(404).json({ message: "Candidature non trouvée." });
    }
   

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "manelfkih123@gmail.com",
        pass: "uwze prbc lohc kfzh",
      },
    });

    const mailOptions = {
      from: "manelfkih13@gmail.com",
      to: poste.email,
      subject: "Suite favorable à votre candidature",
      html: `Bonjour ${poste.name},<br><br>
      Nous avons bien reçu votre demande de candidature au sein de notre entreprise « Tradrly ».<br><br>
      Après étude de votre profil, nous avons le plaisir de vous informer que votre candidature a été retenue pour la prochaine étape de notre processus de recrutement.<br><br>
      Veuillez trouver ci-dessous votre mot de passe généré pour accéder à notre plateforme :<br><br>
      <strong>Mot de passe :</strong> ${poste.password}<br><br>
      <b>Cordialement,</b><br>
      L'équipe de recrutement<br>
      Tradrly<br><br>
      <a href="http://localhost:3000/" target="_blank">Cliquez ici pour accéder à votre test</a>`,
    };
    
    const info = await transporter.sendMail(mailOptions);
    res
      .status(200)
      .json({ message: "Email d'acceptation envoyé avec succès!", info });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};
exports.refuserDemande = async (req, res) => {
  try {
    const poste = await Post.findById(req.params.id);

    if (!poste) {
      return res.status(404).json({ message: "Candidature non trouvée." });
    }



    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "manelfkih123@gmail.com",
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Tradrly Recrutement" <${process.env.EMAIL_USER}>`,
   
      to: poste.email,
      subject: `Suite à votre candidature spontanée`,
      html: `
      <div style="font-family: Arial, sans-serif; font-size: 15px; color: #333; line-height: 1.6;">
        <p>Bonjour <strong>${poste.name}</strong>,</p>
        <p>
          Nous vous remercions pour l’intérêt que vous portez à <strong>Tradrly</strong>.
        </p>
        <p>
          Après avoir étudié votre dossier , nous sommes au regret de vous informer que nous n’avons pas de poste correspondant à votre profil à pourvoir actuellement.
        </p>
        <p>
          Nous vous invitons à consulter régulièrement nos offres ou à nous transmettre une nouvelle candidature pour d’autres opportunités.
        </p>
        <p style="margin-top: 30px;">
          Bien cordialement,<br/>
          <strong>L’équipe Recrutement Tradrly</strong>
        </p>
      </div>`,
    };

    const info = await transporter.sendMail(mailOptions);
    res
      .status(200)
      .json({ message: "Email de refus envoyé avec succès.", info });
      poste.status = "refused";
      await poste.save(); 

  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de l'envoi de l'email", error });
  }
};



exports.loginCandidat = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe sont requis' });
    }

    // Find candidate by email
    const candidat = await Post.findOne({ email });
    if (!candidat) {
      return res.status(400).json({ message: 'Utilisateur non trouvé' });
    }

    // Debug password comparison
    console.log('Input password:', password);
    console.log('Stored hashed password:', candidat.password);

    // Compare provided password with hashed password
    const isMatch = await bcrypt.compare(password, candidat.password);
    console.log('Password match:', isMatch);
    if (!isMatch) {
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: candidat._id, email: candidat.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '1h' }
    );

    // Send success response with token
    return res.status(200).json({
     
      candidat
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
exports.markTestCompleted = async (req, res) => {
  try {
    const poste = await Post.findById(req.params.id);
    if (!poste) {
      return res.status(404).json({ message: "Candidature non trouvée." });
    }
    poste.testCompleted = true;
    await poste.save();
    res.status(200).json({ message: "Test marqué comme complété." });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour du test", error });
  }
};

exports.verifier = async (req, res) => {
  try {
    const poste = await Post.findById(req.params.id);
    if (!poste) {
      return res.status(404).json({ message: "Candidature non trouvée." });
    }
    res.status(200).json(!poste.testCompleted); // true si PAS encore complété
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération du post", error });
  }
};
const generatePassword = (length) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};
