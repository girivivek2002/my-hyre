const { PrismaClient } = require('../src/generated/client');
const pg = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function testApi() {
  try {
    // Simulate what the API does for Talent Pool
    const candidates = await prisma.user.findMany({
      where: { role: "candidate" },
      include: {
        candidateProfile: true,
      }
    });
    console.log(`Found ${candidates.length} candidates in Talent Pool.`);
    candidates.forEach(c => {
      console.log(`- ${c.name} (${c.email}), Profile: ${c.candidateProfile ? 'Exists' : 'Missing'}`);
    });
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

testApi();
