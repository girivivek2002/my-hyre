import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Parse resume text using AI to extract structured data.
 * @param {string} text - Raw text extracted from a PDF resume.
 * @returns {Promise<{name: string, skills: string[], experience: number}>}
 */
export async function parseResumeWithAI(text) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a resume parser. Extract structured data from the resume text. Return ONLY valid JSON, no markdown, no explanation.",
      },
      {
        role: "user",
        content: `Extract the following from this resume text and return as JSON:
{
  "name": "Full name of the candidate",
  "skills": ["Array of technical and professional skills"],
  "experience": "Total years of experience as a number"
}

Resume text:
${text}`,
      },
    ],
    temperature: 0.1,
  });

  const content = response.choices[0].message.content.trim();

  // Strip markdown code fences if present
  const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "");

  const parsed = JSON.parse(cleaned);

  // Validate structure
  if (!parsed.name || !Array.isArray(parsed.skills) || typeof parsed.experience !== "number") {
    throw new Error("AI returned invalid resume structure");
  }

  return parsed;
}

/**
 * Parse job description text using AI to extract structured data.
 * @param {string} text - Raw job description text.
 * @returns {Promise<{title: string, skills: string[], experience: number}>}
 */
export async function parseJobWithAI(text) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a job description parser. Extract structured data from job descriptions. Return ONLY valid JSON.",
      },
      {
        role: "user",
        content: `Extract the following from this job description and return as JSON:
{
  "title": "Job title",
  "skills": ["Array of required skills"],
  "experience": "Minimum years of experience required as a number"
}

Job description:
${text}`,
      },
    ],
    temperature: 0.1,
  });

  const content = response.choices[0].message.content.trim();
  const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "");
  const parsed = JSON.parse(cleaned);

  if (!parsed.title || !Array.isArray(parsed.skills) || typeof parsed.experience !== "number") {
    throw new Error("AI returned invalid job structure");
  }

  return parsed;
}
