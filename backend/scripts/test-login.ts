import { PrismaClient } from "@prisma/client";
import { comparePassword } from "../src/utils/password.js";

const prisma = new PrismaClient();

async function testLogin() {
  try {
    const email = "admin@legal.com";
    const password = "password123";

    console.log(`\n=== Testing Login for: ${email} ===\n`);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log("❌ User not found!");
      return;
    }

    console.log(`✓ User found: ${user.email}`);
    console.log(`✓ User isActive: ${user.isActive}`);
    console.log(`✓ Password hash exists: ${user.passwordHash ? "YES" : "NO"}`);

    console.log("\nTesting password comparison...");
    const isValid = await comparePassword(password, user.passwordHash);
    
    if (isValid) {
      console.log("✅ Password is CORRECT!");
    } else {
      console.log("❌ Password is INCORRECT!");
      console.log("\nTrying to recreate user with correct password...");
      
      // Recreate password hash
      const { hashPassword } = await import("../src/utils/password.js");
      const newHash = await hashPassword(password);
      
      await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash: newHash },
      });
      
      console.log("✓ Password hash updated. Try logging in again!");
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testLogin();






