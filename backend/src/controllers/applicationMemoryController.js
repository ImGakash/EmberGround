const Application = require("../models/Application");
const { searchApplicationMemory } = require("../services/breethService");

const getApplicationMemory = async (req, res) => {
  try {
    const { applicationId } = req.params;

    // Check if application exists in MongoDB
    const application = await Application.findOne({
      applicationId
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found"
      });
    }

    // Search Breeth memory using the application ID
    const query = `
      What do you know about Nagrik application ${applicationId}?
      Include its status, processing time, delay information,
      reason for delay, expected processing days, and recommended action.
    `;

    const result = await searchApplicationMemory(query);

    if (!result.success) {
      return res.status(502).json({
        success: false,
        message: "Unable to retrieve application memory from Breeth"
      });
    }

    res.status(200).json({
      success: true,
      applicationId,
      memory: result.data
    });

  } catch (error) {
    console.error("Error retrieving application memory:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

module.exports = {
  getApplicationMemory
};