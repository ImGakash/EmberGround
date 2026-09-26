const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const applicationRoutes = require("./routes/applicationRoutes");
const applicationMemoryRoutes = require("./routes/applicationMemoryRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

// Application API
app.use("/api/applications", applicationRoutes);

// Breeth memory API
app.use("/api/applications", applicationMemoryRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Nagrik Backend is running 🚀"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Nagrik Backend running on port ${PORT}`);
});