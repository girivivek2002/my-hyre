import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { verifyCandidate } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const candidateUser = await verifyCandidate(req);
  if (!candidateUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // In a real app, you would upload to S3/Cloudinary here.
    // For now, we simulate success and store the filename in the database.
    const resume = await prisma.resume.create({
      data: {
        userId: candidateUser.id,
        name: file.name,
        experience: 0, // Placeholder for AI parsing results
        skills: [], // Placeholder for AI parsing results
      }
    });

    return NextResponse.json({ message: "Resume uploaded successfully", resume });
  } catch (error: any) {
    console.error("Resume Upload Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
