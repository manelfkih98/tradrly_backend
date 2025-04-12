const TeamMember = require('../models/teamMember');

// Create a new team member
exports.createTeamMember = async (req, res) => {
  try {
    const { name, title, quote ,linkedin} = req.body;
    console.log(req.body);
    const image = req.file ? req.file.path : null;

    if (!name || !title || !quote || !image || !linkedin) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const teamMember = new TeamMember({
      name,
      title,
      image, 
      quote,
      linkedin
    });

    await teamMember.save();
    res.status(201).json({
      success: true,
      message: 'Team member created successfully',
      data: teamMember
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating team member',
      error: error.message
    });
  }
};

// Get all team members
exports.getAllTeamMembers = async (req, res) => {
  try {
    const teamMembers = await TeamMember.find();

    const updatedTeamMembers = teamMembers.map((member) => ({
      ...member._doc,
      image: `${req.protocol}://${req.get("host")}/${member.image.replace(/\\/g, "/")}`,
    }));

    res.status(200).json({ teamMembers: updatedTeamMembers });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching team members",
      error: error.message,
    });
  }
};



// Get a single team member by ID
exports.getTeamMemberById = async (req, res) => {
  try {
    // Validate ID format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }

    const teamMember = await TeamMember.findById(req.params.id);
    if (!teamMember) {
      return res.status(404).json({ success: false, message: 'Team member not found' });
    }
    res.status(200).json({ success: true, data: teamMember });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching team member', error: error.message });
  }
};

// Update a team member
exports.updateTeamMember = async (req, res) => {
  try {
    // Validate ID format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }

    const { name, title, image, quote } = req.body;
    const teamMember = await TeamMember.findById(req.params.id);

    if (!teamMember) {
      return res.status(404).json({ success: false, message: 'Team member not found' });
    }

    // Update fields only if provided
    teamMember.name = name || teamMember.name;
    teamMember.title = title || teamMember.title;
    teamMember.image = image || teamMember.image;
    teamMember.quote = quote || teamMember.quote;

    await teamMember.save();
    res.status(200).json({ success: true, message: 'Team member updated successfully', data: teamMember });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating team member', error: error.message });
  }
};

// Delete a team member
exports.deleteTeamMember = async (req, res) => {
  try {
    // Validate ID format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }

    const teamMember = await TeamMember.findById(req.params.id);
    if (!teamMember) {
      return res.status(404).json({ success: false, message: 'Team member not found' });
    }

    await teamMember.deleteOne();
    res.status(200).json({ success: true, message: 'Team member deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting team member', error: error.message });
  }
};