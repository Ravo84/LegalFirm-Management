import { prisma } from "../lib/prisma.js";

export interface CreateCaseInput {
  caseNumber: string;
  title: string;
  description?: string;
  clientName: string;
  status?: string;
  priority?: string;
  startDate?: Date;
  dueDate?: Date;
}

export interface UpdateCaseInput extends Partial<CreateCaseInput> {}

export const createCase = async (data: CreateCaseInput, managerId?: string) => {
  return prisma.case.create({
    data: {
      ...data,
      managerId,
    },
    include: {
      manager: true,
      assignments: {
        include: {
          user: true,
        },
      },
      documents: true,
      tasks: {
        include: {
          assignedTo: true,
        },
      },
    },
  });
};

export const listCases = async (options: {
  status?: string;
  managerId?: string;
  userId?: string;
  search?: string;
  skip?: number;
  take?: number;
}) => {
  const where: any = {};

  if (options.status) {
    where.status = options.status;
  }

  if (options.managerId) {
    where.managerId = options.managerId;
  }

  if (options.userId) {
    where.assignments = {
      some: {
        userId: options.userId,
      },
    };
  }

  if (options.search) {
    where.OR = [
      { title: { contains: options.search } },
      { caseNumber: { contains: options.search } },
      { clientName: { contains: options.search } },
    ];
  }

  const [data, total] = await Promise.all([
    prisma.case.findMany({
      where,
      skip: options.skip,
      take: options.take,
      include: {
        manager: true,
        assignments: {
          include: {
            user: true,
          },
        },
        documents: true,
        tasks: {
          include: {
            assignedTo: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.case.count({ where }),
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

export const getCase = async (id: string) => {
  return prisma.case.findUnique({
    where: { id },
    include: {
      manager: true,
      assignments: {
        include: {
          user: true,
        },
      },
      documents: {
        include: {
          uploadedBy: true,
        },
        orderBy: {
          uploadedAt: "desc",
        },
      },
      tasks: {
        include: {
          assignedTo: true,
          createdBy: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
};

export const updateCase = async (id: string, data: UpdateCaseInput) => {
  return prisma.case.update({
    where: { id },
    data,
    include: {
      manager: true,
      assignments: {
        include: {
          user: true,
        },
      },
      documents: true,
      tasks: true,
    },
  });
};

export const deleteCase = async (id: string) => {
  return prisma.case.delete({
    where: { id },
  });
};

export const assignCaseToUser = async (caseId: string, userId: string) => {
  return prisma.caseAssignment.create({
    data: {
      caseId,
      userId,
    },
    include: {
      user: true,
    },
  });
};

export const removeCaseAssignment = async (caseId: string, userId: string) => {
  return prisma.caseAssignment.deleteMany({
    where: {
      caseId,
      userId,
    },
  });
};

