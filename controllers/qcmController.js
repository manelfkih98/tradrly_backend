const QCM = require("../models/QCM");
const question = require("../models/question");
const Departement = require("../models/departement");
const Post = require("../models/post");
const { all } = require("../routers/adminRoutes");
const nodemailer = require("nodemailer");

/*exports.generatQcm = async (req, res) => {
  try {

    const dep_name = req.body["dep_name "]?.trim();
    console.log("Corps de la requête :", dep_name);

    const departementFind = await Departement.findOne({ NameDep: dep_name });
    if (!departementFind) {
      return res.status(404).json({ message: "Département non trouvé." });
    }

   
   const questions = await question.aggregate([
      { $match: { departement: departementFind._id } },
      { $sample: { size: 3 } }
    ]);

    if (!questions || questions.length === 0) {
      return res.status(404).json({ message: "Aucune question trouvée pour ce département." });
    }

   
    const newQCM = new QCM({
      questions: questions.map(q => q._id),
      resultat: 0 
    });

    const savedQCM = await newQCM.save();
    const populatedQCM = await QCM.findById(savedQCM._id).populate("questions");

    res.status(201).json(populatedQCM);
  } catch (error) {
    console.error("Erreur lors de la création du QCM :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};*/

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
    const departementFind = await Departement.findById({
      _id: post.jobId.departement,
    });
    if (!post) {
      return res
        .status(404)
        .json({ message: "Département non trouvé pour ce post." });
    }
    const questions = await question.aggregate([
      { $match: { departement: departementFind._id } },
      { $sample: { size: 5 } },
    ]);

    if (!questions.length) {
      return res
        .status(404)
        .json({ message: "Aucune question trouvée pour ce département." });
    }
    const newQCM = new QCM({
      post_id: postId,
      questions: questions.map((q) => q._id),
      resultat: 0,
    });

    const savedQCM = await newQCM.save();
    const populatedQCM = await QCM.findById(savedQCM._id).populate("questions");

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "manelfkih123@gmail.com",
        pass: "uwze prbc lohc kfzh",
      },
    });

    const mailOptions = {
      from: "manelfkih13@gmail.com",
      to: post.email,
      subject: `Réponse à votre candidature pour le poste ${post.jobId.titre}`,
      html: `Bonjour ${post.name},<br><br>
          Nous vous remercions de l'intérêt que vous portez à notre société « Tradrly » en postulant au poste de ${post.jobId.titre}. Après une étude attentive de votre candidature, nous avons le regret de vous informer que nous ne pouvons pas y donner une suite favorable.<br><br>
          Nous vous remercions néanmoins pour l’intérêt que vous portez à notre entreprise et vous souhaitons plein succès dans vos recherches.<br><br>
          Veuillez trouver ci-dessous votre mot de passe généré pour la plateforme Tradrly :<br><br>
          email : ${post.email}<br><br>
          Mot de passe : ${post.password}<br><br>
         
          <b>Cordialement,</b><br>
          L'équipe de recrutement<br>
          Tradrly<br><br>
          <a href="http://localhost:3000/loginCandidat" target="_blank">Cliquez ici pour accéder à votre test</a>`,
    };

    const info = await transporter.sendMail(mailOptions);
    res
      .status(200)
      .json({ message: "Email d'acceptation envoyé avec succès!", info });

    res.status(201).json(populatedQCM);
  } catch (error) {
    console.error("Erreur lors de la création du QCM :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
exports.getAllQcm = async (req, res) => {
  try {
    const allQCM = await QCM.find().populate("post_id");

    if (!allQCM || allQCM.length === 0) {
      return res.status(404).json({ message: "Aucun QCM disponible." });
    }

    return res.status(200).json(allQCM);
  } catch (error) {
    console.error("Erreur lors de la récupération des QCM :", error);
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
};

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
    return res.status(200).json({ message: "QCM mis à jour avec succès"});
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




