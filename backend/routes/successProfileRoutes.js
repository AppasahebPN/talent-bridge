const express = require("express");
const router = express.Router();

const {
  createSuccessProfile,
  getSuccessProfiles,
} = require("../controllers/successProfileController");

router.post("/", createSuccessProfile);
router.get("/", getSuccessProfiles);

module.exports = router;