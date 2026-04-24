import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-fallback-key";

import { getToken } from "next-auth/jwt";

async function verifyRecruiter(req: NextRequest) {
  // 1. Try NextAuth
  const nextAuthToken = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (nextAuthToken && nextAuthToken.role === "recruiter") {
    return { id: nextAuthToken.userId || nextAuthToken.sub, role: nextAuthToken.role, email: nextAuthToken.email, name: nextAuthToken.name };
  }

  // 2. Try Custom JWT via Header
  const auth = req.headers.get("authorization");
  if (auth?.startsWith("Bearer ") && auth.split(" ")[1] !== "null") {
    try {
      const decoded: any = jwt.verify(auth.split(" ")[1], JWT_SECRET);
      if (decoded.role === "recruiter") return decoded;
    } catch {}
  }

  // 3. Try Custom JWT via Cookie
  const customCookie = req.cookies.get("authToken")?.value;
  if (customCookie) {
    try {
      const decoded: any = jwt.verify(customCookie, JWT_SECRET);
      if (decoded.role === "recruiter") return decoded;
    } catch {}
  }

  return null;
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
        recruiterProfile: {
          select: {
            id: true,
            companyName: true,
            companySize: true,
            industry: true,
            bio: true,
            website: true,
            location: true,
            marketStatus: true,
            phone: true,
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
        companyName: userRecord.recruiterProfile?.companyName || "",
        companySize: userRecord.recruiterProfile?.companySize || "",
        industry: userRecord.recruiterProfile?.industry || "",
        bio: userRecord.recruiterProfile?.bio || "",
        website: userRecord.recruiterProfile?.website || "",
        location: userRecord.recruiterProfile?.location || "",
        marketStatus: userRecord.recruiterProfile?.marketStatus || "",
        phone: userRecord.recruiterProfile?.phone || "",
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
    const { companyName, companySize, industry, bio, website, location, marketStatus, phone } = body;

    // Update or create the Recruiter profile
    const recruiter = await prisma.recruiter.upsert({
      where: { userId: user.id },
      update: {
        ...(companyName !== undefined && { companyName }),
        ...(companySize !== undefined && { companySize }),
        ...(industry !== undefined && { industry }),
        ...(bio !== undefined && { bio }),
        ...(website !== undefined && { website }),
        ...(location !== undefined && { location }),
        ...(marketStatus !== undefined && { marketStatus }),
        ...(phone !== undefined && { phone }),
      },
      create: {
        userId: user.id,
        name: user.name || "Recruiter",
        email: user.email || "",
        companyName: companyName || "",
        companySize: companySize || "",
        industry: industry || "",
        bio: bio || "",
        website: website || "",
        location: location || "",
        marketStatus: marketStatus || "",
        phone: phone || "",
      }
    });

    const response = NextResponse.json({ message: "Profile updated successfully", profile: recruiter });
    response.cookies.set("profileCompleted", "true", { path: "/", httpOnly: true });
    return response;
  } catch (error: any) {
    console.error("Recruiter Profile PATCH Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
