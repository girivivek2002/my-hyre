import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/db";
import { calculateCandidateMatch } from "@/lib/ai-matcher";

const JWT_SECRET = (process.env.JWT_SECRET || "super-secret-fallback-key").replace(/['"]+/g, '');

async function verifyRecruiter(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  try {
    const decoded: any = jwt.verify(auth.split(" ")[1], JWT_SECRET);
    if (decoded.role !== "recruiter") return null;
    return decoded;
  } catch {
    return null;
  }
}

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
    if (jobId) {
      // Fetch candidates shortlisted for this specific job
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
      candidates = shortlists.map(s => ({
        ...s.candidate.user,
        candidateProfile: s.candidate,
        shortlistStatus: s.status
      }));
    } else {
      // Original behavior: Talent Pool
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

    const formatted = await Promise.all(candidates.map(async (c) => {
      // Self-healing: Create profile if missing
      let profile = c.candidateProfile;
      if (!profile) {
        profile = await prisma.candidate.create({
          data: {
            userId: c.id,
            name: c.name || "Unknown Node",
            email: c.email || `${c.id}@citizen.node`,
            role: "Citizen Node",
            biography: "Identity synthesized via automated recovery."
          }
        });
      }

      let matchScore = 85; // Baseline
      if (scoringJob) {
         matchScore = await calculateCandidateMatch(
           {
             skills: profile.skills || [],
             biography: profile.biography,
             experience: profile.experience
           },
           {
             title: scoringJob.title,
             skills: scoringJob.skills,
             description: scoringJob.description
           }
         );
      }

      return {
        id: c.id,
        name: c.name || "Unknown",
        email: c.email || "no-email@mrhyre.com",
        initials: (c.name || "UN").slice(0, 2).toUpperCase(),
        role: profile.role || "Job Seeker",
        location: profile.location || "Remote",
        experience: profile.experience || "Entry Level",
        match: matchScore,
        skills: profile.skills || ["Communication", "Research"],
        summary: profile.biography || "No intelligence summary provided.",
        status: "Verified",
      };
    }));

    return NextResponse.json({ candidates: formatted });
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
        // More self-healing: if the recruiter tries to shortlist a user without a profile, create it now.
        const user = await prisma.user.findUnique({ where: { id: candidateId } });
        if (!user) return NextResponse.json({ error: "User node not found" }, { status: 404 });
        
        const newCandidate = await prisma.candidate.create({
            data: {
                userId: user.id,
                name: user.name,
                email: user.email,
                role: "Job Seeker"
            }
        });
        
        const shortlist = await prisma.shortlist.upsert({
            where: { candidateId_jobId: { candidateId: newCandidate.id, jobId } },
            update: { status: status || "SHORTLISTED" },
            create: { candidateId: newCandidate.id, jobId, status: status || "SHORTLISTED" }
        });
        return NextResponse.json({ message: "Candidate synchronized and shortlisted", shortlist });
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
