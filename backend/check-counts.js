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
  const shortlists = await prisma.shortlist.count();
  const jobs = await prisma.job.count();
  const recruiters = await prisma.recruiter.count();
  const candidates = await prisma.candidate.count();
  const interviews = await prisma.interview.count();
  const users = await prisma.user.count({ where: { role: 'candidate' } });
  const recruitersList = await prisma.recruiter.findMany({
    include: { _count: { select: { jobs: true } } }
  });
  console.log(JSON.stringify({ shortlists, jobs, recruiters, candidates, interviews, users, recruitersList }, null, 2));
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
