import { prisma } from "../lib/prisma.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { generateToken } from "../utils/jwt.js";

export const createUser = async (email: string, password: string, firstName: string, lastName: string, role: string) => {
  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      firstName,
      lastName,
      role: role as any,
    },
  });
  return user;
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    console.error(`User not found: ${email}`);
    throw new Error("Invalid credentials");
  }

  if (!user.isActive) {
    console.error(`User is inactive: ${email}`);
    throw new Error("Account is inactive");
  }

  const isValid = await comparePassword(password, user.passwordHash);
  if (!isValid) {
    console.error(`Invalid password for: ${email}`);
    throw new Error("Invalid credentials");
  }

  const token = generateToken(user.id, user.email, user.role);

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      fullName: `${user.firstName} ${user.lastName}`,
    },
  };
};

export const getUserById = async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
  });
};

