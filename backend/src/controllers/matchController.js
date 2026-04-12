import prisma from "../utils/prisma.js";

/**
 * GET /api/match/:jobId
 * Match all candidates against a specific job posting.
 *
 * Score formula:
 *   score = (skillMatch * 0.7) + (experienceMatch * 0.3)
 */
export async function getMatches(req, res, next) {
  try {
    const { jobId } = req.params;

    const job = await prisma.job.findUnique({ where: { id: jobId } });

    if (!job) {
      return res.status(404).json({ error: "Job not found." });
    }

    const resumes = await prisma.resume.findMany();

    if (resumes.length === 0) {
      return res.json({ message: "No candidates found.", matches: [] });
    }

    const jobSkills = job.skills.map((s) => s.toLowerCase().trim());
    const jobExperience = job.experience;

    const matches = resumes.map((resume) => {
      const candidateSkills = resume.skills.map((s) => s.toLowerCase().trim());

      // Skill match: what % of job skills does the candidate have?
      const matchingSkills = jobSkills.filter((skill) => candidateSkills.includes(skill));
      const skillMatch = jobSkills.length > 0 ? matchingSkills.length / jobSkills.length : 0;

      // Experience match: capped at 1.0
      const experienceMatch =
        jobExperience > 0 ? Math.min(resume.experience / jobExperience, 1.0) : 1.0;

      // Weighted score
      const score = Math.round((skillMatch * 0.7 + experienceMatch * 0.3) * 100);

      return {
        candidateId: resume.id,
        name: resume.name,
        matchingSkills,
        skillMatchPercent: Math.round(skillMatch * 100),
        experienceMatchPercent: Math.round(experienceMatch * 100),
        score,
      };
    });

    matches.sort((a, b) => b.score - a.score);

    return res.json({
      job: { id: job.id, title: job.title },
      totalCandidates: matches.length,
      matches,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/match/test
 */
export function testRoute(req, res) {
  res.json({ message: "Match route is working" });
}
