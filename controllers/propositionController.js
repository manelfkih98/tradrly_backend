const Proposition = require("../models/proposition");


exports.addProposition = async (req, res) => {
  try {
    const { text, question } = req.body;
    const newProposition = new Proposition({ text, question });

    await newProposition.save();
    res.status(201).json({ message: "Proposition ajoutée avec succès", newProposition });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.getAllPropositions = async (req, res) => {
  try {
    const propositions = await Proposition.find().populate("question");
    res.status(200).json(propositions);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};


exports.getPropositionById = async (req, res) => {
  try {
    const proposition = await Proposition.findById(req.params.id).populate("question");
    if (!proposition) {
      return res.status(404).json({ message: "Proposition non trouvée" });
    }
    res.status(200).json(proposition);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};


exports.updateProposition = async (req, res) => {
  try {
    const { text, question } = req.body;
    const updatedProposition = await Proposition.findByIdAndUpdate(
      req.params.id,
      { text, question },
      { new: true } // Retourne la nouvelle version mise à jour
    );

    if (!updatedProposition) {
      return res.status(404).json({ message: "Proposition non trouvée" });
    }

    res.status(200).json({ message: "Proposition mise à jour", updatedProposition });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};


exports.deleteProposition = async (req, res) => {
  try {
    const deletedProposition = await Proposition.findByIdAndDelete(req.params.id);
    if (!deletedProposition) {
      return res.status(404).json({ message: "Proposition non trouvée" });
    }
    res.status(200).json({ message: "Proposition supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};
