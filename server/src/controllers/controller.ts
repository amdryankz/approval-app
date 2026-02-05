import Service from "../services/service";
import { Request, Response, NextFunction } from "express";
import { ApproveRequestInput, CreateRequestInput } from "../types/request";
import { BadRequestError } from "../utils/customError";
import errorHandler from "../utils/errorHandler";

export default class Controller {
  static async getAllEmployees(req: Request, res: Response): Promise<void> {
    try {
      const employees = await Service.getAllEmployees();

      res.status(200).json({
        message: "Success fetch employees",
        data: employees,
      });
    } catch (err) {
      const { message, status } = errorHandler(err)
      res.status(status).json({
        message
      });
    }
  }

  static async getRequestEmployee(req: Request, res: Response): Promise<void> {
    try {
      const employeeId = req.query.employeeId as string;

      if (!employeeId) {
        throw new BadRequestError('employeeId is required')
      }

      const request = await Service.getRequestEmployee(employeeId);

      res.status(200).json({
        message: "Success fetch request",
        data: request,
      });
    } catch (err: any) {
      const { message, status } = errorHandler(err)
      res.status(status).json({
        message
      });
    }
  }

  static async createRequest(req: Request, res: Response): Promise<void> {
    try {
      const { type, submittedBy, details, notes } = req.body;

      if (!type || !submittedBy || !details) {
        throw new BadRequestError("type, submittedBy, and details are required");
      }

      const requestData: CreateRequestInput = {
        type,
        submittedBy,
        details,
        notes,
      };

      const request = await Service.createRequest(requestData);

      res.status(201).json({
        message: "Request created successfully",
        data: request,
      });
    } catch (err: any) {
      const { message, status } = errorHandler(err)
      res.status(status).json({
        message
      });
    }
  }

  static async approveRequest(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string
      const { status, approvedBy } = req.body;

      if (!status || !approvedBy) {
        throw new BadRequestError("status and approvedBy are required");
      }

      const requestData: ApproveRequestInput = {
        status,
        approvedBy,
      };

      const request = await Service.approveRequest(id, requestData);

      res.status(201).json({
        message: "Request approved successfully",
        data: request,
      });
    } catch (err: any) {
      const { message, status } = errorHandler(err)
      res.status(status).json({
        message
      });
    }
  }

  static async deleteRequest(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string

      const request = await Service.deleteRequest(id);

      res.status(201).json({
        message: "Request deleted successfully",
        data: request,
      });
    } catch (err: any) {
      const { message, status } = errorHandler(err)
      res.status(status).json({
        message
      });
    }
  }
}