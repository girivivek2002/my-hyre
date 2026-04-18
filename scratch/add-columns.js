const { PrismaClient } = require('../src/generated/client');
const pg = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function addColumns() {
  try {
    console.log("Adding columns via raw SQL...");
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "Candidate" 
      ADD COLUMN IF NOT EXISTS "phone" TEXT,
      ADD COLUMN IF NOT EXISTS "linkedin" TEXT,
      ADD COLUMN IF NOT EXISTS "github" TEXT,
      ADD COLUMN IF NOT EXISTS "website" TEXT;
    `);
    console.log("Columns added successfully!");
  } catch (err) {
    console.error("SQL Error:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

addColumns();
