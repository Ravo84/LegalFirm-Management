import { prisma } from "../lib/prisma.js";

export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  dueDate?: Date;
  caseId: string;
  assignedToId?: string;
  creatorId: string;
}

export interface UpdateTaskInput extends Partial<CreateTaskInput> {}

export const createTask = async (data: CreateTaskInput) => {
  return prisma.caseTask.create({
    data,
    include: {
      assignedTo: true,
      createdBy: true,
      case: true,
    },
  });
};

export const listTasks = async (options: {
  caseId?: string;
  assignedToId?: string;
  status?: string;
  skip?: number;
  take?: number;
}) => {
  const where: any = {};

  if (options.caseId) {
    where.caseId = options.caseId;
  }

  if (options.assignedToId) {
    where.assignedToId = options.assignedToId;
  }

  if (options.status) {
    where.status = options.status;
  }

  const [data, total] = await Promise.all([
    prisma.caseTask.findMany({
      where,
      skip: options.skip,
      take: options.take,
      include: {
        assignedTo: true,
        createdBy: true,
        case: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.caseTask.count({ where }),
  ]);

  return {
    data,
    pagination: {
      total,
      skip: options.skip || 0,
      take: options.take || 10,
    },
  };
};

export const getTask = async (id: string) => {
  return prisma.caseTask.findUnique({
    where: { id },
    include: {
      assignedTo: true,
      createdBy: true,
      case: true,
    },
  });
};

export const updateTask = async (id: string, data: UpdateTaskInput) => {
  return prisma.caseTask.update({
    where: { id },
    data,
    include: {
      assignedTo: true,
      createdBy: true,
      case: true,
    },
  });
};

export const deleteTask = async (id: string) => {
  return prisma.caseTask.delete({
    where: { id },
  });
};

