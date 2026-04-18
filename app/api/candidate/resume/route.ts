import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/db";

const JWT_SECRET = (process.env.JWT_SECRET || "super-secret-fallback-key").replace(/['"]+/g, '');

export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  try {
    const decoded: any = jwt.verify(auth.split(" ")[1], JWT_SECRET);
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // In a real app, you would upload to S3/Cloudinary here.
    // For now, we simulate success and store the filename.
    const resume = await prisma.resume.create({
      data: {
        userId: decoded.id,
        name: file.name,
        experience: 0, // Placeholder
        skills: [], // Placeholder
      }
    });

    return NextResponse.json({ message: "Resume uploaded successfully", resume });
  } catch (error: any) {
    console.error("Resume Upload Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
