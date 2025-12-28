import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seed...");

  // Create admin user
  const adminPassword = await bcrypt.hash("password123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@legal.com" },
    update: {
      passwordHash: adminPassword,
      isActive: true,
    },
    create: {
      email: "admin@legal.com",
      passwordHash: adminPassword,
      firstName: "Admin",
      lastName: "User",
      role: "ADMIN",
      isActive: true,
    },
  });

  console.log("✓ Admin user created:", admin.email);

  // Create employee user
  const employeePassword = await bcrypt.hash("password123", 10);
  const employee = await prisma.user.upsert({
    where: { email: "employee@legal.com" },
    update: {
      passwordHash: employeePassword,
      isActive: true,
    },
    create: {
      email: "employee@legal.com",
      passwordHash: employeePassword,
      firstName: "John",
      lastName: "Doe",
      role: "EMPLOYEE",
      isActive: true,
    },
  });

  console.log("✓ Employee user created:", employee.email);
  console.log("\n✅ Database seeded successfully!");
  console.log("\nLogin credentials:");
  console.log("Admin: admin@legal.com / password123");
  console.log("Employee: employee@legal.com / password123");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });



