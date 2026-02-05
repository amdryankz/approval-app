import { prisma } from "..";
import { Employee, Request as PrismaRequest, RequestType, RequestStatus, Prisma } from "../../prisma/generated/client";
import { ApproveRequestInput, CreateRequestInput } from "../types/request";
import { BadRequestError, NotFoundError } from "../utils/customError";

export default class Service {
  static async getAllEmployees(): Promise<Employee[]> {
    return await prisma.employee.findMany();
  }

  static async getRequestEmployee(employeeId: string): Promise<{}> {
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
    });

    if (!employee) {
      throw new NotFoundError(`Employee with id ${employeeId} not found`);
    }

    const [requests, approver] = await Promise.all([
      prisma.request.findMany({
        where: {
          submittedBy: employeeId
        },
        orderBy: {
          submittedAt: 'desc',
        },
      }),
      prisma.request.findMany({
        where: {
          submitter: {
            managerId: employeeId
          }
        },
        include: {
          submitter: true
        },
        orderBy: {
          submittedAt: 'desc',
        },
      })
    ])

    return { requests, approver };
  }

  static async getRequestById(id: string): Promise<PrismaRequest> {
    const employee = await prisma.request.findUnique({
      where: {
        id
      },
      include: {
        approver: true,
        submitter: true
      }
    });

    if (!employee) {
      throw new NotFoundError(`Requests with id ${id} not found`);
    }

    return employee
  }

  static async createRequest(data: CreateRequestInput): Promise<PrismaRequest> {
    const employee = await prisma.employee.findUnique({
      where: {
        id: data.submittedBy
      },
    });

    if (!employee) {
      throw new NotFoundError(`Employee with id ${data.submittedBy} not found`);
    }

    const validTypes: RequestType[] = ['purchase', 'leave', 'overtime'];
    if (!validTypes.includes(data.type)) {
      throw new BadRequestError(`Invalid request type. Must be one of: ${validTypes.join(', ')}`);
    }

    const requestCount = await prisma.request.count();
    const requestId = `req-${String(requestCount + 1).padStart(3, '0')}`;

    return await prisma.request.create({
      data: {
        id: requestId,
        type: data.type,
        submittedBy: data.submittedBy,
        submittedAt: new Date(),
        status: RequestStatus.pending,
        details: data.details as any,
        notes: data.notes || null,
      },
    });
  }

  static async approveRequest(id: string, data: ApproveRequestInput): Promise<PrismaRequest> {
    const request = await prisma.request.findUnique({
      where: {
        id
      },
      include: {
        submitter: true
      }
    })

    if (!request) {
      throw new NotFoundError(`Request with id ${id} not found`);
    }

    if (request.submitter.managerId !== data.approvedBy) {
      throw new BadRequestError('Only manager this employee can approve request')
    }

    return await prisma.request.update({
      where: {
        id: request.id
      },
      data: {
        status: data.status,
        approvedBy: data.approvedBy,
        approvedAt: new Date()
      }
    })
  }

  static async deleteRequest(id: string): Promise<PrismaRequest> {
    const request = await prisma.request.findUnique({
      where: {
        id
      }
    })

    if (!request) {
      throw new NotFoundError(`Request with id ${id} not found`);
    }

    if (request.status !== 'pending') {
      throw new BadRequestError('Only status pending can deleted')
    }

    return await prisma.request.delete({
      where: {
        id
      }
    })
  }
}

