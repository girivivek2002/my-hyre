import { PDFParse } from "pdf-parse";

export interface ParsedResume {
  name: string;
  skills: string[];
  experience: number;
  summary: string;
}

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    return result.text;
  } catch (error) {
    console.error("PDF Extraction Error:", error);
    throw new Error("Failed to extract text from PDF");
  }
}

export async function parseResumeWithAI(text: string): Promise<ParsedResume> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("Missing OpenAI API Key");

  const prompt = `
    You are a professional Resume Parser. Extract the following information from the provided resume text and return it in STRICT JSON format.
    
    REQUIRED FIELDS:
    1. name: The full name of the candidate.
    2. skills: An array of technical and professional skills found in the resume.
    3. experience: The total years of professional experience as a numeric value.
    4. summary: A 2-3 sentence professional summary of the candidate's background.

    RESUME TEXT:
    ${text}

    RETURN ONLY VALID JSON:
  `;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.1,
      }),
    });

    if (!res.ok) throw new Error("OpenAI API Error during resume parsing");

    const data = await res.json();
    const result = JSON.parse(data.choices[0].message.content);

    return {
      name: result.name || "Unknown",
      skills: result.skills || [],
      experience: Number(result.experience) || 0,
      summary: result.summary || ""
    };
  } catch (error) {
    console.error("AI Resume Parsing Error:", error);
    throw error;
  }
}
