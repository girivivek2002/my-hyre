import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { verifyCandidate } from "@/lib/auth";
import fs from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  const candidateUser = await verifyCandidate(req);
  if (!candidateUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Save the file to public/uploads
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const uploadDir = path.join(process.cwd(), "public/uploads");
    const filePath = path.join(uploadDir, file.name);
    
    await fs.writeFile(filePath, buffer);

    const resume = await prisma.resume.create({
      data: {
        userId: candidateUser.id,
        name: file.name,
        experience: 0, 
        skills: [], 
      }
    });

    return NextResponse.json({ message: "Resume uploaded successfully", resume });
  } catch (error: any) {
    console.error("Resume Upload Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
