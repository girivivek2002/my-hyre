import fs from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { extractTextFromPDF, parseResumeWithAI, ParsedResume } from "@/lib/resume-parser";
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

    // Save the file to public/uploads
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const uploadDir = path.join(process.cwd(), "public/uploads");
    const filePath = path.join(uploadDir, file.name);
    
    await fs.writeFile(filePath, buffer);

    // Parse the resume with AI
    let parsedData: ParsedResume = { name: file.name, skills: [], experience: 0, summary: "" };
    try {
      const extractedText = await extractTextFromPDF(buffer);
      parsedData = await parseResumeWithAI(extractedText);
    } catch (parseError) {
      console.error("Non-critical Parse Error:", parseError);
    }

    const resume = await prisma.resume.create({
      data: {
        userId: candidateUser.id,
        name: parsedData.name || file.name,
        experience: parsedData.experience || 0,
        skills: parsedData.skills || [],
      }
    });

    return NextResponse.json({ 
      message: "Resume uploaded and synchronized with intelligence engine", 
      resume,
      parsed: {
        summary: parsedData.summary
      }
    });
  } catch (error: any) {
    console.error("Resume Upload Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
