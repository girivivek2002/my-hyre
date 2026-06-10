import { GoogleGenAI } from "@google/genai";

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
  const combinedSkills = [
  ...new Set([
    ...(candidate.skills || []),
    ...(resumeData?.skills || [])
  ])
];

  const apiKey = process.env.GEMINI_API_KEY;

  const ai = new GoogleGenAI({
  apiKey,
    });

  if (!apiKey) {
    return {
      score: fallbackMatchScore(candidate.skills, job.skills),
      summary: "Manual keyword analysis performed due to missing AI credentials.",
      strengths: combinedSkills.slice(0, 5),
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

    console.log(
      "Gemini Key:",
       process.env.GEMINI_API_KEY?.slice(0, 15)
    );

    const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    });

    const text = response.text || "{}";

    const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

const result = JSON.parse(cleaned);
    
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
      score: fallbackMatchScore(combinedSkills, job.skills),
      summary: `Candidate matched ${fallbackMatchScore(
      combinedSkills,
      job.skills
      )}% based on profile and resume analysis.`,      
      strengths: [
      ...combinedSkills.slice(0, 5),
      "Relevant professional background"
      ],
      gaps: [
        "Resume verification required",
        "Technical interview recommended"
       ],
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

function fallbackMatchScore(
  candidateSkills: string[] | undefined | null,
  jobSkills: string[] | undefined | null
): number {

  if (!jobSkills?.length) return 50;
  if (!candidateSkills?.length) return 20;

  const candidate = candidateSkills.map(s =>
    s.toLowerCase().trim()
  );

  const job = jobSkills.map(s =>
    s.toLowerCase().trim()
  );

  let matches = 0;

  for (const skill of job) {
    if (
      candidate.some(
        c =>
          c === skill ||
          c.includes(skill) ||
          skill.includes(c)
      )
    ) {
      matches++;
    }
  }

  return Math.round(
    (matches / job.length) * 100
  );
}
