const axios = require("axios");

const BREETH_BASE_URL = "https://api.thebreeth.com";

const saveApplicationMemory = async (application, intelligence) => {
  try {
    const content = `
Nagrik application update:

Application ID: ${application.applicationId}
Applicant: ${application.applicantName}
Service: ${application.serviceName}
Department: ${application.department}
Current Status: ${application.status}

Processing Days: ${intelligence.processingDays}
Expected Processing Days: ${intelligence.expectedDays}
Delay Status: ${intelligence.delayStatus}
Priority Score: ${intelligence.priorityScore}
Priority Level: ${intelligence.priorityLevel}

Case Summary:
${intelligence.caseSummary}

Reason:
${intelligence.reason}

Recommended Action:
${intelligence.recommendedAction}
`;

    const response = await axios.post(
      `${BREETH_BASE_URL}/v1/episodes`,
      {
        content,
        group_id: "nagrik",
        extract_intent: true
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.BREETH_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error(
      "Breeth memory error:",
      error.response?.data || error.message
    );

    return {
      success: false,
      message: "Unable to save application memory to Breeth"
    };
  }
};

const searchApplicationMemory = async (query) => {
  try {
    const response = await axios.post(
      `${BREETH_BASE_URL}/v1/search`,
      {
        query,
        limit: 5
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.BREETH_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error(
      "Breeth search error:",
      error.response?.data || error.message
    );

    return {
      success: false,
      message: "Unable to search Breeth memory"
    };
  }
};

module.exports = {
  saveApplicationMemory,
  searchApplicationMemory
};