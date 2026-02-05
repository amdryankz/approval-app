import { RequestStatus, RequestType } from "../../prisma/generated/client";

export interface CreateRequestInput {
  type: RequestType;
  submittedBy: string;
  details: RequestDetails;
  notes?: string;
}

export type RequestDetails =
  | PurchaseRequestDetails
  | LeaveRequestDetails
  | OvertimeRequestDetails;

export interface PurchaseRequestDetails {
  item_description: string;
  estimated_cost: number;
  currency: string;
  vendor: string;
  urgency: string;
}

export interface LeaveRequestDetails {
  leave_type: string;
  start_date: string;
  end_date: string;
  reason: string;
}

export interface OvertimeRequestDetails {
  date: string;
  hours: number;
  reason: string;
}

export interface ApproveRequestInput {
  status: RequestStatus
  approvedBy: string
}