const Article = require("../models/article");
const fs = require('fs');
const path = require('path');
exports.addArticle = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);
    const { name_article, description } = req.body;

    if (!name_article || !description) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }
    const images = req.files.map((file) => `uploads/${file.filename}`);
    const newArticle = new Article({
      name_article,
      description,
      images,
    });

    await newArticle.save();
    res
      .status(201)
      .json({ message: "Article ajouté avec succès", article: newArticle });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur", error });
  }
};
exports.getAllActicle = async (req, res) => {
  try {
    const articles = await Article.find();
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ message: "erreur serveur", error });
  }
};

exports.getArticleById = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await Article.findById(id);
    if (!article) {
      return res.status(404).json({ message: "article non trouvee" });
    }
    res.status(200).json(article);
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "erreur serveur", error });
  }
};

exports.deleteArticle = async (req, res) => {
    try {
      const { id } = req.params;
      const article = await Article.findByIdAndDelete(id);
      if (!article) {
        return res.status(404).json({ message: "article non trouvee" });
      }
      res.status(200).json({message:'article supprimée avec succée'});
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: "erreur serveur", error });
    }
  };
  exports.updateArticle = async (req, res) => {
    try {
      
        console.log("BODY:", req.body.name_article);
        console.log("id",req.params.id)
        const { name_article, description, imageUrl } = req.body;
        const updatedArticle = await Article.findByIdAndUpdate(
            req.params.id,{ name_article, description, imageUrl }
        );
        

        if (!updatedArticle) {
            return res.status(404).json({ message: "Article non trouvé !" });
        }

        res.json({ message: "Article mis à jour avec succès"});
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour", error });
    }
};



