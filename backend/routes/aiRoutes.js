const express = require("express");

const router = express.Router();

const {
  generateIDP,
} = require("../controllers/aiController");

router.post("/generate-idp", generateIDP);

module.exports = router;