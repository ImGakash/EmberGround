/**
 * Application Status Orchestration Service
 * Coordinates fetching from external/mock services and normalizing responses.
 */

const { getExternalApplicationStatus } = require("./externalApplicationService");
const { getMockExternalApplicationStatus } = require("./mockExternalApplicationService");
const { normalizeApplicationStatus } = require("./applicationStatusNormalizer");

const getApplicationStatus = async (applicationId) => {
  if (!applicationId || typeof applicationId !== "string" || !applicationId.trim()) {
    const error = new Error("Application ID is required.");
    error.code = "INVALID_ID";
    throw error;
  }

  const trimmedId = applicationId.trim();
  const useMock = process.env.USE_MOCK_EXTERNAL_API === "true";

  let rawExternalData;

  if (useMock) {
    rawExternalData = await getMockExternalApplicationStatus(trimmedId);
  } else {
    rawExternalData = await getExternalApplicationStatus(trimmedId);
  }

  const normalizedData = normalizeApplicationStatus(rawExternalData);
  return normalizedData;
};

module.exports = {
  getApplicationStatus
};
