/**
 * External Application Service Client
 * Handles HTTP requests to an external government or service status API.
 */

const getExternalApplicationStatus = async (applicationId) => {
  const apiUrl = process.env.EXTERNAL_APPLICATION_API_URL;
  const apiKey = process.env.EXTERNAL_APPLICATION_API_KEY;

  if (!apiUrl || apiUrl.trim() === "") {
    const error = new Error("External application status API is not configured.");
    error.code = "CONFIG_ERROR";
    throw error;
  }

  console.log(`Fetching external application status for applicationId: ${applicationId}`);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // 8-second timeout

  try {
    const headers = {
      "Content-Type": "application/json"
    };

    if (apiKey) {
      headers["X-API-Key"] = apiKey;
    }

    const response = await fetch(`${apiUrl}/applications/${encodeURIComponent(applicationId)}`, {
      method: "GET",
      headers,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (response.status === 404) {
      const error = new Error("Application not found in external service.");
      error.code = "NOT_FOUND";
      throw error;
    }

    if (!response.ok) {
      const error = new Error("External application status service is unavailable.");
      error.code = "UNAVAILABLE";
      throw error;
    }

    const rawData = await response.json();
    return rawData;
  } catch (err) {
    clearTimeout(timeoutId);

    if (err.code === "CONFIG_ERROR" || err.code === "NOT_FOUND") {
      throw err;
    }

    console.error("External application status request failed:", err.message);

    if (err.name === "AbortError") {
      const error = new Error("External application status service is unavailable.");
      error.code = "UNAVAILABLE";
      throw error;
    }

    const error = new Error("External application status service is unavailable.");
    error.code = "UNAVAILABLE";
    throw error;
  }
};

module.exports = {
  getExternalApplicationStatus
};
