const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload'); 

const {
  createTeamMember,
  getAllTeamMembers,
  getTeamMemberById,
  updateTeamMember,
  deleteTeamMember
} = require('../controllers/teamMemberController');

// 👇 Ajouter "upload.single('image')" pour gérer l'upload de fichier
router.post('/add', upload.single('image'), createTeamMember);
router.get('/all', getAllTeamMembers);
router.get('/teamMemberById/:id', getTeamMemberById);
router.delete('/deleteTeam/:id', deleteTeamMember);
router.put('/updateTeam/:id', updateTeamMember);

module.exports = router;
