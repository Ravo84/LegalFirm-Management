import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        passwordHash: false,
      },
    });

    console.log("\n=== Users in Database ===");
    console.log(`Total users: ${users.length}\n`);

    if (users.length === 0) {
      console.log("❌ NO USERS FOUND! Run: npm run seed");
    } else {
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.email}`);
        console.log(`   Name: ${user.firstName} ${user.lastName}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Active: ${user.isActive}`);
        console.log();
      });
    }

    // Check specifically for our test users
    const admin = await prisma.user.findUnique({
      where: { email: "admin@legal.com" },
    });

    const employee = await prisma.user.findUnique({
      where: { email: "employee@legal.com" },
    });

    console.log("\n=== Test User Check ===");
    console.log(`Admin exists: ${admin ? "✓ YES" : "✗ NO"}`);
    console.log(`Employee exists: ${employee ? "✓ YES" : "✗ NO"}`);

    if (admin) {
      console.log(`Admin isActive: ${admin.isActive}`);
    }
    if (employee) {
      console.log(`Employee isActive: ${employee.isActive}`);
    }
  } catch (error) {
    console.error("Error checking users:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();






