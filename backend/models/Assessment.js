const mongoose = require("mongoose");

const assessmentSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },

    competency: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Competency",
      required: true,
    },

    score: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },

    assessedBy: {
      type: String,
      default: "HR Committee",
    },

    assessmentDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Assessment", assessmentSchema);