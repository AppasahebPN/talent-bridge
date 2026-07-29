const analyzeGap = require("../services/gapAnalysisService");

const getGapAnalysis = async (req, res) => {
  try {
    const { employeeId, targetRole } = req.body;

    const result = await analyzeGap(employeeId, targetRole);

    res.json(result);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

module.exports = { getGapAnalysis };