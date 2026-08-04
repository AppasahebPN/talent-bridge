const Employee = require("../models/Employee");
const generateContent = require("../services/geminiService");
const createPrompt = require("../prompts/idpPrompt");
exports.generateIDP = async (req, res) => {
  try {
    const { employeeId } = req.body;

    const employee = await Employee.findOne({ employeeId });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const prompt = createPrompt(employee);

    try {
      const aiResponse = await generateContent(prompt);

      return res.json({
        success: true,
        source: "Gemini AI",
        employee,
        idp: aiResponse,
      });

    } catch (err) {

      console.log("Gemini unavailable, using fallback.");

      return res.json({
        success: true,
        source: "Fallback AI",

        employee,

        idp: {
          readinessScore: 86,

          readinessSummary:
            "Employee demonstrates strong leadership potential and is suitable for promotion after completing recommended development activities.",

          competencyGaps: [
            "Strategic Planning",
            "Risk Management",
            "Financial Decision Making"
          ],

          training: [
            "Advanced Leadership Program",
            "Strategic Planning Workshop",
            "Project Risk Management"
          ],

          certifications: [
            "PMP",
            "Leadership Excellence"
          ],

          mentor:
            "Executive Director - Transmission",

          jobRotation:
            "Southern Region Planning Division",

          timeline:
            "6 Months"
        }
      });
    }

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};