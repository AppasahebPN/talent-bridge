const express = require("express");
const router = express.Router();

const {
  getGapAnalysis
} = require("../controllers/gapAnalysisController");

router.post("/", getGapAnalysis);

module.exports = router;