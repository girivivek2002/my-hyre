import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { calculateCandidateMatch } from "@/lib/ai-matcher";
import { verifyRecruiter } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const authUser = await verifyRecruiter(req);
  if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const url = new URL(req.url);
    const jobId = url.searchParams.get("jobId");

    const recruiter = await prisma.recruiter.findUnique({
      where: { userId: authUser.id }
    });

    if (!recruiter) {
      return NextResponse.json({ candidates: [] });
    }

    let candidates = [];
    if (jobId && jobId !== "talent-pool") {
      console.log(`[GET /api/recruiter/candidates] Fetching for jobId: ${jobId}, recruiterId: ${recruiter.id}`);
      // Strictly filter by jobId: Only show candidates already in this pipeline
      const shortlists = await prisma.shortlist.findMany({
        where: { jobId: jobId, job: { recruiterId: recruiter.id } },
        include: {
          candidate: {
            include: {
              user: {
                include: {
                  resumes: { take: 1, orderBy: { createdAt: "desc" } }
                }
              }
            }
          }
        }
      });
      
      console.log(`[GET /api/recruiter/candidates] Found ${shortlists.length} shortlists`);

      candidates = shortlists.map((s: any) => ({
        ...s.candidate.user, // May be null
        id: s.candidate.user?.id || s.candidate.id, // Fallback to candidate id if user missing
        candidateProfile: s.candidate,
        shortlistStatus: s.status,
        resumes: s.candidate.user?.resumes || []
      }));
    } else {
      // Global Talent Pool: Show everyone
      candidates = await prisma.user.findMany({
        where: { role: "candidate" },
        include: {
          candidateProfile: true,
          resumes: { take: 1, orderBy: { createdAt: "desc" } }
        },
        orderBy: { createdAt: "desc" }
      });
    }

    // Find latest job for matching if not filtering by specific job
    let scoringJob = null;
    if (jobId) {
      scoringJob = await prisma.job.findUnique({ where: { id: jobId } });
    } else {
      scoringJob = await prisma.job.findFirst({
        where: { recruiterId: recruiter.id },
        orderBy: { createdAt: "desc" }
      });
    }

    const formatted = await Promise.all(candidates.map(async (c: any) => {
      // Get profile
      const profile = c.candidateProfile;
      
      // If profile is missing, return a partial object without creating a record
      // This prevents 'phantom' profiles for recruiters who might be misconfigured
      if (!profile) {
        return {
          id: c.id,
          name: c.name || "Pending Onboarding",
          email: c.email || "pending@mrhyre.com",
          initials: (c.name || "P").slice(0, 2).toUpperCase(),
          role: "Candidate",
          location: "Syncing...",
          experience: "Pending",
          match: 0,
          matchAnalysis: {
            summary: "Profile data is currently unavailable. The candidate must complete their intelligence sync.",
            strengths: [],
            gaps: []
          },
          skills: [],
          summary: "This user has not yet initialized their professional intelligence profile.",
          resume: null,
          status: "Pending",
        };
      }

      let matchResult: any = { score: 85, summary: "Initial screening...", strengths: [], gaps: [] };
      if (scoringJob) {
        // Fetch resume data if available
        const latestResume = c.resumes?.[0] || (profile?.user?.resumes?.[0]);

        matchResult = await calculateCandidateMatch(
          {
            name: profile.name,
            role: profile.role,
            skills: profile.skills || [],
            biography: profile.biography,
            experience: profile.experience,
            location: profile.location,
            salaryExpectation: profile.salaryExpectation,
            noticePeriod: profile.noticePeriod,
            workPreference: profile.workPreference
          },
          scoringJob,
          latestResume ? {
            skills: latestResume.skills,
            experience: latestResume.experience,
            name: latestResume.name
          } : undefined
        );
      }

      return {
        id: c.id,
        name: profile.name || c.name || "Unknown Node",
        email: profile.email || c.email || "no-email@mrhyre.com",
        initials: (profile.name || c.name || "UN").slice(0, 2).toUpperCase(),
        role: profile.role || "Job Seeker",
        location: profile.location || "Remote",
        experience: profile.experience || "Entry Level",
        match: matchResult.score,
        matchAnalysis: {
          summary: matchResult.summary,
          strengths: matchResult.strengths,
          gaps: matchResult.gaps
        },
        skills: profile.skills || ["Communication", "Research"],
        summary: profile.biography || "No intelligence summary provided.",
        resume: c.resumes?.[0]?.name || null,
        status: "Verified",
      };
    }));

    // Sort by match score descending
    const sorted = formatted.sort((a, b) => b.match - a.match);

    return NextResponse.json({ candidates: sorted });
  } catch (error) {
    console.error("Recruiter Candidates Stream Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authUser = await verifyRecruiter(req);
  if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { candidateId, jobId, status } = await req.json();

    // candidateId is the User ID from the frontend.
    // We need the Candidate table ID.
    const candidate = await prisma.candidate.findUnique({ where: { userId: candidateId } });
    if (!candidate) {
      return NextResponse.json({ error: "Candidate profile not found. The user must complete their profile before being shortlisted." }, { status: 404 });
    }

    const shortlist = await prisma.shortlist.upsert({
      where: {
        candidateId_jobId: {
          candidateId: candidate.id,
          jobId: jobId
        }
      },
      update: { status: status || "SHORTLISTED" },
      create: {
        candidateId: candidate.id,
        jobId: jobId,
        status: status || "SHORTLISTED"
      }
    });

    return NextResponse.json({ message: "Selection synchronized successfully", shortlist });
  } catch (error) {
    console.error("Shortlist Error:", error);
    return NextResponse.json({ error: "Platform Synchronization Error" }, { status: 500 });
  }
}
