const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Application = require("../models/Application");

dotenv.config();

const applications = [
  {
    applicationId: "BSP-2026-10001",
    applicantName: "Rahul Kumar",
    serviceName: "Birth Certificate",
    department: "Municipal Corporation",
    status: "UNDER_VERIFICATION",
    delayStatus: "ON_TIME",
    submittedDate: new Date("2026-09-18"),
    lastUpdated: new Date("2026-09-23"),
    expectedDays: 15,
    requiredAction: null,
    timeline: [
      {
        status: "SUBMITTED",
        date: new Date("2026-09-18"),
        description: "Application submitted successfully"
      },
      {
        status: "UNDER_VERIFICATION",
        date: new Date("2026-09-20"),
        description: "Documents are being verified"
      }
    ]
  },

  {
    applicationId: "BSP-2026-10482",
    applicantName: "Priya Sharma",
    serviceName: "Income Certificate",
    department: "Revenue Department",
    status: "UNDER_VERIFICATION",
    delayStatus: "DELAYED",
    submittedDate: new Date("2026-08-25"),
    lastUpdated: new Date("2026-09-10"),
    expectedDays: 15,
    requiredAction: null,
    timeline: [
      {
        status: "SUBMITTED",
        date: new Date("2026-08-25"),
        description: "Application submitted successfully"
      },
      {
        status: "UNDER_VERIFICATION",
        date: new Date("2026-08-28"),
        description: "Application verification started"
      }
    ]
  },

  {
    applicationId: "BSP-2026-10531",
    applicantName: "Sneha Patil",
    serviceName: "Caste Certificate",
    department: "Revenue Department",
    status: "ACTION_REQUIRED",
    delayStatus: "APPROACHING_DEADLINE",
    submittedDate: new Date("2026-09-15"),
    lastUpdated: new Date("2026-09-22"),
    expectedDays: 15,
    requiredAction: "Upload a clear copy of the required document",
    timeline: [
      {
        status: "SUBMITTED",
        date: new Date("2026-09-15"),
        description: "Application submitted successfully"
      },
      {
        status: "ACTION_REQUIRED",
        date: new Date("2026-09-22"),
        description: "Additional document is required"
      }
    ]
  },

  {
    applicationId: "BSP-2026-10612",
    applicantName: "Arjun Reddy",
    serviceName: "Residence Certificate",
    department: "Revenue Department",
    status: "APPROVED",
    delayStatus: "ON_TIME",
    submittedDate: new Date("2026-09-05"),
    lastUpdated: new Date("2026-09-15"),
    expectedDays: 15,
    requiredAction: null,
    timeline: [
      {
        status: "SUBMITTED",
        date: new Date("2026-09-05"),
        description: "Application submitted successfully"
      },
      {
        status: "UNDER_VERIFICATION",
        date: new Date("2026-09-08"),
        description: "Documents verified"
      },
      {
        status: "APPROVED",
        date: new Date("2026-09-15"),
        description: "Application approved"
      }
    ]
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected for seeding");

    await Application.deleteMany();

    await Application.insertMany(applications);

    console.log("Demo applications inserted successfully ✅");

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed ❌");
    console.error(error.message);
    process.exit(1);
  }
};

seedDatabase();