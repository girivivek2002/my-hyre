import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { verifyRecruiter } from "@/lib/auth";

export const dynamic = "force-dynamic";

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
            logoUrl: true,
            coverUrl: true,
          },
        },
      },
    });

    if (!userRecord) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const response = NextResponse.json({
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
        logoUrl: userRecord.recruiterProfile?.logoUrl || "",
        coverUrl: userRecord.recruiterProfile?.coverUrl || "",
      },
    });

    // Prevent cross-account data leakage via browser cache
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
    
    return response;
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
    const { companyName, companySize, industry, bio, website, location, marketStatus, phone, logoUrl, coverUrl } = body;

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
        ...(logoUrl !== undefined && { logoUrl }),
        ...(coverUrl !== undefined && { coverUrl }),
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
        logoUrl: logoUrl || "",
        coverUrl: coverUrl || "",
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
