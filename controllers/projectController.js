const Project = require("../models/project");
const Departements = require("../models/departement");

exports.addProject = async (req, res) => {
  try {
    const { name_project, date_creation, departement_name } = req.body;
    const image = req.file ? req.file.path.replace(/\\/g, "/") : null;


    if (!name_project || !date_creation || !departement_name) {
      return res.status(400).json({ message: "Tous les champs sont requis." });
    }
    const departement = await Departements.findOne({
      NameDep: departement_name,
    });
    if (!departement) {
      return res.status(404).json({ message: "Département non trouvé." });
    }
    const newProject = new Project({
      name_project: name_project,
      date_creation: date_creation,
      image: image,
      departementId: departement._id,
    });

    await newProject.save();

    res
      .status(201)
      .json({ message: "Projet ajouté avec succès.", project: newProject,departement_name });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur lors de l'insertion du projet.",
      error: error.message,
    });
  }
};

exports.getAllProject = async (req, res) => {
  try {
    const projects = await Project.find().populate('departementId');

    const formattedProjects = projects.map((project) => ({
      ...project._doc,
      image: `${req.protocol}://${req.get("host")}/${project.image.replace(/\\/g, "/")}`,
    }));

    res.status(200).json({ projects: formattedProjects });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};



exports.getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "project non trouveé" });
    }
    return res.status(200).json({ projectFind: project });
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const projectDelete = await Project.findByIdAndDelete(id);
    if (!projectDelete) {
      return res.status(404).json({ message: "project non trouvee" });
    }
    return res.status(200).json({ message: "bien supprimee" });
  } catch (error) {
    return res.status(500).json({ message: "erreur de serveur", error });
  }
};
exports.updateProject = async (req, res) => {
    try {
      const { id } = req.params;
      const { name_project, description_project, departement_name } = req.body;
  
      
      let projectUpdate = await Project.findById(id);
      if (!projectUpdate) {
        return res.status(404).json({ message: "Projet non trouvé" });
      }
  
    
      projectUpdate.name_project = name_project || projectUpdate.name_project;
      projectUpdate.description_project = description_project || projectUpdate.description_project;
  
     
      if (departement_name) {
        const departement = await Departements.findOne({ NameDep: departement_name });
        if (!departement) {
          return res.status(404).json({ message: "Département non trouvé" });
        }
        projectUpdate.departementId = departement._id;
      }
  
     
      await projectUpdate.save();
  
      return res.status(200).json({ message: "Projet bien modifié", project: projectUpdate });
    } catch (error) {
      return res.status(500).json({ message: "Erreur de serveur", error: error.message });
    }
  };
  
  