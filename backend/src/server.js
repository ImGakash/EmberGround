const dns = require("dns");

dns.setDefaultResultOrder("ipv4first");

const express = require("express");
const cors = require("cors");

const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const connectDB = require("./config/db");

const applicationRoutes = require(
  "./routes/applicationRoutes"
);

const app = express();

/*
 * Database
 */

connectDB();

/*
 * Middleware
 */

app.use(cors());

app.use(express.json());

/*
 * Routes
 */

app.use(
  "/api/applications",
  applicationRoutes
);

/*
 * Health check
 */

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Nagrik Backend is running"
  });
});

/*
 * Server
 */

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Nagrik Backend running on port ${PORT}`
  );
});