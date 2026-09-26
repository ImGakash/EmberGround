const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

require("dotenv").config();

const mongoose = require("mongoose");

const connectDB = require("../config/db");
const Application = require("../models/Application");
const { analyzeApplication } = require("../services/applicationIntelligence");
const { saveApplicationMemory } = require("../services/breethService");

const testBreeth = async () => {
  try {
    console.log("Connecting to MongoDB...");

    await connectDB();

    const application = await Application.findOne({
      applicationId: "BSP-2026-10482"
    });

    if (!application) {
      console.log("Application not found ❌");
      return;
    }

    console.log("Application found ✅");

    const intelligence = analyzeApplication(application);

    console.log("\nNagrik Intelligence:");
    console.log(intelligence);

    console.log("\nSending application memory to Breeth...");

    const result = await saveApplicationMemory(
      application,
      intelligence
    );

    console.log("\nBreeth Response:");
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("\nTest failed ❌");
    console.error(error.message);
  } finally {
    await mongoose.connection.close();
    console.log("\nDatabase connection closed.");
  }
};

testBreeth();