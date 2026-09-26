/**
 * Application Status Normalizer Layer
 * Converts vendor-specific external responses into Nagrik's standardized format.
 */

const normalizeApplicationStatus = (externalData) => {
  if (!externalData || typeof externalData !== "object") {
    const error = new Error("External application status response mapping must be configured.");
    error.code = "NORMALIZATION_ERROR";
    throw error;
  }

  // Map mock or standard external fields to Nagrik format
  const applicationId = externalData.applicationId || externalData.rawApplicationId;
  const serviceName = externalData.serviceName || externalData.serviceTitle;
  const status = externalData.status || externalData.currentStatus;
  const submittedDate = externalData.submittedDate || externalData.submissionTimestamp;
  const lastUpdated = externalData.lastUpdated || externalData.lastUpdatedTimestamp;
  const remarks = externalData.remarks || externalData.externalRemarks || "";
  const source = externalData.source || externalData.providerSource || "external";

  if (!applicationId || !serviceName || !status) {
    const error = new Error("External application status response mapping must be configured.");
    error.code = "NORMALIZATION_ERROR";
    throw error;
  }

  return {
    applicationId,
    serviceName,
    status,
    submittedDate,
    lastUpdated,
    remarks,
    source
  };
};

module.exports = {
  normalizeApplicationStatus
};
