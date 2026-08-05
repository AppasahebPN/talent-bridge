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

// Get By ID
const getSuccessProfileById = async (req, res) => {
  try {
    const { id } = req.params;
    let profile = await SuccessProfile.findById(id).populate("competencies.competency");
    if (!profile) {
      profile = await SuccessProfile.findOne({ id }).populate("competencies.competency");
    }
    if (!profile) {
      return res.status(404).json({ message: "Success profile not found" });
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createSuccessProfile,
  getSuccessProfiles,
  getSuccessProfileById,
};