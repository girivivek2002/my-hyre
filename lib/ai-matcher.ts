export interface MatchResult {
  score: number;
  summary: string;
  strengths: string[];
  gaps: string[];
  scoreBreakdown: {
    technicalSkills: number;
    experience: number;
    roleAlignment: number;
    resumeRelevance: number;
    locationWorkMode: number;
    financialAlignment: number;
    availability: number;
  };
  interviewQuestions: string[];
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
      gaps: ["Advanced AI analysis unavailable"],
      scoreBreakdown: {
        technicalSkills: 0,
        experience: 0,
        roleAlignment: 0,
        resumeRelevance: 0,
        locationWorkMode: 0,
        financialAlignment: 0,
        availability: 0
      },
      interviewQuestions: ["Tell me about your relevant experience."]
    };
  }

  try {
    const prompt = `
      You are an Expert Executive Recruiter and AI Hiring Consultant. Your task is to provide a world-class, multi-dimensional analysis of a candidate's fit for a specific role.
      
      MATCHING CRITERIA & WEIGHTS:
      1. Technical Skills Match (25%): Direct overlap + ADJACENT/TRANSFERABLE skills (e.g., React vs Vue, AWS vs Azure).
      2. Experience & Seniority (20%): Relevance of years, industry depth (e.g., FinTech, SaaS), and career growth.
      3. Role Alignment (15%): Consistency between candidate's trajectory and the role's seniority/direction.
      4. Resume Semantic Intelligence (15%): Depth and quality of project descriptions in the parsed resume vs profile claims.
      5. Geography & Work Mode (10%): Location proximity and preference (Remote/Onsite) alignment.
      6. Financial & Budgetary Fit (10%): Salary expectations vs range.
      7. Logistics & Availability (5%): Notice period and start date alignment.

      DOMAIN ANALYSIS:
      - Look for domain-specific intelligence (e.g., does a developer have experience in the specific sector of the job?).
      - Identify "implied" skills from the Bio and Experience summaries.

      JOB CONTEXT:
      - Title: ${job.title}
      - Core Requirements: ${(job.skills || []).join(", ")}
      - Detailed Description: ${job.description}
      - Environment: ${job.location || "Not specified"} | ${job.type || "Not specified"} | ${job.salary || "Not specified"}

      CANDIDATE DOSSIER:
      - Name: ${candidate.name}
      - Professional Title: ${candidate.role}
      - Declared Skills: ${(candidate.skills || []).join(", ")}
      - Experience: ${candidate.experience} years
      - Profile Bio: ${candidate.biography}
      - Expectations: ${candidate.location || "Not specified"} | ${candidate.workPreference || "Not specified"} | ${candidate.salaryExpectation || "Not specified"} | ${candidate.noticePeriod || "Not specified"}

      RESUME INTELLIGENCE:
      ${resumeData ? `
      - Parsed Name: ${resumeData.name}
      - Extracted Keywords: ${(resumeData.skills || []).join(", ")}
      - Extracted Tenure: ${resumeData.experience} years
      ` : "No deeper resume data available."}

      OUTPUT SPECIFICATION (VALID JSON ONLY):
      {
        "score": number (Final weighted score 0-100),
        "summary": "string (A high-level professional evaluation summarizing the overall fit)",
        "strengths": ["string (High-impact professional strengths)"],
        "gaps": ["string (Critical gaps or areas requiring clarification)"],
        "scoreBreakdown": {
          "technicalSkills": number (0-25),
          "experience": number (0-20),
          "roleAlignment": number (0-15),
          "resumeRelevance": number (0-15),
          "locationWorkMode": number (0-10),
          "financialAlignment": number (0-10),
          "availability": number (0-5)
        },
        "interviewQuestions": ["string (3-5 targeted interview questions to validate gaps or deeper skills)"]
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
      gaps: result.gaps || [],
      scoreBreakdown: result.scoreBreakdown || {
        technicalSkills: 0,
        experience: 0,
        roleAlignment: 0,
        resumeRelevance: 0,
        locationWorkMode: 0,
        financialAlignment: 0,
        availability: 0
      },
      interviewQuestions: result.interviewQuestions || []
    };

  } catch (error) {
    console.error("AI Matching Error:", error);
    return {
      score: fallbackMatchScore(candidate.skills, job.skills),
      summary: "Intelligence engine encountered a processing error. Falling back to keyword matching.",
      strengths: ["Historical data consistency"],
      gaps: ["Full semantic analysis failed"],
      scoreBreakdown: {
        technicalSkills: 0,
        experience: 0,
        roleAlignment: 0,
        resumeRelevance: 0,
        locationWorkMode: 0,
        financialAlignment: 0,
        availability: 0
      },
      interviewQuestions: ["Tell me about your relevant experience."]
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
