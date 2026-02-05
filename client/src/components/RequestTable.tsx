import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, FileText, Trash2 } from "lucide-react";
import type { Request } from "@/types/request";
import { StatusBadge } from "@/components/StatusBadge";
import { TypeBadge } from "@/components/TypeBadge";
import { formatDate } from "@/utils/formatDate";

interface RequestTableProps {
  requests: Request[];
  isLoading: boolean;
  showSubmitter?: boolean;
  onDelete: (requestId: string) => void;
}

export const RequestTable = ({
  requests,
  isLoading,
  showSubmitter = false,
  onDelete,
}: RequestTableProps) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <FileText className="w-12 h-12 mb-4 text-gray-300" />
        <p className="text-lg font-medium">No requests found</p>
        <p className="text-sm">
          Try adjusting your filters or create a new request
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-25">ID</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
          {showSubmitter && <TableHead>Submitted By</TableHead>}
          <TableHead>Submitted At</TableHead>
          <TableHead>Approved At</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.map((request) => (
          <TableRow key={request.id}>
            <TableCell className="font-medium">{request.id}</TableCell>
            <TableCell>
              <TypeBadge type={request.type} />
            </TableCell>
            <TableCell>
              <StatusBadge status={request.status} />
            </TableCell>
            {showSubmitter && (
              <TableCell className="text-sm text-gray-600">
                {request.submitter?.name || "-"}
              </TableCell>
            )}
            <TableCell className="text-sm text-gray-600">
              {formatDate(request.submittedAt)}
            </TableCell>
            <TableCell className="text-sm text-gray-600">
              {request.approvedAt ? formatDate(request.approvedAt) : "-"}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/request/${request.id}`)}
                >
                  View
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(request.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
