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
import analyticsRoutes from "./routes/analyticsRoutes.js";
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

// Health check & System Status
app.get("/", async (req, res) => {
  let dbStatus = "Checking...";
  let dbColor = "#94a3b8";
  
  try {
    const prisma = (await import("./utils/prisma.js")).default;
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = "Connected to Supabase";
    dbColor = "#22c55e";
  } catch (err) {
    dbStatus = "Connection Failed: " + err.message;
    dbColor = "#ef4444";
  }

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Mr. Hyre API | System Status</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet">
        <style>
            :root {
                --bg: #0f172a;
                --card: rgba(30, 41, 59, 0.7);
                --accent: #3b82f6;
            }
            body {
                background: var(--bg);
                color: white;
                font-family: 'Inter', sans-serif;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100vh;
                margin: 0;
                overflow: hidden;
            }
            .background {
                position: absolute;
                inset: 0;
                background: radial-gradient(circle at 50% 50%, #1e293b 0%, #0f172a 100%);
                z-index: -1;
            }
            .glow {
                position: absolute;
                width: 600px;
                height: 600px;
                background: radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.15), transparent 70%);
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: -1;
            }
            .card {
                background: var(--card);
                backdrop-filter: blur(12px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                padding: 3rem;
                border-radius: 2rem;
                text-align: center;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                max-width: 450px;
                width: 90%;
            }
            .logo {
                font-size: 2.5rem;
                font-weight: 800;
                margin-bottom: 1rem;
                background: linear-gradient(to tr, #3b82f6, #818cf8);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
            .status-badge {
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                background: rgba(34, 197, 94, 0.1);
                color: #22c55e;
                padding: 0.5rem 1rem;
                border-radius: 100px;
                font-size: 0.875rem;
                font-weight: 600;
                margin-bottom: 1rem;
                border: 1px solid rgba(34, 197, 94, 0.2);
            }
            .db-status {
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                color: ${dbColor};
                font-size: 0.75rem;
                font-weight: 600;
                margin-bottom: 2rem;
                font-family: monospace;
            }
            .dot {
                width: 8px;
                height: 8px;
                background: #22c55e;
                border-radius: 50%;
                box-shadow: 0 0 10px #22c55e;
                animation: pulse 2s infinite;
            }
            @keyframes pulse {
                0% { opacity: 1; }
                50% { opacity: 0.4; }
                100% { opacity: 1; }
            }
            h1 { font-size: 1.25rem; margin-bottom: 0.5rem; }
            p { color: #94a3b8; font-size: 0.875rem; line-height: 1.6; margin-bottom: 2rem; }
            .btn {
                background: #3b82f6;
                color: white;
                text-decoration: none;
                padding: 0.75rem 1.5rem;
                border-radius: 0.75rem;
                font-weight: 600;
                font-size: 0.875rem;
                transition: transform 0.2s;
                display: inline-block;
            }
            .btn:hover { transform: translateY(-2px); }
        </style>
    </head>
    <body>
        <div class="background"></div>
        <div class="glow"></div>
        <div class="card">
            <div class="logo">Mr. Hyre AI</div>
            <div class="status-badge">
                <div class="dot"></div>
                API Engine Operational
            </div>
            <div class="db-status">Database: ${dbStatus}</div>
            <h1>System Diagnostics</h1>
            <p>If the database status is red, please verify your Supabase credentials in Render's environment settings.</p>
            <a href="https://mr-hyre-nine.vercel.app/" class="btn">Return to Platform</a>
        </div>
    </body>
    </html>
  `);
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
app.use("/api/analytics", analyticsRoutes);

// Global error handler (must be LAST)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📄 Resume API: http://localhost:${PORT}/api/resume/test`);
  console.log(`💼 Job API:    http://localhost:${PORT}/api/job/test`);
  console.log(`🎯 Match API:  http://localhost:${PORT}/api/match/test`);
});
