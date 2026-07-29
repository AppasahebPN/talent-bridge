const SuccessProfile = require("../models/SuccessProfile");

// Create
const createSuccessProfile = async (req, res) => {
  try {
    const profile = await SuccessProfile.create(req.body);
    res.status(201).json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get All
const getSuccessProfiles = async (req, res) => {
  try {
    const profiles = await SuccessProfile.find().populate(
      "competencies.competency"
    );

    res.json(profiles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createSuccessProfile,
  getSuccessProfiles,
};