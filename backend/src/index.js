import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import "dotenv/config";

import resumeRoutes from "./routes/resumeRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import matchRoutes from "./routes/matchRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import errorHandler from "./middleware/errorHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Backend running" });
});

// Diagnostic UI
app.get("/test", (req, res) => {
  res.sendFile(path.join(__dirname, "../test-flow.html"));
});

// API Routes
app.use("/api/resume", resumeRoutes);
app.use("/api/job", jobRoutes);
app.use("/api/match", matchRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// Global error handler (must be LAST)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📄 Resume API: http://localhost:${PORT}/api/resume/test`);
  console.log(`💼 Job API:    http://localhost:${PORT}/api/job/test`);
  console.log(`🎯 Match API:  http://localhost:${PORT}/api/match/test`);
});
