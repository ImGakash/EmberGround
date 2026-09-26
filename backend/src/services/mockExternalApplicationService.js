/**
 * Development Mock External Application Service
 * Simulates external API behavior for architecture testing without real external credentials.
 */

const getMockExternalApplicationStatus = async (applicationId) => {
  console.log(`[DEVELOPMENT MOCK EXTERNAL SERVICE] Fetching mock status for: ${applicationId}`);

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  if (applicationId === "UNKNOWN-ID" || applicationId.toUpperCase().startsWith("UNKNOWN")) {
    const error = new Error("Application not found in external service.");
    error.code = "NOT_FOUND";
    throw error;
  }

  return {
    rawApplicationId: applicationId,
    serviceTitle: "Example Service",
    currentStatus: "UNDER_VERIFICATION",
    submissionTimestamp: new Date("2026-09-18").toISOString(),
    lastUpdatedTimestamp: new Date("2026-09-23").toISOString(),
    externalRemarks: "Application is under verification by development mock external service.",
    providerSource: "external"
  };
};

module.exports = {
  getMockExternalApplicationStatus
};
