const dns = require("dns");
const applicationRoutes = require("./routes/applicationRoutes");

dns.setDefaultResultOrder("ipv4first");

const express = require("express");
const cors = require("cors");

require("dotenv").config();

const connectDB = require("./config/db");


const app = express();

// Connect MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/applications", applicationRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Nagrik Backend is running 🚀"
  });
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Nagrik Backend running on port ${PORT}`);
});