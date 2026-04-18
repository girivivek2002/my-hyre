const { PrismaClient } = require('../src/generated/client');
const pg = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function checkFields() {
  try {
    const candidate = await prisma.candidate.findFirst();
    console.log("Candidate sample:", candidate);
    if (candidate) {
        console.log("Fields found:", Object.keys(candidate));
    }
  } catch (err) {
    console.error("Error checking fields:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkFields();
