import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import type { RequestStatus } from "@/types/request";

interface StatusBadgeProps {
  status: RequestStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  switch (status) {
    case "approved":
      return (
        <Badge variant="success" className="flex items-center gap-1">
          <CheckCircle className="w-3 h-3" /> Approved
        </Badge>
      );
    case "rejected":
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <XCircle className="w-3 h-3" /> Rejected
        </Badge>
      );
    case "pending":
      return (
        <Badge variant="warning" className="flex items-center gap-1">
          <Clock className="w-3 h-3" /> Pending
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};
