const Post = require('../models/post');
const Offre = require('../models/offre');
const Departement = require('../models/departement');
const Team = require('../models/teamMember');

const MONTHS_FR = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];

exports.getDashboardData = async (req, res) => {
  try {
    const spontanee = await Post.countDocuments({ jobId: null });

    const postsByType = await Post.aggregate([
      { $match: { jobId: { $ne: null } } },
      {
        $lookup: {
          from: 'offres',
          localField: 'jobId',
          foreignField: '_id',
          as: 'offre'
        }
      },
      { $unwind: "$offre" },
      {
        $group: {
          _id: "$offre.type",
          count: { $sum: 1 }
        }
      }
    ]);

    let emploi = 0;
    let stage = 0;
    postsByType.forEach(({ _id, count }) => {
      if (_id === 'job') emploi = count;
      else if (_id === 'stage') stage = count;
    });

    const [offresEmploi, offresStage, departements, team] = await Promise.all([
      Offre.countDocuments({ type: "job" }),
      Offre.countDocuments({ type: "stage" }),
      Departement.countDocuments(),
      Team.countDocuments(),
    ]);

    //  Candidatures par mois
    const postsParMois = await Post.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const lineChartCategories = postsParMois.map(item => MONTHS_FR[item._id - 1]);
    const lineChartSeries = postsParMois.map(item => item.count);

    res.json({
      statCards: [
        { title: "Post Emploi", value: emploi, color: "primary" },
        { title: "Post Stage", value: stage, color: "success" },
        { title: "Demande Spontanée", value: spontanee, color: "warning" },
        { title: "Offres d'emploi", value: offresEmploi, color: "info" },
        { title: "Offres de stage", value: offresStage, color: "secondary" },
        { title: "Départements", value: departements, color: "error" },
        { title: "Équipe", value: team, color: "primary" },
      ],
      lineChart: {
        categories: lineChartCategories,
        series: lineChartSeries,
      },
      doughnutChart: {
        labels: ["Post Emploi", "Post Stage", "Post Spontanée"],
        series: [emploi, stage, spontanee],
      },
    });

  } catch (err) {
    console.error("Erreur Dashboard:", err);
    res.status(500).json({ error: "Erreur lors du chargement du dashboard" });
  }
};

exports.getPostulationsParOffreStage = async (req, res) => {
    try {
      const offres = await Offre.find({type:"stage"}).lean();
  
      const postsPerOffre = await Post.aggregate([
        { $match: { jobId: { $ne: null } } },
        {
          $group: {
            _id: "$jobId",
            count: { $sum: 1 }
          }
        }
      ]);
  
      const postCountMap = {};
      postsPerOffre.forEach(post => {
        postCountMap[post._id.toString()] = post.count;
      });
  
      const offresWithPostCounts = offres.map(offre => ({
        _id: offre._id,
        titre: offre.titre,
        type: offre.type,
        postCount: postCountMap[offre._id.toString()] || 0
      }));
  
      res.json(offresWithPostCounts);
    } catch (err) {
      console.error("Erreur récupération postulations par offre:", err);
      res.status(500).json({ error: "Erreur serveur" });
    }
  };

  exports.getPostulationsParOffreJob = async (req, res) => {
    try {
      const offres = await Offre.find({type:"job"}).lean();
  
      const postsPerOffre = await Post.aggregate([
        { $match: { jobId: { $ne: null } } },
        {
          $group: {
            _id: "$jobId",
            count: { $sum: 1 }
          }
        }
      ]);
  
      const postCountMap = {};
      postsPerOffre.forEach(post => {
        postCountMap[post._id.toString()] = post.count;
      });
  
      const offresWithPostCounts = offres.map(offre => ({
        _id: offre._id,
        titre: offre.titre,
        type: offre.type,
        postCount: postCountMap[offre._id.toString()] || 0
      }));
  
      res.json(offresWithPostCounts);
    } catch (err) {
      console.error("Erreur récupération postulations par offre:", err);
      res.status(500).json({ error: "Erreur serveur" });
    }
  };
