const { PrismaClient } = require('../src/generated/client');
const pg = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not defined");
  process.exit(1);
}

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function run() {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, role: true, name: true }
    });
    console.log("USERS:");
    console.table(users);

    const recruiters = await prisma.recruiter.findMany({
      select: { id: true, userId: true, companyName: true }
    });
    console.log("\nRECRUITERS:");
    console.table(recruiters);

  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

run();
