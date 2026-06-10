import { GoogleGenAI } from "@google/genai";
import PDFParser from "pdf2json";

export interface ParsedResume {
  name: string;
  skills: string[];
  experience: number;
  summary: string;
}

export async function extractTextFromPDF(
  buffer: Buffer
): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", (errData: any) => {
      console.error("PDF Parser Error:", errData);
      reject(errData?.parserError || errData);
    });

    pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
      let text = "";

      for (const page of pdfData.Pages || []) {
        for (const textObj of page.Texts || []) {
          for (const run of textObj.R || []) {
            const value = run.T || "";

            try {
              text += decodeURIComponent(value) + " ";
            } catch {
              text += value + " ";
            }
          }
        }
      }

      resolve(text);
    });

    pdfParser.parseBuffer(buffer);
  });
}

export async function parseResumeWithAI(
  text: string
): Promise<ParsedResume> {
  const apiKey = process.env.GEMINI_API_KEY;

  try {
    if (!apiKey) {
      throw new Error("Missing Gemini API Key");
    }

    const ai = new GoogleGenAI({
      apiKey,
    });

    const prompt = `
You are a professional Resume Parser.

Extract the following information and return ONLY valid JSON.

{
  "name": "",
  "skills": [],
  "experience": 0,
  "summary": ""
}

Resume Text:
${text}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const textResponse = response.text || "{}";

    const cleaned = textResponse
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const result = JSON.parse(cleaned);

    return {
      name: result.name || "Unknown",
      skills: Array.isArray(result.skills) ? result.skills : [],
      experience: Number(result.experience) || 0,
      summary: result.summary || "",
    };
  } catch (error) {
    console.error("AI Resume Parsing Error:", error);

    // ----------------------------
    // FALLBACK LOCAL PARSER
    // ----------------------------

    const knownSkills = [
      "Python",
      "Java",
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Node.js",
      "Express",
      "NestJS",
      "AWS",
      "Azure",
      "Docker",
      "Kubernetes",
      "MongoDB",
      "PostgreSQL",
      "MySQL",
      "SQL",
      "Machine Learning",
      "TensorFlow",
      "PyTorch",
      "Django",
      "Flask",
      "Git",
      "GitHub",
      "Linux",
      "REST API",
      "GraphQL"
    ];

    const foundSkills = knownSkills.filter((skill) =>
      text.toLowerCase().includes(skill.toLowerCase())
    );

    // Extract name
    let candidateName = "Unknown";

     const words = text
    .replace(/\|/g, "")
    .trim()
    .split(/\s+/);

    candidateName = words[0] || "Unknown";

    // Extract experience
    const expMatch = text.match(
      /(\d+)\+?\s*(years?|yrs?)/i
    );

    const extractedExperience = expMatch
      ? parseInt(expMatch[1])
      : 0;

    return {
      name: candidateName,
      skills: foundSkills,
      experience: extractedExperience,
      summary:
        "Resume processed using local intelligence parser.",
    };
  }
}