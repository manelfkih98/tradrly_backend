const Contact = require('../models/contact'); 



exports.createContact = async (req, res) => {
    try {
        const { object, email, subject } = req.body;
        if (!object || !email || !subject) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Create a new contact
        const contact = new Contact({
            object,
            email,
            subject,
        });
        await contact.save();
        const io = req.app.get("socketio");
        
        // Emitting a new message event for the frontend
        io.emit("nouveau-message", {
            email,
            contenu: subject,
        });

        res.status(201).json({ message: "Contact created successfully", contact });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


exports.getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.status(200).json(contacts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getContactById = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        res.status(200).json(contact);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateContact = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        res.status(200).json(contact);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        res.status(200).json({ message: 'Contact deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
