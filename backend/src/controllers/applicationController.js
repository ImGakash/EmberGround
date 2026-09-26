const Application = require("../models/Application");
const { analyzeApplication } = require("../services/applicationIntelligence");
const { getApplicationStatus } = require("../services/applicationStatusService");
const { compareApplicationStatus } = require("../services/applicationStatusComparisonService");
const { buildApplicationContext } = require("../services/applicationContextService");

/**
 * GET /api/applications/:applicationId
 * Retrieves application from local MongoDB seed and runs intelligence analysis.
 */
const getApplicationById = async (req, res) => {
  try {
    const { applicationId } = req.params;

    if (!applicationId) {
      return res.status(400).json({
        success: false,
        message: "Application ID is required"
      });
    }

    const application = await Application.findOne({ applicationId }).lean();

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found"
      });
    }

    const intelligence = analyzeApplication(application);

    return res.status(200).json({
      success: true,
      data: {
        application: {
          applicationId: application.applicationId,
          serviceName: application.serviceName,
          status: application.status,
          submittedDate: application.submittedDate,
          lastUpdated: application.lastUpdated,
          expectedDays: application.expectedDays,
          requiredAction: application.requiredAction
        },
        timeline: application.timeline || [],
        statusHistory: application.statusHistory || [],
        intelligence
      }
    });
  } catch (error) {
    console.error("Error fetching application:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

/**
 * GET /api/applications/:applicationId/external-status
 * Retrieves application status from external application-status API / integration service.
 */
const getExternalApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const normalizedData = await getApplicationStatus(applicationId);

    return res.status(200).json({
      success: true,
      source: "external",
      data: normalizedData
    });
  } catch (error) {
    console.error("Error fetching external application status:", error.message);

    if (error.code === "CONFIG_ERROR") {
      return res.status(503).json({
        success: false,
        message: "External application status service is not configured."
      });
    }

    if (error.code === "NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Application not found in external service."
      });
    }

    if (error.code === "UNAVAILABLE") {
      return res.status(502).json({
        success: false,
        message: "External application status service is unavailable."
      });
    }

    if (error.code === "INVALID_ID") {
      return res.status(400).json({
        success: false,
        message: "Application ID is required"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve external application status."
    });
  }
};

/**
 * GET /api/applications/:applicationId/status-comparison
 * Compares local MongoDB application status with latest external application status.
 */
const getStatusComparison = async (req, res) => {
  try {
    const { applicationId } = req.params;

    if (!applicationId) {
      return res.status(400).json({
        success: false,
        message: "Application ID is required"
      });
    }

    // 1. Find local application in MongoDB
    const localApplication = await Application.findOne({ applicationId }).lean();

    if (!localApplication) {
      return res.status(404).json({
        success: false,
        message: "Application not found"
      });
    }

    // 2. Fetch external status using existing applicationStatusService
    const externalData = await getApplicationStatus(applicationId);

    // 3. Compare both data sources
    const comparison = compareApplicationStatus(localApplication, externalData);

    // 4. Return formatted response
    return res.status(200).json({
      success: true,
      data: {
        applicationId: localApplication.applicationId,
        local: {
          status: localApplication.status,
          lastUpdated: localApplication.lastUpdated
        },
        external: {
          status: externalData.status,
          lastUpdated: externalData.lastUpdated
        },
        comparison
      }
    });
  } catch (error) {
    console.error("Error comparing application status:", error.message);

    if (error.code === "CONFIG_ERROR") {
      return res.status(503).json({
        success: false,
        message: "External application status service is not configured."
      });
    }

    if (error.code === "NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Application not found in external service."
      });
    }

    if (error.code === "UNAVAILABLE") {
      return res.status(502).json({
        success: false,
        message: "External application status service is unavailable."
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to perform application status comparison."
    });
  }
};

/**
 * POST /api/applications/:applicationId/sync
 * Explicitly synchronizes external application status into statusHistory in MongoDB.
 * Does NOT overwrite existing local application.status field automatically.
 */
const syncApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;

    if (!applicationId) {
      return res.status(400).json({
        success: false,
        message: "Application ID is required"
      });
    }

    // 1. Find local application document
    const application = await Application.findOne({ applicationId });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found"
      });
    }

    // 2. Retrieve external status
    const externalData = await getApplicationStatus(applicationId);

    // 3. Compare status
    const comparison = compareApplicationStatus(application, externalData);

    // Ensure statusHistory array exists
    if (!Array.isArray(application.statusHistory)) {
      application.statusHistory = [];
    }

    // If statusHistory is completely empty, initialize with local record baseline
    if (application.statusHistory.length === 0) {
      application.statusHistory.push({
        status: application.status,
        source: "local",
        timestamp: application.submittedDate || application.lastUpdated || new Date(),
        remarks: "Application recorded locally"
      });
    }

    // 4. Check for duplicate history entry before recording
    const existingEntries = application.statusHistory;
    const isDuplicate = existingEntries.some(
      (entry) =>
        entry.source === (externalData.source || "external") &&
        entry.status.toUpperCase() === externalData.status.toUpperCase()
    );

    let statusRecorded = false;
    let syncMessage = "External status already recorded.";

    if (!isDuplicate) {
      application.statusHistory.push({
        status: externalData.status,
        source: externalData.source || "external",
        timestamp: new Date(externalData.lastUpdated || Date.now()),
        remarks: externalData.remarks || "External status observation recorded"
      });

      await application.save();

      statusRecorded = true;
      syncMessage = "New external status recorded.";
    }

    return res.status(200).json({
      success: true,
      data: {
        application: {
          applicationId: application.applicationId,
          serviceName: application.serviceName,
          status: application.status,
          submittedDate: application.submittedDate,
          lastUpdated: application.lastUpdated
        },
        external: externalData,
        comparison,
        sync: {
          statusRecorded,
          message: syncMessage
        },
        history: application.statusHistory
      }
    });
  } catch (error) {
    console.error("Error syncing application status:", error.message);

    if (error.code === "CONFIG_ERROR") {
      return res.status(503).json({
        success: false,
        message: "External application status service is not configured."
      });
    }

    if (error.code === "NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Application not found in external service."
      });
    }

    if (error.code === "UNAVAILABLE") {
      return res.status(502).json({
        success: false,
        message: "External application status service is unavailable."
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to synchronize external application status."
    });
  }
};

/**
 * GET /api/applications/:applicationId/timeline
 * Returns chronological status history (oldest first).
 */
const getApplicationTimeline = async (req, res) => {
  try {
    const { applicationId } = req.params;

    if (!applicationId) {
      return res.status(400).json({
        success: false,
        message: "Application ID is required"
      });
    }

    const application = await Application.findOne({ applicationId }).lean();

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found"
      });
    }

    let timeline = [];

    if (Array.isArray(application.statusHistory) && application.statusHistory.length > 0) {
      timeline = application.statusHistory.map((item) => ({
        status: item.status,
        source: item.source,
        timestamp: item.timestamp,
        remarks: item.remarks || ""
      }));
    } else if (Array.isArray(application.timeline) && application.timeline.length > 0) {
      timeline = application.timeline.map((item) => ({
        status: item.status,
        source: "local",
        timestamp: item.date,
        remarks: item.description || item.title || ""
      }));
    }

    // Sort chronologically (oldest first)
    timeline.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    return res.status(200).json({
      success: true,
      data: {
        applicationId: application.applicationId,
        timeline
      }
    });
  } catch (error) {
    console.error("Error fetching application timeline:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve application timeline."
    });
  }
};

/**
 * GET /api/applications/:applicationId/context
 * Exposes clean structured application context for future AI consumption.
 */
const getApplicationContext = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const contextData = await buildApplicationContext(applicationId);

    return res.status(200).json({
      success: true,
      data: contextData
    });
  } catch (error) {
    console.error("Error building application context:", error.message);

    if (error.code === "NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Application not found"
      });
    }

    if (error.code === "INVALID_ID") {
      return res.status(400).json({
        success: false,
        message: "Application ID is required"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to construct application context."
    });
  }
};

module.exports = {
  getApplicationById,
  getExternalApplicationStatus,
  getStatusComparison,
  syncApplication,
  getApplicationTimeline,
  getApplicationContext
};