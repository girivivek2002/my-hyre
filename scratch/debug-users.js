const { PrismaClient } = require('../src/generated/client');
const prisma = new PrismaClient();

async function checkUsers() {
  try {
    const users = await prisma.user.findMany();
    console.log("Users in DB:");
    users.forEach(u => {
      console.log(`- ID: ${u.id}, Email: ${u.email}, Role: ${u.role}, Name: ${u.name}`);
    });

    const recruiters = await prisma.recruiter.findMany();
    console.log("\nRecruiters in DB:");
    recruiters.forEach(r => {
      console.log(`- ID: ${r.id}, UserID: ${r.userId}, Email: ${r.email}, Name: ${r.name}`);
    });
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();
