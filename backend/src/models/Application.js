const mongoose = require("mongoose");

const timelineSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ""
    },
    date: {
      type: Date,
      required: true
    }
  },
  {
    _id: false
  }
);

const statusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true
    },
    source: {
      type: String,
      required: true,
      default: "local"
    },
    timestamp: {
      type: Date,
      required: true
    },
    remarks: {
      type: String,
      default: ""
    }
  },
  {
    _id: false
  }
);

const applicationSchema = new mongoose.Schema(
  {
    applicationId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },

    serviceName: {
      type: String,
      required: true
    },

    status: {
      type: String,
      required: true,
      enum: [
        "SUBMITTED",
        "UNDER_VERIFICATION",
        "UNDER_PROCESSING",
        "ACTION_REQUIRED",
        "APPROVED",
        "REJECTED",
        "COMPLETED"
      ]
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
      required: true,
      min: 0
    },

    requiredAction: {
      type: String,
      default: ""
    },

    timeline: {
      type: [timelineSchema],
      default: []
    },

    statusHistory: {
      type: [statusHistorySchema],
      default: []
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "Application",
  applicationSchema
);