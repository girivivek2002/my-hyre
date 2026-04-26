export interface MatchResult {
  score: number;
  summary: string;
  strengths: string[];
  gaps: string[];
}

export async function calculateCandidateMatch(
  candidate: any,
  job: any,
  resumeData?: { skills: string[], experience: number, name: string }
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
      You are an AI-powered Candidate Matching Engine. Analyze the candidate against the job description with extreme precision.
      
      MATCHING LOGIC WEIGHTS (Total 100%):
      1. Technical Skills Match (25%): Direct overlap of required vs possessed skills.
      2. Experience & Seniority (20%): Relevance of years and level of professional history.
      3. Role Alignment (15%): How well the candidate's professional trajectory matches the job title and core responsibilities.
      4. Resume Semantic Relevance & Keyword Consistency (15%): Analyzing the uploaded resume file content for consistency with profile and job requirements.
      5. Geographical & Work Mode (10%): Location proximity and work preference (Remote/Hybrid/Onsite) vs Job requirements.
      6. Financial Alignment (10%): Candidate's salary expectations vs Job salary range.
      7. Availability & Notice Period (5%): How well the candidate's availability matches the hiring timeline.

      JOB DESCRIPTION:
      - Title: ${job.title}
      - Required Skills: ${(job.skills || []).join(", ")}
      - Description: ${job.description}
      - Location: ${job.location || "Not specified"}
      - Work Type: ${job.type || "Not specified"}
      - Salary/Budget: ${job.salary || "Not specified"}

      CANDIDATE PROFILE:
      - Name: ${candidate.name}
      - Professional Role: ${candidate.role}
      - Possessed Skills: ${(candidate.skills || []).join(", ")}
      - Experience: ${candidate.experience}
      - Bio Summary: ${candidate.biography}
      - Current Location: ${candidate.location || "Not specified"}
      - Work Preference: ${candidate.workPreference || "Not specified"}
      - Salary Expectation: ${candidate.salaryExpectation || "Not specified"}
      - Notice Period: ${candidate.noticePeriod || "Not specified"}

      UPLOADED RESUME DATA:
      ${resumeData ? `
      - Parsed Name: ${resumeData.name}
      - Extracted Skills: ${(resumeData.skills || []).join(", ")}
      - Extracted Experience: ${resumeData.experience} years
      ` : "No resume uploaded."}

      OUTPUT FORMAT (STRICT JSON):
      {
        "score": number (0-100),
        "summary": "string (A detailed technical explanation of why this score was given, including a comparison between profile and resume if available)",
        "strengths": ["string (at least 3 key strengths)"],
        "gaps": ["string (at least 2 identified gaps or areas for improvement)"]
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
