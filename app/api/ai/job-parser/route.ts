import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  if (!prompt) {
    return NextResponse.json(
      { error: "Prompt is required" },
      { status: 400 }
    );
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
You are an expert technical recruiter.

Analyze the hiring requirement below and return ONLY valid JSON.

{
  "job_title": "",
  "skills": [],
  "experience": "",
  "location": "",
  "salary": "",
  "workplace_type": "",
  "description": ""
}

Requirement:
${prompt}
`,
    });

    const text = response.text || "{}";

    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    

    return NextResponse.json(parsed);

  } catch (error) {
    console.error("Gemini Parser Error:", error);
    console.log("⚠️ Using Local Fallback Job Parser");

    const knownSkills = [
      "Python",
      "Java",
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Node.js",
      "Express",
      "AWS",
      "Docker",
      "Kubernetes",
      "MongoDB",
      "PostgreSQL",
      "MySQL",
      "SQL",
      "Machine Learning",
      "TensorFlow",
      "Django",
      "Flask",
      "Git",
    ];

    const skills = knownSkills.filter((skill) =>
      prompt.toLowerCase().includes(skill.toLowerCase())
    );

    let jobTitle = "Software Developer";

    if (prompt.toLowerCase().includes("python")) {
      jobTitle = "Python Developer";
    } else if (prompt.toLowerCase().includes("react")) {
      jobTitle = "React Developer";
    } else if (prompt.toLowerCase().includes("node")) {
      jobTitle = "Node.js Developer";
    } else if (prompt.toLowerCase().includes("full stack")) {
      jobTitle = "Full Stack Developer";
    }

    const expMatch = prompt.match(
      /(\d+)\+?\s*(years?|yrs?)/i
    );

    return NextResponse.json({
      job_title: jobTitle,
      skills,
      experience: expMatch ? expMatch[1] + " years" : "Any",
      location: "",
      salary: "",
      workplace_type: "Remote",
      description: prompt,
    });
  }
}