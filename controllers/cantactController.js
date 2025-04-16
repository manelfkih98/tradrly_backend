const Cantact = require('../models/contact'); 

// Create a new cantact
exports.createCantact = async (req, res) => {
    try {
        const cantact = await Cantact.create(req.body);
        res.status(201).json(cantact);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


exports.getAllCantacts = async (req, res) => {
    try {
        const cantacts = await Cantact.find();
        res.status(200).json(cantacts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.getCantactById = async (req, res) => {
    try {
        const cantact = await Cantact.findById(req.params.id);
        if (!cantact) {
            return res.status(404).json({ message: 'Cantact not found' });
        }
        res.status(200).json(cantact);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.updateCantact = async (req, res) => {
    try {
        const cantact = await Cantact.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!cantact) {
            return res.status(404).json({ message: 'Cantact not found' });
        }
        res.status(200).json(cantact);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


exports.deleteCantact = async (req, res) => {
    try {
        const cantact = await Cantact.findByIdAndDelete(req.params.id);
        if (!cantact) {
            return res.status(404).json({ message: 'Cantact not found' });
        }
        res.status(200).json({ message: 'Cantact deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
