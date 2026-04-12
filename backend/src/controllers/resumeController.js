import fs from "fs";
import path from "path";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");
import prisma from "../utils/prisma.js";
import { parseResumeWithAI } from "../services/aiService.js";

/**
 * POST /api/resume/upload
 * Upload a PDF resume, extract text, parse with AI, and store in database.
 */
export async function uploadResume(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No PDF file uploaded. Use field name 'resume'." });
    }

    const filePath = path.resolve(req.file.path);
    const fileBuffer = fs.readFileSync(filePath);

    // Extract text from PDF
    const pdfData = await pdfParse(fileBuffer);
    const extractedText = pdfData.text;

    if (!extractedText || extractedText.trim().length === 0) {
      fs.unlinkSync(filePath);
      return res.status(400).json({ error: "Could not extract text from the PDF." });
    }

    // Parse with AI
    const parsed = await parseResumeWithAI(extractedText);

    // Store in database (dummy userId for now)
    const DUMMY_USER_ID = "00000000-0000-0000-0000-000000000001";

    await prisma.user.upsert({
      where: { id: DUMMY_USER_ID },
      update: {},
      create: {
        id: DUMMY_USER_ID,
        email: "demo@mrhyre.ai",
        role: "candidate",
      },
    });

    const savedResume = await prisma.resume.create({
      data: {
        userId: DUMMY_USER_ID,
        name: parsed.name,
        skills: parsed.skills,
        experience: parsed.experience,
      },
    });

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    return res.status(201).json({
      message: "Resume parsed and saved successfully",
      resume: savedResume,
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
}

/**
 * GET /api/resume/test
 */
export function testRoute(req, res) {
  res.json({ message: "Resume route is working" });
}
