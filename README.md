# My-Hyre – AI-Powered Hiring Platform

## Live Application

Deployed URL: https://my-hyre.vercel.app

## Source Code Repository

GitHub Repository: [Add your GitHub repository URL here]

---

# Architecture Overview

My-Hyre is an AI-powered recruitment platform that connects recruiters and candidates through intelligent resume analysis and candidate matching.

### Candidate Flow

1. Candidate Registration/Login
2. Profile Creation
3. Resume Upload
4. Resume Parsing
5. Skills & Experience Extraction
6. Candidate Dashboard

### Recruiter Flow

1. Recruiter Registration/Login
2. Company Profile Setup
3. Job Creation
4. Job Requirement Analysis
5. Candidate Matching
6. Shortlisting
7. Interview Scheduling

### System Architecture

Candidate → Resume Upload → Resume Parser → Database

Recruiter → Job Creation → Job Parser → Database

Resume Data + Job Data → Matching Engine → Candidate Ranking

---

# Technology Stack

## Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React

## Backend

- Next.js API Routes
- Prisma ORM
- PostgreSQL

## Authentication

- NextAuth
- JWT Authentication

## AI & Parsing

- Google Gemini API
- PDF2JSON
- Local Fallback Parsing Engine

## Deployment

- Vercel

---

# AI Implementation Details

## Resume Parsing

Uploaded PDF resumes are processed using PDF2JSON.

The extracted text is sent to Gemini AI for structured analysis.

Extracted fields include:

- Candidate Name
- Skills
- Experience
- Summary

If Gemini is unavailable or quota limits are reached, a local fallback parser extracts information using keyword analysis.

---

## Job Description Parsing

Recruiters can enter job requirements.

Gemini AI analyzes the job description and extracts:

- Job Title
- Required Skills
- Experience Requirements
- Workplace Preferences

---

## Candidate Matching Engine

Candidate matching uses:

- Candidate Profile Skills
- Resume Skills
- Job Requirements
- Experience Matching

### Matching Process

1. Combine candidate profile skills and resume skills
2. Compare with job requirements
3. Calculate match percentage
4. Rank candidates

### Fallback Matching

If AI services are unavailable, a rule-based matching engine calculates scores using keyword overlap and skill similarity.

---

# Database Design

## User

Stores authentication and role information.

Fields:

- id
- name
- email
- password
- role
- isVerified

---

## Candidate

Stores candidate profile information.

Fields:

- skills
- biography
- location
- experience
- salary expectations

---

## Recruiter

Stores recruiter and company information.

Fields:

- companyName
- industry
- companySize
- website
- location

---

## Resume

Stores parsed resume intelligence.

Fields:

- name
- skills
- experience

---

## Job

Stores job postings.

Fields:

- title
- description
- skills
- location
- salary
- experience

---

## Shortlist

Stores recruiter-candidate selections.

Fields:

- candidateId
- jobId
- status

---

## Interview

Stores interview schedules.

Fields:

- date
- time
- platform
- interviewer details

---

## Message

Stores recruiter-candidate communications.

Fields:

- content
- senderType

---

# Setup Instructions

## Clone Repository

```bash
git clone <repository-url>
cd my-hyre
```

## Install Dependencies

```bash
npm install
```

## Create Environment File

Create a `.env` file and add:

```env
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
JWT_SECRET=
GEMINI_API_KEY=
```

Optional OAuth configuration:

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=
```

## Run Development Server

```bash
npm run dev
```

Application will run on:

```txt
http://localhost:3000
```

## Production Build

```bash
npm run build
npm start
```

---

# Assumptions

- Each candidate maintains one active resume profile.
- Recruiters manage their own jobs.
- Resume parsing accuracy depends on resume structure and PDF quality.
- Candidate matching is primarily skill and experience based.
- AI services may be unavailable due to quota limitations, therefore fallback logic is implemented.

---

# Future Improvements

## AI Enhancements

- Advanced semantic candidate matching
- Interview question generation
- Resume scoring and feedback
- Skill gap analysis

## Platform Features

- Real-time notifications
- Email interview reminders
- In-app messaging system
- Resume version management
- Candidate analytics dashboard
- Recruiter analytics dashboard

## Infrastructure

- File storage using AWS S3
- Background job processing
- Redis caching
- CI/CD pipelines
- Automated testing

---

# Key Features

- Candidate Registration & Authentication
- Recruiter Registration & Authentication
- Resume Upload & Parsing
- AI-Powered Job Analysis
- Candidate Matching Engine
- Recruiter Dashboard
- Candidate Dashboard
- Shortlisting Workflow
- Interview Management
- Secure Authentication
- Production Deployment

---

Developed as part of the Mr-Hyre AI Hiring Platform Assignment.
