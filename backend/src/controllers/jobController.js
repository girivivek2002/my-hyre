import prisma from "../utils/prisma.js";
import { parseJobWithAI } from "../services/aiService.js";

/**
 * POST /api/job/create
 * Parse a job description with AI and store it in the database.
 */
export async function createJob(req, res, next) {
  try {
    const { description } = req.body;

    if (!description || typeof description !== "string" || description.trim().length === 0) {
      return res.status(400).json({ error: "Job description text is required." });
    }

    const parsed = await parseJobWithAI(description);

    const savedJob = await prisma.job.create({
      data: {
        title: parsed.title,
        skills: parsed.skills,
        experience: parsed.experience,
      },
    });

    return res.status(201).json({
      message: "Job parsed and saved successfully",
      job: savedJob,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/job/test
 */
export function testRoute(req, res) {
  res.json({ message: "Job route is working" });
}
