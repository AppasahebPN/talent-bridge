const Assessment = require("../models/Assessment");
const SuccessProfile = require("../models/SuccessProfile");

const analyzeGap = async (employeeId, targetRole) => {
  const assessments = await Assessment.find({ employee: employeeId })
    .populate("competency");

  const profile = await SuccessProfile.findOne({ role: targetRole })
    .populate("competencies.competency");

  if (!profile) {
    throw new Error("Success Profile not found");
  }

  let totalRequired = 0;
  let totalEmployee = 0;

  const gaps = [];

  for (const required of profile.competencies) {
    const employeeScore = assessments.find(
      a =>
        a.competency._id.toString() ===
        required.competency._id.toString()
    );

    const current = employeeScore ? employeeScore.score : 0;

    gaps.push({
      competency: required.competency.name,
      currentLevel: current,
      requiredLevel: required.requiredLevel,
      gap: required.requiredLevel - current
    });

    totalRequired += required.requiredLevel;
    totalEmployee += current;
  }

  const readinessScore = Math.round(
    (totalEmployee / totalRequired) * 100
  );

  return {
    readinessScore,
    gaps
  };
};

module.exports = analyzeGap;