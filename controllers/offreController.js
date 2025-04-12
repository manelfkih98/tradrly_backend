const Offre = require("../models/offre");
const Departement = require("../models/departement");

exports.addOffreStage = async (req, res) => {
  try {
    const { titre, description, status, date_limite, departement_name } =
      req.body;
    const departement = await Departement.findOne({
      NameDep: departement_name,
    });
    if (!departement) {
      return res.status(400).json({ message: "Département non trouvé" });
    }
    if (new Date(date_limite) <= new Date()) {
      return res
        .status(400)
        .json({ message: "La date limite doit être future." });
    }
    const newOffre = new Offre({
      titre,
      description,
      status: status ?? true,
      date_limite,
      departement: departement.id,
      type: "stage",
    });

    await newOffre.save();
    res.status(201).json({ message: "Offre  ajoutée avec succès", newOffre });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};
exports.addOffreJob = async (req, res) => {
  try {
    const { titre, description, status, date_limite, departement_name } =
      req.body;
    const departement = await Departement.findOne({
      NameDep: departement_name,
    });
    if (!departement) {
      return res.status(400).json({ message: "Département non trouvé" });
    }
    if (new Date(date_limite) <= new Date()) {
      return res
        .status(400)
        .json({ message: "La date limite doit être future." });
    }
    const newOffre = new Offre({
      titre,
      description,
      status: status ?? true,
      date_limite,
      departement: departement.id,
      type: "job",
    });

    await newOffre.save();
    res.status(201).json({ message: "Offre  ajoutée avec succès", newOffre });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.getAllOffres = async (req, res) => {
  try {
    const offres = await Offre.find().populate("departement");
    res.status(200).json(offres);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};
exports.getOffreById = async (req, res) => {
  try {
    const { id } = req.params;
    const offre = await Offre.findById(id).populate("departement");
    if (!offre) {
      return res.status(404).json({ message: "offre non trouvée" });
    }

    res.status(200).json(offre);
  } catch (error) {
    res.status(500).json({ message: "erreur serveur", error });
  }
};

exports.updateOffre = async (req, res) => {
  try {
    const { id } = req.params;
    let updateoffre = req.body;

    console.log(updateoffre);

    if (updateoffre.departement_name) {
      const departement = await Departement.findOne({
        NameDep: updateoffre.departement_name,
      });

      if (!departement) {
        return res.status(404).json({ message: "Département non trouvé" });
      }

      updateoffre.departement = departement._id;
      delete updateoffre.departement_name;
    }

    const offreUpdated = await Offre.findByIdAndUpdate(id, updateoffre, {
      new: true,
      runValidators: true,
    });

    if (!offreUpdated) {
      return res.status(404).json({ message: "Offre non trouvée" });
    }

    return res.status(200).json({
      message: "Offre mise à jour avec succès",
      offre: offreUpdated,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
};

exports.deleteOffre = async (req, res) => {
  try {
    const { id } = req.params;
    const offreDeleted = await Offre.findByIdAndDelete(id);

    if (!offreDeleted) {
      return res.status(404).json({ message: "Offre non trouvée" });
    }

    res.status(200).json({ message: "Offre supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.getOffreStage = async (req, res) => {
  try {
    const offreStage = await Offre.find({ type: "stage" }).populate("departement");

    if (offreStage.length === 0) {
      return res
        .status(404)
        .json({ message: "Aucune offre de stage trouvée." });
    }

    return res.status(200).json({ offreByStage: offreStage });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
};

exports.getOffreJob = async (req, res) => {
  try {
    const offreJob = await Offre.find({ type: "job" }).populate("departement");
    if (offreJob.length === 0) {
      return res.status(404).json({ message: "Aucune offre de job trouvée" });
    }
    return res.status(200).json({ offreByJob: offreJob });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "error serveur", error: error.message });
  }
};

exports.deactivateOffre = async (req, res) => {
  try {
    const { id_offre } = req.params; 

    const offreDes = await Offre.findByIdAndUpdate(
      id_offre,
      { status: false }, 
      { new: true } 
    );

    if (!offreDes) {
      return res.status(404).json({ message: "Offre non trouvée" });
    }

    return res.status(200).json({ message: "Offre désactivée avec succès", offre: offreDes });

  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.activateOffre = async (req, res) => {
  try {
    const { id_offre } = req.params; 

    const offreDes = await Offre.findByIdAndUpdate(
      id_offre,
      { status: true }, 
      { new: true } 
    );

    if (!offreDes) {
      return res.status(404).json({ message: "Offre non trouvée" });
    }

    return res.status(200).json({ message: "Offre désactivée avec succès", offre: offreDes });

  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};


