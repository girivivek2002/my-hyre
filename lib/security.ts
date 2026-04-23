import { NextResponse } from "next/server";

// Rate limiting state (In-memory, for production use Redis/Upstash)
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

export function checkRateLimit(ip: string, limit = 5, windowMs = 60000) {
  const now = Date.now();
  const userData = rateLimitMap.get(ip) || { count: 0, lastReset: now };

  if (now - userData.lastReset > windowMs) {
    userData.count = 1;
    userData.lastReset = now;
  } else {
    userData.count++;
  }

  rateLimitMap.set(ip, userData);
  return userData.count <= limit;
}

// Disposable email domains to block
const DISPOSABLE_DOMAINS = [
  "mailinator.com", "guerrillamail.com", "10minutemail.com", 
  "temp-mail.org", "yopmail.com", "sharklasers.com"
];

export function isDisposableEmail(email: string) {
  const domain = email.split("@")[1]?.toLowerCase();
  return DISPOSABLE_DOMAINS.includes(domain);
}

// Recruiter Verification Logic
export function canRecruiterPost(user: any, recruiterProfile: any) {
  if (!user.isVerified && !recruiterProfile?.isVerified) {
    // Basic check: Allow if company email is NOT a public domain (simple check)
    const publicDomains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com"];
    const emailDomain = recruiterProfile?.companyEmail?.split("@")[1]?.toLowerCase();
    
    if (publicDomains.includes(emailDomain)) return false;
    
    // In a real app, you might check if the domain matches a whitelist
    return false; // Default to manual approval if not corporate email
  }
  return true;
}

// CAPTCHA Verification (Stub for Google reCAPTCHA)
export async function verifyCaptcha(token: string) {
  if (process.env.NODE_ENV === "development") return true;
  
  const res = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${token}`, {
    method: "POST"
  });
  const data = await res.json();
  return data.success;
}
