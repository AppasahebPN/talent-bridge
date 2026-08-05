const express = require("express");
const router = express.Router();

const {
  createSuccessProfile,
  getSuccessProfiles,
  getSuccessProfileById,
} = require("../controllers/successProfileController");

router.post("/", createSuccessProfile);
router.get("/", getSuccessProfiles);
router.get("/:id", getSuccessProfileById);

module.exports = router;