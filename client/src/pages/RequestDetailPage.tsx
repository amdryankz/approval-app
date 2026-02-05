import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  User,
  FileText,
  Loader2,
  Edit,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";
import url from "@/constants/url";
import type {
  PurchaseDetails,
  LeaveDetails,
  OvertimeDetails,
} from "@/types/request";
import { useAuth } from "@/hooks/useAuth";
import { useFetchRequestById } from "@/hooks/useRequests";
import { StatusBadge } from "@/components/StatusBadge";
import { getTypeIcon } from "@/components/TypeBadge";
import { formatDate } from "@/utils/formatDate";

export default function RequestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { userId } = useAuth();
  const { request, isLoading, refetch } = useFetchRequestById(id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<"approved" | "rejected">(
    "approved",
  );
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (id) {
      refetch();
    }
  }, [id, refetch]);

  const handleUpdateStatus = async () => {
    if (!request) return;

    setIsUpdating(true);
    try {
      const response = await fetch(`${url}/requests/${request.id}/approved`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
          approvedBy: userId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update request status");
      }

      toast.success(`Request ${newStatus} successfully!`);
      setIsModalOpen(false);

      await refetch();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update request status");
    } finally {
      setIsUpdating(false);
    }
  };

  const renderDetailsByType = () => {
    if (!request) return null;

    switch (request.type) {
      case "purchase": {
        const purchaseDetails = request.details as PurchaseDetails;
        return (
          <div className="space-y-4">
            <DetailItem
              label="Item Description"
              value={purchaseDetails.item_description || "-"}
            />
            <DetailItem
              label="Estimated Cost"
              value={
                purchaseDetails.estimated_cost
                  ? `${purchaseDetails.currency} ${purchaseDetails.estimated_cost.toLocaleString()}`
                  : "-"
              }
            />
            <DetailItem label="Vendor" value={purchaseDetails.vendor || "-"} />
            <DetailItem
              label="Urgency"
              value={
                <Badge
                  variant={
                    purchaseDetails.urgency === "high"
                      ? "destructive"
                      : "outline"
                  }
                  className="capitalize"
                >
                  {purchaseDetails.urgency}
                </Badge>
              }
            />
          </div>
        );
      }

      case "leave": {
        const leaveDetails = request.details as LeaveDetails;
        return (
          <div className="space-y-4">
            <DetailItem
              label="Leave Type"
              value={
                <Badge variant="outline" className="capitalize">
                  {leaveDetails.leave_type}
                </Badge>
              }
            />
            <DetailItem
              label="Start Date"
              value={
                leaveDetails.start_date
                  ? new Date(leaveDetails.start_date).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )
                  : "-"
              }
            />
            <DetailItem
              label="End Date"
              value={
                leaveDetails.end_date
                  ? new Date(leaveDetails.end_date).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )
                  : "-"
              }
            />
            <DetailItem label="Reason" value={leaveDetails.reason || "-"} />
          </div>
        );
      }

      case "overtime": {
        const overtimeDetails = request.details as OvertimeDetails;
        return (
          <div className="space-y-4">
            <DetailItem
              label="Date"
              value={
                overtimeDetails.date
                  ? new Date(overtimeDetails.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "-"
              }
            />
            <DetailItem
              label="Hours"
              value={
                overtimeDetails.hours ? `${overtimeDetails.hours} hours` : "-"
              }
            />
            <DetailItem label="Reason" value={overtimeDetails.reason || "-"} />
          </div>
        );
      }

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-900">Request not found</p>
          <Button onClick={() => navigate("/home")} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => navigate("/home")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Requests
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Request Details
              </h1>
              <p className="text-gray-600 mt-1">
                View complete request information
              </p>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={request.status} />
              {/* Show update button for pending requests - temporarily show for all pending to test */}
              {request.status === "pending" && (
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Edit className="w-4 h-4" />
                      Update Status
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-106.25">
                    <DialogHeader>
                      <DialogTitle>Update Request Status</DialogTitle>
                      <DialogDescription>
                        Change the status of this request. This action will
                        notify the submitter.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <select
                          id="status"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          value={newStatus}
                          onChange={(e) =>
                            setNewStatus(
                              e.target.value as "approved" | "rejected",
                            )
                          }
                          disabled={isUpdating}
                        >
                          <option value="approved">Approve</option>
                          <option value="rejected">Reject</option>
                        </select>
                      </div>
                      <div className="rounded-lg bg-gray-50 p-4">
                        <p className="text-sm text-gray-600">
                          <strong>Request ID:</strong> {request.id}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          <strong>Type:</strong> {request.type}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          <strong>Submitted by:</strong>{" "}
                          {request.submitter?.name}
                        </p>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsModalOpen(false)}
                        disabled={isUpdating}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleUpdateStatus}
                        disabled={isUpdating}
                        className={
                          newStatus === "rejected"
                            ? "bg-red-600 hover:bg-red-700"
                            : ""
                        }
                      >
                        {isUpdating ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          `${newStatus === "approved" ? "Approve" : "Reject"} Request`
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Request Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-linear-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                  {getTypeIcon(request.type)}
                </div>
                <div>
                  <CardTitle className="text-xl capitalize">
                    {request.type} Request
                  </CardTitle>
                  <CardDescription>ID: {request.id}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                    Submitter Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <User className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Name</p>
                        <p className="font-medium">
                          {request.submitter?.name || "Unknown"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Submitted At</p>
                        <p className="font-medium">
                          {formatDate(request.submittedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {request.status !== "pending" && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                      Approval Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <User className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-600">Approver</p>
                          <p className="font-medium">
                            {request.approver?.name || "Unknown"}
                          </p>
                        </div>
                      </div>
                      {request.approvedAt && (
                        <div className="flex items-start gap-3">
                          <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-600">
                              {request.status === "approved"
                                ? "Approved At"
                                : "Rejected At"}
                            </p>
                            <p className="font-medium">
                              {formatDate(request.approvedAt)}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Request Details */}
          <Card>
            <CardHeader>
              <CardTitle>Request Details</CardTitle>
              <CardDescription>
                Specific information about this request
              </CardDescription>
            </CardHeader>
            <CardContent>{renderDetailsByType()}</CardContent>
          </Card>

          {/* Notes */}
          {request.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Additional Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {request.notes}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Request Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <TimelineItem
                  icon={<FileText className="w-5 h-5" />}
                  title="Request Submitted"
                  description={`By ${request.submitter?.name || "Unknown"}`}
                  time={formatDate(request.submittedAt)}
                  isCompleted={true}
                />

                {request.status !== "pending" && request.approvedAt && (
                  <TimelineItem
                    icon={
                      request.status === "approved" ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <XCircle className="w-5 h-5" />
                      )
                    }
                    title={
                      request.status === "approved"
                        ? "Request Approved"
                        : "Request Rejected"
                    }
                    description={`By ${request.approver?.name || "Unknown"}`}
                    time={formatDate(request.approvedAt)}
                    isCompleted={true}
                    variant={
                      request.status === "approved" ? "success" : "destructive"
                    }
                  />
                )}

                {request.status === "pending" && (
                  <TimelineItem
                    icon={<Clock className="w-5 h-5" />}
                    title="Waiting for Approval"
                    description="Request is under review"
                    time=""
                    isCompleted={false}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex flex-col space-y-1">
      <span className="text-sm font-medium text-gray-500">{label}</span>
      <div className="text-base text-gray-900">{value || "-"}</div>
    </div>
  );
}

function TimelineItem({
  icon,
  title,
  description,
  time,
  variant = "default",
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  time: string;
  isCompleted: boolean;
  variant?: "default" | "success" | "destructive";
}) {
  const colors = {
    default: "bg-blue-100 text-blue-600",
    success: "bg-green-100 text-green-600",
    destructive: "bg-red-100 text-red-600",
  };

  return (
    <div className="flex gap-4">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${colors[variant]}`}
      >
        {icon}
      </div>
      <div className="flex-1 pb-4 border-l-2 border-gray-200 pl-4 ml-1">
        <h4 className="font-semibold text-gray-900">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
        {time && <p className="text-xs text-gray-500 mt-1">{time}</p>}
      </div>
    </div>
  );
}
