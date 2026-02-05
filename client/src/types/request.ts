export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface PurchaseDetails {
  item_description: string;
  estimated_cost: number;
  currency: string;
  vendor: string;
  urgency: string;
}

export interface LeaveDetails {
  leave_type: string;
  start_date: string;
  end_date: string;
  reason: string;
}

export interface OvertimeDetails {
  date: string;
  hours: number;
  reason: string;
}

export type RequestDetails = PurchaseDetails | LeaveDetails | OvertimeDetails | Record<string, unknown>;

export interface Request {
  id: string;
  type: "purchase" | "leave" | "overtime";
  submittedBy: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
  approvedBy?: string;
  approvedAt?: string;
  details: RequestDetails;
  notes?: string;
  submitter?: Employee;
  approver?: Employee;
}

export type RequestType = "purchase" | "leave" | "overtime";
export type RequestStatus = "pending" | "approved" | "rejected";

export interface RequestsResponse {
  requests: Request[];
  approver: Request[];
}
