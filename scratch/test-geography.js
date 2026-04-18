import { PrismaClient } from '../src/generated/client/index.js';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const recruiters = await prisma.recruiter.findMany({ select: { id: true, name: true } });
  if (recruiters.length === 0) {
    console.log("No recruiters found");
    process.exit(0);
  }

  const recruiter = recruiters[0];
  const jobs = await prisma.job.findMany({ where: { recruiterId: recruiter.id }, select: { id: true } });
  const jobIds = jobs.map(j => j.id);

  const geographyRaw = await prisma.shortlist.findMany({
    where: { jobId: { in: jobIds } },
    include: { candidate: { select: { location: true } } },
  });

  const locationCounts = {};
  geographyRaw.forEach(s => {
    const loc = s.candidate?.location || "Unknown";
    locationCounts[loc] = (locationCounts[loc] || 0) + 1;
  });

  const geography = Object.entries(locationCounts)
    .map(([region, count]) => ({
      region,
      count,
      pct: geographyRaw.length > 0 ? Math.round((count / geographyRaw.length) * 100) : 0
    }))
    .sort((a, b) => b.count - a.count);

  console.log("Recruiter:", recruiter.name);
  console.log("Job IDs:", jobIds);
  console.log("Shortlists found:", geographyRaw.length);
  console.log("Geography Aggregation:", JSON.stringify(geography, null, 2));
  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
