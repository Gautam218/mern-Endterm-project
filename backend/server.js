const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

// Import Routers
const authRouter = require("./routes/auth");
const categoryRouter = require("./routes/categories");
const productRouter = require("./routes/products");
const brainTreeRouter = require("./routes/braintree");
const orderRouter = require("./routes/orders");
const usersRouter = require("./routes/users");
const customizeRouter = require("./routes/customize");

const CreateAllFolder = require("./config/uploadFolderCreateScript");
const seedData = require("./seed");

// Create upload folders
CreateAllFolder();

// CORS Configuration
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// State variable to track MongoDB connection
let isDbConnected = false;

// Connect to MongoDB
const mongoUri = process.env.DATABASE && process.env.DATABASE.trim() !== "" && !process.env.DATABASE.includes("//Connect")
  ? process.env.DATABASE
  : "mongodb://127.0.0.1:27017/OrganEase";

console.log("Attempting MongoDB connection to:", mongoUri.replace(/\/\/.*@/, "//***:***@"));

mongoose
  .connect(mongoUri, {
    serverSelectionTimeoutMS: 3000,
  })
  .then(async () => {
    isDbConnected = true;
    console.log("=================================================");
    console.log("  MongoDB Connected Successfully to OrganEase DB ");
    console.log("=================================================");
    try {
      await seedData();
    } catch (seedErr) {
      console.warn("Auto-seed notice:", seedErr.message);
    }
  })
  .catch((err) => {
    isDbConnected = false;
    console.warn("-------------------------------------------------");
    console.warn("  MongoDB Not Connected: " + err.message);
    console.warn("  OrganEase backend is operating with Mock-Seed  ");
    console.warn("  fallback mode for zero-setup instant demo!     ");
    console.warn("-------------------------------------------------");
  });

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    service: "OrganEase API Gateway",
    version: "2.0.0",
    databaseConnected: isDbConnected,
    timestamp: new Date().toISOString(),
  });
});

// Manual Seed / Reset Endpoint
app.post("/api/seed", async (req, res) => {
  try {
    if (isDbConnected) {
      await seedData();
      return res.json({ success: true, message: "Database seeded successfully" });
    } else {
      return res.json({ success: true, message: "Mock store seeded successfully (Demo Mode)" });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// API Routes
app.use("/api", authRouter);
app.use("/api/user", usersRouter);
app.use("/api/category", categoryRouter);
app.use("/api/product", productRouter);
app.use("/api", brainTreeRouter);
app.use("/api/order", orderRouter);
app.use("/api/customize", customizeRouter);

// 404 handler for API routes
app.use((req, res, next) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ error: `API route not found: ${req.method} ${req.path}` });
  }
  next();
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message,
  });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`===============================================`);
  console.log(`  OrganEase Backend running on port ${PORT}     `);
  console.log(`  http://localhost:${PORT}/api/health           `);
  console.log(`===============================================`);
});
