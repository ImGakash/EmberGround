const Application = require("../models/Application");

const getApplicationById = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await Application.findOne({ applicationId });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found"
      });
    }

    res.status(200).json({
      success: true,
      data: application
    });
  } catch (error) {
    console.error("Error fetching application:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

module.exports = {
  getApplicationById
};