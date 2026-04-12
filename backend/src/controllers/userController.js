import prisma from "../utils/prisma.js";

/**
 * GET /api/user/me
 * Retrieves the currently authenticated user's real DB details and initial metrics
 */
export async function getProfile(req, res, next) {
  try {
    const userId = req.user.id;

    // Fetch the user from the database directly, omitting password
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        website: true,
        industry: true,
        teamSize: true,
        createdAt: true,
        // Eager load relational counts to populate dashboard stats securely
        _count: {
          select: {
            resumes: true,
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: "User profile not found." });
    }

    // Pass the real DB data. The stats are dynamically set based on relation counts (which will be 0 initially).
    return res.status(200).json({
      user,
      stats: {
        resumesUploaded: user._count.resumes, 
        // These will be 0 initially as per user request to map to DB
        matches: 0,
        interviews: 0, 
        shortlists: 0,
        profileStrength: 0, 
        activeJobs: 0,
        candidates: 0,
        hiringRate: 0
      }
    });

  } catch (error) {
    next(error);
  }
}
