export async function calculateCandidateMatch(
  candidate: { skills: string[] | undefined | null, biography: string | null, experience: string | null },
  job: { title: string, skills: string[] | undefined | null, description: string | null }
): Promise<number> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    // Graceful fallback to keyword overlap if no API key is present
    return fallbackMatchScore(candidate.skills, job.skills);
  }

  try {
    const prompt = `
      You are an expert technical recruiter AI.
      Given the candidate's profile and the job description, calculate a "Fit Score" from 0 to 100.
      Respond with ONLY the integer representing the score. Do not provide any explanation or extra text.

      Candidate Profile:
      - Experience: ${candidate.experience || "Not specified"}
      - Skills: ${(candidate.skills || []).join(", ")}
      - Biography: ${candidate.biography || "Not specified"}

      Job Requirements:
      - Title: ${job.title}
      - Required Skills: ${(job.skills || []).join(", ")}
      - Description: ${job.description || "Not specified"}
    `;

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // Using mini variant for rapid evaluation
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1,
        max_tokens: 5,
      }),
    });

    if (!res.ok) {
      throw new Error(`OpenAI API error: ${res.statusText}`);
    }

    const data = await res.json();
    const scoreText = data.choices[0].message.content.trim();
    
    // Parse the score, fallback to overlap if AI returns unexpected format
    const score = parseInt(scoreText.replace(/\D/g, ''), 10);
    if (!isNaN(score) && score >= 0 && score <= 100) {
      return score;
    }
    
    return fallbackMatchScore(candidate.skills, job.skills);

  } catch (error) {
    console.error("AI Matching Error:", error);
    return fallbackMatchScore(candidate.skills, job.skills);
  }
}

// Fallback logic if OpenAI fails or key is missing
function fallbackMatchScore(candidateSkills: string[] | undefined | null, jobSkills: string[] | undefined | null): number {
  if (!jobSkills || jobSkills.length === 0) return 70; // Baseline match
  if (!candidateSkills || candidateSkills.length === 0) return 45; // No skills = minimum score
  
  const cSkillsLower = candidateSkills.map(s => s.toLowerCase().trim());
  const jSkillsLower = jobSkills.map(s => s.toLowerCase().trim());

  let matches = 0;
  for (const skill of jSkillsLower) {
    if (cSkillsLower.some(c => c.includes(skill) || skill.includes(c))) {
      matches++;
    }
  }

  const overlapScore = Math.round((matches / jobSkills.length) * 100);
  
  // Baseline bump so it doesn't look totally broken if they just typed the wrong aliases
  return Math.min(Math.max(overlapScore + 20, 45), 100);
}
