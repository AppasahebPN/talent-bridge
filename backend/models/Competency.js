const mongoose = require("mongoose");

const competencySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: String,
      enum: ["Technical", "Leadership", "Behavioral", "Functional"],
      required: true,
    },
    description: {
      type: String,
    },
    maxScore: {
      type: Number,
      default: 5,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Competency", competencySchema);