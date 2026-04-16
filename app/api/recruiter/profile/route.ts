import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-fallback-key";

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

// GET: Fetch recruiter company profile
export async function GET(req: NextRequest) {
  const user = await verifyRecruiter(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const userRecord = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        website: true,
        industry: true,
        teamSize: true,
        recruiterProfile: {
          select: {
            id: true,
            companyName: true,
            companySize: true,
            industry: true,
          },
        },
      },
    });

    if (!userRecord) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      profile: {
        id: userRecord.id,
        name: userRecord.name,
        email: userRecord.email,
        phone: userRecord.phone,
        website: userRecord.website,
        industry: userRecord.recruiterProfile?.industry || userRecord.industry,
        companyName: userRecord.recruiterProfile?.companyName || userRecord.name,
        companySize: userRecord.recruiterProfile?.companySize || userRecord.teamSize,
      },
    });
  } catch (error: any) {
    console.error("Recruiter Profile GET Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PATCH: Update recruiter company profile
export async function PATCH(req: NextRequest) {
  const user = await verifyRecruiter(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { companyName, industry, website, phone } = body;

    // Update the User record
    await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(website !== undefined && { website }),
        ...(phone !== undefined && { phone }),
        ...(industry !== undefined && { industry }),
      },
    });

    // Update the Recruiter profile if it exists
    const recruiter = await prisma.recruiter.findUnique({
      where: { userId: user.id },
    });

    if (recruiter) {
      await prisma.recruiter.update({
        where: { id: recruiter.id },
        data: {
          ...(companyName !== undefined && { companyName }),
          ...(industry !== undefined && { industry }),
        },
      });
    }

    return NextResponse.json({ message: "Profile updated successfully" });
  } catch (error: any) {
    console.error("Recruiter Profile PATCH Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
