const departement=require('../models/departement')

exports.addDep = async (req, res) => {
    try {
        const { NameDep, DescrpDetp } = req.body;

        if (!NameDep || !DescrpDetp) {
            return res.status(400).json({ message: "Tous les champs sont requis." });
        }

        const newDept = new departement({ NameDep, DescrpDetp });
        await newDept.save();
        res.status(201).json({ message: "Département ajouté avec succès", newDept });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'ajout du département", error });
    }
};

exports.getAllDeps = async (req, res) => {
    try {
        const departements = await departement.find();
        res.status(200).json(departements);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des départements", error });
    }
};


exports.getDepById = async (req, res) => {
    try {
        const depId = req.params.id; 
        const department = await departement.findById(depId);

        if (!department) {
            return res.status(404).json({ message: "Département non trouvé" });
        }

        res.status(200).json(department); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur", error });
    }
};


exports.updateDep = async (req, res) => {
    try {
        const departementId = req.params.id;
        const { NameDep, DescrpDetp } = req.body;

        if (!NameDep || !DescrpDetp) {
            return res.status(400).json({ message: "Tous les champs sont requis." });
        }

        const updatedDept = await departement.findByIdAndUpdate(
            departementId,
            { NameDep, DescrpDetp },
            { new: true }
        );

        if (!updatedDept) {
            return res.status(404).json({ message: "Département non trouvé." });
        }

        res.status(200).json({ message: "Département mis à jour avec succès", updatedDept });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour du département", error });
    }
};

exports.deleteDep = async (req, res) => {
    try {
        const departementId = req.params.id;

        const deletedDept = await departement.findByIdAndDelete(departementId);

        if (!deletedDept) {
            return res.status(404).json({ message: "Département non trouvé." });
        }

        res.status(200).json({ message: "Département supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression du département", error });
    }
}