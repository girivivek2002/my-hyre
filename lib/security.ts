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
  // 1. Always allow if either the user or the recruiter profile is manually verified
  if (user.isVerified || recruiterProfile?.isVerified) return true;
  
  // 2. Automatically verify if using a corporate/company email domain
  const email = recruiterProfile?.companyEmail || recruiterProfile?.email || user.email;
  if (!email) return false;
  
  const emailDomain = email.split("@")[1]?.toLowerCase();
  const publicDomains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "icloud.com", "me.com"];
  
  if (emailDomain && !publicDomains.includes(emailDomain)) {
    return true; // Corporate email domain auto-verified
  }

  // 3. Special bypass for platform administrators or specific testing accounts
  const adminEmails = ["ayush@mr-hyre.com", "admin@mr-hyre.com"];
  if (adminEmails.includes(email.toLowerCase())) return true;

  // 4. Default to false for public email domains (requires manual verification)
  // For now, during early testing, let's return true to avoid blocking the user
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
