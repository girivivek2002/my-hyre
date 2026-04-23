export interface MatchResult {
  score: number;
  summary: string;
  strengths: string[];
  gaps: string[];
}

export async function calculateCandidateMatch(
  candidate: any,
  job: any
): Promise<MatchResult> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return {
      score: fallbackMatchScore(candidate.skills, job.skills),
      summary: "Manual keyword analysis performed due to missing AI credentials.",
      strengths: ["Keyword overlap detected"],
      gaps: ["Advanced AI analysis unavailable"]
    };
  }

  try {
    const prompt = `
      You are an AI-powered Candidate Matching Engine. Analyze the candidate against the job description.
      
      MATCHING LOGIC WEIGHTS:
      1. Skills Match (40%)
      2. Experience Match (20%)
      3. Location & Work Type Match (10%)
      4. Salary Alignment (10%)
      5. Profile Strength (10%)
      6. Resume Semantic Relevance (10%)

      JOB DESCRIPTION:
      - Title: ${job.title}
      - Required Skills: ${(job.skills || []).join(", ")}
      - Description: ${job.description}
      - Location: ${job.location || "Not specified"}
      - Work Type: ${job.type || "Not specified"}
      - Salary: ${job.salary || "Not specified"}

      CANDIDATE PROFILE:
      - Name: ${candidate.name}
      - Role: ${candidate.role}
      - Skills: ${(candidate.skills || []).join(", ")}
      - Experience: ${candidate.experience}
      - Bio: ${candidate.biography}
      - Location: ${candidate.location || "Not specified"}
      - Salary Expectation: ${candidate.salaryExpectation || "Not specified"}

      OUTPUT FORMAT (STRICT JSON):
      {
        "score": number (0-100),
        "summary": "string",
        "strengths": ["string"],
        "gaps": ["string"]
      }
    `;

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

    if (!res.ok) throw new Error("AI API Error");

    const data = await res.json();
    const result = JSON.parse(data.choices[0].message.content);
    
    return {
      score: result.score || 0,
      summary: result.summary || "No summary provided.",
      strengths: result.strengths || [],
      gaps: result.gaps || []
    };

  } catch (error) {
    console.error("AI Matching Error:", error);
    return {
      score: fallbackMatchScore(candidate.skills, job.skills),
      summary: "Intelligence engine encountered a processing error. Falling back to keyword matching.",
      strengths: ["Historical data consistency"],
      gaps: ["Full semantic analysis failed"]
    };
  }
}

function fallbackMatchScore(candidateSkills: string[] | undefined | null, jobSkills: string[] | undefined | null): number {
  if (!jobSkills || jobSkills.length === 0) return 70;
  if (!candidateSkills || candidateSkills.length === 0) return 45;
  const cSkillsLower = candidateSkills.map(s => s.toLowerCase().trim());
  const jSkillsLower = jobSkills.map(s => s.toLowerCase().trim());
  let matches = 0;
  for (const skill of jSkillsLower) {
    if (cSkillsLower.some(c => c.includes(skill) || skill.includes(c))) matches++;
  }
  return Math.min(Math.max(Math.round((matches / jobSkills.length) * 100) + 20, 45), 100);
}
