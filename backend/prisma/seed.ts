import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash("password123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@legal.com" },
    update: {},
    create: {
      email: "admin@legal.com",
      passwordHash: adminPassword,
      firstName: "Admin",
      lastName: "User",
      role: "ADMIN",
    },
  });

  // Create employee user
  const employeePassword = await bcrypt.hash("password123", 10);
  const employee = await prisma.user.upsert({
    where: { email: "employee@legal.com" },
    update: {},
    create: {
      email: "employee@legal.com",
      passwordHash: employeePassword,
      firstName: "John",
      lastName: "Doe",
      role: "EMPLOYEE",
    },
  });

  console.log("Seeded users:", { admin, employee });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

