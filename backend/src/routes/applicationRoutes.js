const express = require("express");

const {
  getApplicationById
} = require("../controllers/applicationController");

const router = express.Router();

router.get("/:applicationId", getApplicationById);

module.exports = router;