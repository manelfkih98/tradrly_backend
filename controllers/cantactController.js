const Cantact = require('../models/contact'); 

// Create a new cantact
exports.createContact = async (req, res) => {
    try {
        const { object, email, subject } = req.body;
        console.log("Received data:", req.body);

        // Validate the input fields
        if (!object || !email || !subject) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Validate email format
        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Create a new contact record
        const contact = await Contact.create({
            object,
            email,
            subject,
        });

        // Respond with the created contact
        res.status(201).json(contact);

        // Emit a socket event for the new contact message
        const io = req.app.get("socketio");
        io.emit("nouveau-message", {
            email,
            contenu: subject,
        });

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
