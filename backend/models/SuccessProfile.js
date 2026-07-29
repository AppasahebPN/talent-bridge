const mongoose = require("mongoose");

const successProfileSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
      unique: true,
    },

    competencies: [
      {
        competency: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Competency",
        },

        requiredLevel: {
          type: Number,
          min: 1,
          max: 5,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SuccessProfile", successProfileSchema);