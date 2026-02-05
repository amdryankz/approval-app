import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Calendar,
  ShoppingCart,
  Clock,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import url from "@/constants/url";
import { useAuth } from "@/hooks/useAuth";

export default function CreateRequestPage() {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("purchase");

  const [purchaseForm, setPurchaseForm] = useState({
    item_description: "",
    estimated_cost: "",
    currency: "IDR",
    vendor: "",
    urgency: "normal",
  });

  const [leaveForm, setLeaveForm] = useState({
    leave_type: "annual",
    start_date: "",
    end_date: "",
    reason: "",
  });

  const [overtimeForm, setOvertimeForm] = useState({
    date: "",
    hours: "",
    reason: "",
  });

  const [notes, setNotes] = useState("");

  const handleSubmitPurchase = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !purchaseForm.item_description ||
      !purchaseForm.estimated_cost ||
      !purchaseForm.vendor
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    await submitRequest("purchase", purchaseForm);
  };

  const handleSubmitLeave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!leaveForm.start_date || !leaveForm.end_date || !leaveForm.reason) {
      toast.error("Please fill in all required fields");
      return;
    }

    await submitRequest("leave", leaveForm);
  };

  const handleSubmitOvertime = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!overtimeForm.date || !overtimeForm.hours || !overtimeForm.reason) {
      toast.error("Please fill in all required fields");
      return;
    }

    await submitRequest("overtime", {
      ...overtimeForm,
      hours: parseInt(overtimeForm.hours),
    });
  };

  const submitRequest = async (
    type: string,
    details: Record<string, unknown>,
  ) => {
    setIsLoading(true);
    try {
      if (!userId) {
        toast.error("Please login first");
        navigate("/");
        return;
      }

      const response = await fetch(`${url}/requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          submittedBy: userId,
          details,
          notes: notes || null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create request");
      }

      toast.success("Request created successfully!");
      navigate("/home");
    } catch (error: unknown) {
      console.error("Error creating request:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create request",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => navigate("/home")}
            disabled={isLoading}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Requests
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Create New Request
            </h1>
            <p className="text-gray-600 mt-1">
              Submit a purchase, leave, or overtime request
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Request Form</CardTitle>
            <CardDescription>
              Choose the type of request and fill in the details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger
                  value="purchase"
                  className="flex items-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Purchase
                </TabsTrigger>
                <TabsTrigger value="leave" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Leave
                </TabsTrigger>
                <TabsTrigger
                  value="overtime"
                  className="flex items-center gap-2"
                >
                  <Clock className="w-4 h-4" />
                  Overtime
                </TabsTrigger>
              </TabsList>

              {/* Purchase Request Form */}
              <TabsContent value="purchase">
                <form onSubmit={handleSubmitPurchase} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="item_description">
                      Item Description <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="item_description"
                      placeholder="e.g., Office supplies, equipment, software license"
                      value={purchaseForm.item_description}
                      onChange={(e) =>
                        setPurchaseForm({
                          ...purchaseForm,
                          item_description: e.target.value,
                        })
                      }
                      disabled={isLoading}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="estimated_cost">
                        Estimated Cost <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="estimated_cost"
                        type="number"
                        placeholder="0"
                        value={purchaseForm.estimated_cost}
                        onChange={(e) =>
                          setPurchaseForm({
                            ...purchaseForm,
                            estimated_cost: e.target.value,
                          })
                        }
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <select
                        id="currency"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        value={purchaseForm.currency}
                        onChange={(e) =>
                          setPurchaseForm({
                            ...purchaseForm,
                            currency: e.target.value,
                          })
                        }
                        disabled={isLoading}
                      >
                        <option value="IDR">IDR</option>
                        <option value="USD">USD</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vendor">
                      Vendor <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="vendor"
                      placeholder="e.g., PT ABC Indonesia"
                      value={purchaseForm.vendor}
                      onChange={(e) =>
                        setPurchaseForm({
                          ...purchaseForm,
                          vendor: e.target.value,
                        })
                      }
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="urgency">Urgency Level</Label>
                    <select
                      id="urgency"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      value={purchaseForm.urgency}
                      onChange={(e) =>
                        setPurchaseForm({
                          ...purchaseForm,
                          urgency: e.target.value,
                        })
                      }
                      disabled={isLoading}
                    >
                      <option value="low">Low</option>
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes_purchase">Additional Notes</Label>
                    <textarea
                      id="notes_purchase"
                      className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      placeholder="Any additional information..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Purchase Request"
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* Leave Request Form */}
              <TabsContent value="leave">
                <form onSubmit={handleSubmitLeave} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="leave_type">Leave Type</Label>
                    <select
                      id="leave_type"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      value={leaveForm.leave_type}
                      onChange={(e) =>
                        setLeaveForm({
                          ...leaveForm,
                          leave_type: e.target.value,
                        })
                      }
                      disabled={isLoading}
                    >
                      <option value="annual">Annual Leave</option>
                      <option value="sick">Sick Leave</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start_date">
                        Start Date <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="start_date"
                        type="date"
                        value={leaveForm.start_date}
                        onChange={(e) =>
                          setLeaveForm({
                            ...leaveForm,
                            start_date: e.target.value,
                          })
                        }
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="end_date">
                        End Date <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="end_date"
                        type="date"
                        value={leaveForm.end_date}
                        onChange={(e) =>
                          setLeaveForm({
                            ...leaveForm,
                            end_date: e.target.value,
                          })
                        }
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reason">
                      Reason <span className="text-red-500">*</span>
                    </Label>
                    <textarea
                      id="reason"
                      className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      placeholder="Please provide the reason for your leave request"
                      value={leaveForm.reason}
                      onChange={(e) =>
                        setLeaveForm({ ...leaveForm, reason: e.target.value })
                      }
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes_leave">Additional Notes</Label>
                    <textarea
                      id="notes_leave"
                      className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      placeholder="Any additional information..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Leave Request"
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* Overtime Request Form */}
              <TabsContent value="overtime">
                <form onSubmit={handleSubmitOvertime} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="date">
                      Date <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={overtimeForm.date}
                      onChange={(e) =>
                        setOvertimeForm({
                          ...overtimeForm,
                          date: e.target.value,
                        })
                      }
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hours">
                      Hours <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="hours"
                      type="number"
                      placeholder="e.g., 2"
                      min="1"
                      max="12"
                      value={overtimeForm.hours}
                      onChange={(e) =>
                        setOvertimeForm({
                          ...overtimeForm,
                          hours: e.target.value,
                        })
                      }
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="overtime_reason">
                      Reason <span className="text-red-500">*</span>
                    </Label>
                    <textarea
                      id="overtime_reason"
                      className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      placeholder="Please provide the reason for overtime"
                      value={overtimeForm.reason}
                      onChange={(e) =>
                        setOvertimeForm({
                          ...overtimeForm,
                          reason: e.target.value,
                        })
                      }
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes_overtime">Additional Notes</Label>
                    <textarea
                      id="notes_overtime"
                      className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      placeholder="Any additional information..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Overtime Request"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
