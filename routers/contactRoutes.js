const express = require('express');
const router = express.Router();
const {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} = require('../controllers/contactController');

router.get('/allContact', getAllContacts);
router.get('/:id', getContactById);
router.post('/addContact', createContact); 
router.put('/:id', updateContact);
router.delete('/:id', deleteContact);

module.exports = router;
