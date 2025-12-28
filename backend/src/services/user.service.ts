import { prisma } from "../lib/prisma.js";
import { hashPassword } from "../utils/password.js";

export const listUsers = async (options: { skip?: number; take?: number; role?: string }) => {
  const where: any = {};
  if (options.role) {
    where.role = options.role;
  }

  const [data, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip: options.skip,
      take: options.take,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    data: data.map((user) => ({
      ...user,
      fullName: `${user.firstName} ${user.lastName}`,
    })),
    pagination: {
      total,
      skip: options.skip || 0,
      take: options.take || 10,
    },
  };
};

export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  if (!user) return null;
  return {
    ...user,
    fullName: `${user.firstName} ${user.lastName}`,
  };
};

export const createUser = async (data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
}) => {
  const passwordHash = await hashPassword(data.password);
  
  const user = await prisma.user.create({
    data: {
      email: data.email,
      passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role as any,
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });
  
  return {
    ...user,
    fullName: `${user.firstName} ${user.lastName}`,
  };
};

