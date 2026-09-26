const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const Application = require(
  "../models/Application"
);

const applications = [
  {
    applicationId: "NGR-APP-001",

    serviceName: "Birth Certificate",

    status: "UNDER_VERIFICATION",

    submittedDate:
      new Date("2026-09-18"),

    lastUpdated:
      new Date("2026-09-23"),

    expectedDays: 15,

    requiredAction: "",

    timeline: [
      {
        status: "SUBMITTED",

        title: "Application submitted",

        description:
          "The application was submitted successfully.",

        date:
          new Date("2026-09-18")
      },

      {
        status: "UNDER_VERIFICATION",

        title: "Verification started",

        description:
          "The application entered the verification stage.",

        date:
          new Date("2026-09-23")
      }
    ]
  },

  {
    applicationId: "NGR-APP-002",

    serviceName: "Government Service Application",

    status: "ACTION_REQUIRED",

    submittedDate:
      new Date("2026-09-05"),

    lastUpdated:
      new Date("2026-09-20"),

    expectedDays: 15,

    requiredAction:
      "Additional information may be required. Please check the official application communication.",

    timeline: [
      {
        status: "SUBMITTED",

        title: "Application submitted",

        description:
          "The application was submitted successfully.",

        date:
          new Date("2026-09-05")
      },

      {
        status: "ACTION_REQUIRED",

        title: "Action required",

        description:
          "The application indicates that additional action may be required.",

        date:
          new Date("2026-09-20")
      }
    ]
  },

  {
    applicationId: "NGR-APP-003",

    serviceName: "Public Service Application",

    status: "APPROVED",

    submittedDate:
      new Date("2026-09-01"),

    lastUpdated:
      new Date("2026-09-12"),

    expectedDays: 15,

    requiredAction: "",

    timeline: [
      {
        status: "SUBMITTED",

        title: "Application submitted",

        description:
          "The application was submitted successfully.",

        date:
          new Date("2026-09-01")
      },

      {
        status: "UNDER_PROCESSING",

        title: "Application processing",

        description:
          "The application entered processing.",

        date:
          new Date("2026-09-05")
      },

      {
        status: "APPROVED",

        title: "Application approved",

        description:
          "The application reached an approved state.",

        date:
          new Date("2026-09-12")
      }
    ]
  }
];

const seed = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI
    );

    await Application.deleteMany({});

    await Application.insertMany(
      applications
    );

    console.log(
      "Applications seeded successfully"
    );

    await mongoose.connection.close();
  } catch (error) {
    console.error(error);

    process.exit(1);
  }
};

seed();