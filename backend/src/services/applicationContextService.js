/**
 * Application Context Builder Service
 * Pure context aggregator that constructs a structured input object for future AI consumption.
 * NOTE: Does NOT invoke any LLM, web search, or external AI API.
 */

const Application = require("../models/Application");
const { analyzeApplication } = require("./applicationIntelligence");
const { getApplicationStatus } = require("./applicationStatusService");
const { compareApplicationStatus } = require("./applicationStatusComparisonService");

const buildApplicationContext = async (applicationId) => {
  if (!applicationId || typeof applicationId !== "string" || !applicationId.trim()) {
    const error = new Error("Application ID is required.");
    error.code = "INVALID_ID";
    throw error;
  }

  const trimmedId = applicationId.trim();

  // 1. Fetch local application from MongoDB
  const localApplication = await Application.findOne({ applicationId: trimmedId }).lean();

  if (!localApplication) {
    const error = new Error("Application not found.");
    error.code = "NOT_FOUND";
    throw error;
  }

  // 2. Compute deterministic intelligence
  const intelligence = analyzeApplication(localApplication);

  // 3. Attempt to fetch external status & comparison
  let external = null;
  let comparison = null;

  try {
    external = await getApplicationStatus(trimmedId);
    comparison = compareApplicationStatus(localApplication, external);
  } catch (extErr) {
    console.warn(`[applicationContextService] External status unavailable for ${trimmedId}:`, extErr.message);
  }

  // 4. Construct chronological timeline from statusHistory or timeline
  let timeline = [];

  if (Array.isArray(localApplication.statusHistory) && localApplication.statusHistory.length > 0) {
    timeline = localApplication.statusHistory.map((item) => ({
      status: item.status,
      source: item.source,
      timestamp: item.timestamp,
      remarks: item.remarks || ""
    }));
  } else if (Array.isArray(localApplication.timeline) && localApplication.timeline.length > 0) {
    timeline = localApplication.timeline.map((item) => ({
      status: item.status,
      source: "local",
      timestamp: item.date,
      remarks: item.description || item.title || ""
    }));
  }

  // Ensure chronological order (oldest first)
  timeline.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  return {
    application: {
      applicationId: localApplication.applicationId,
      serviceName: localApplication.serviceName,
      status: localApplication.status,
      submittedDate: localApplication.submittedDate,
      lastUpdated: localApplication.lastUpdated
    },
    intelligence: {
      processingDays: intelligence.processingDays,
      expectedDays: intelligence.expectedDays,
      daysRemaining: intelligence.daysRemaining,
      delayStatus: intelligence.delayStatus,
      statusLabel: intelligence.statusLabel,
      severity: intelligence.severity,
      message: intelligence.message,
      reason: intelligence.reason,
      caseSummary: intelligence.caseSummary,
      recommendedAction: intelligence.nextAction?.title || ""
    },
    external,
    comparison,
    timeline
  };
};

module.exports = {
  buildApplicationContext
};
