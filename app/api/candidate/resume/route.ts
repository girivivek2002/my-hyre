import fs from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import {
  extractTextFromPDF,
  parseResumeWithAI,
  ParsedResume,
} from "@/lib/resume-parser";
import prisma from "@/lib/db";
import { verifyCandidate } from "@/lib/auth";

export async function POST(req: NextRequest) {


  const candidateUser = await verifyCandidate(req);

  if (!candidateUser) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    

    const formData = await req.formData();
    const file = formData.get("file") as File;

    

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    

    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), "public/uploads");

    await fs.mkdir(uploadDir, {
      recursive: true,
    });

    const filePath = path.join(
    uploadDir,
    `${Date.now()}-${file.name}`
  );

    await fs.writeFile(filePath, buffer);

    console.log("✅ File saved:", filePath);

    let parsedData: ParsedResume = {
      name: file.name,
      skills: [],
      experience: 0,
      summary: "",
    };

    try {
      const extractedText = await extractTextFromPDF(buffer);

      

      parsedData = await parseResumeWithAI(extractedText);

    } catch (parseError) {
      console.error("========== PARSE ERROR ==========");
      console.error(parseError);
    }

    const existingResume = await prisma.resume.findFirst({
      where: {
        userId: candidateUser.id,
      },
    });

    let resume;

    if (existingResume) {
      console.log("🔄 Updating existing resume");

      resume = await prisma.resume.update({
        where: {
          id: existingResume.id,
        },
        data: {
          name: parsedData.name || file.name,
          experience: parsedData.experience || 0,
          skills: parsedData.skills || [],
        },
      });
    } else {
      console.log("➕ Creating new resume");

      resume = await prisma.resume.create({
        data: {
          userId: candidateUser.id,
          name: parsedData.name || file.name,
          experience: parsedData.experience || 0,
          skills: parsedData.skills || [],
        },
      });
    }

    console.log("✅ Resume saved to database");

    return NextResponse.json({
      message:
        "Resume uploaded and synchronized with intelligence engine",
      resume,
      parsed: {
        summary: parsedData.summary,
      },
    });
  } catch (error: any) {
    console.error("❌ Resume Upload Error:");
    console.error(error);

    return NextResponse.json(
      {
        error: error.message || "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}