const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    applicationId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    applicantName: {
      type: String,
      required: true,
      trim: true
    },

    serviceName: {
      type: String,
      required: true,
      trim: true
    },

    department: {
      type: String,
      required: true,
      trim: true
    },

    status: {
      type: String,
      enum: [
        "SUBMITTED",
        "UNDER_VERIFICATION",
        "ACTION_REQUIRED",
        "APPROVED",
        "REJECTED",
        "COMPLETED"
      ],
      required: true
    },

    delayStatus: {
      type: String,
      enum: [
        "ON_TIME",
        "APPROACHING_DEADLINE",
        "DELAYED"
      ],
      default: "ON_TIME"
    },

    submittedDate: {
      type: Date,
      required: true
    },

    lastUpdated: {
      type: Date,
      required: true
    },

    expectedDays: {
      type: Number,
      required: true
    },

    requiredAction: {
      type: String,
      default: null
    },

    timeline: [
      {
        status: String,
        date: Date,
        description: String
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Application", applicationSchema);