const express = require("express");

const {
  getApplicationMemory
} = require("../controllers/applicationMemoryController");

const router = express.Router();

router.get("/:applicationId/memory", getApplicationMemory);

module.exports = router;