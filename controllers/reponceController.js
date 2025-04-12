const response = require("../models/reponse");

exports.addResponce = async (req, res) => {
  try {
    const { text } = req.body;
    const newReponce = new response({ text });

    await newReponce.save();
    res.status(201).json({ message: "reponce est bien ajouter " });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};
exports.getAllResponces = async (req, res) => {
  try {
    const reponses = await response.find();
    res.status(200).json(reponses);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.getResponceById = async (req, res) => {
  try {
    const reponse = await response.findById(req.params.id);
    if (!reponse) {
      return res.status(404).json({ message: "Réponse non trouvée" });
    }
    res.status(200).json(reponse);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.updateResponce = async (req, res) => {
  try {
    const { text } = req.body;
    const updatedReponse = await response.findByIdAndUpdate(
      req.params.id,
      { text },
      { new: true }
    );

    if (!updatedReponse) {
      return res.status(404).json({ message: "Réponse non trouvée" });
    }

    res.status(200).json({ message: "Réponse mise à jour", updatedReponse });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.deleteResponce = async (req, res) => {
  try {
    const deletedReponse = await response.findByIdAndDelete(req.params.id);
    if (!deletedReponse) {
      return res.status(404).json({ message: "Réponse non trouvée" });
    }
    res.status(200).json({ message: "Réponse supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};
