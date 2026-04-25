import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ error: "Access denied. No session found." }, { status: 401 });
    }

    // Fetch the user from the database directly, omitting password
    const user = await prisma.user.findUnique({
      where: { id: session.id },
      include: {
        candidateProfile: true,
        recruiterProfile: true,
        resumes: {
          take: 1,
          orderBy: { createdAt: "desc" },
          select: { name: true }
        },
        _count: {
          select: {
            resumes: true,
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User profile not found." }, { status: 404 });
    }

    return NextResponse.json({
      user,
      stats: {
        resumesUploaded: user._count.resumes, 
        matches: 0,
        interviews: 0, 
        shortlists: 0,
        profileStrength: 0, 
        activeJobs: 0,
        candidates: 0,
        hiringRate: 0
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error("User Profile Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
