const express = require("express");
const {
  getApplicationById,
  getExternalApplicationStatus,
  getStatusComparison,
  syncApplication,
  getApplicationTimeline,
  getApplicationContext
} = require("../controllers/applicationController");

const router = express.Router();

router.get("/:applicationId/external-status", getExternalApplicationStatus);
router.get("/:applicationId/status-comparison", getStatusComparison);
router.post("/:applicationId/sync", syncApplication);
router.get("/:applicationId/timeline", getApplicationTimeline);
router.get("/:applicationId/context", getApplicationContext);
router.get("/:applicationId", getApplicationById);

module.exports = router;