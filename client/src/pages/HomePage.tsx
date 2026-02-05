import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Clock, FileText, Plus } from "lucide-react";
import toast from "react-hot-toast";
import url from "@/constants/url";
import { useAuth } from "@/hooks/useAuth";
import { useFetchRequests } from "@/hooks/useRequests";
import { RequestTable } from "@/components/RequestTable";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();
  const { userId } = useAuth();
  const { requests, isLoading, refetch } = useFetchRequests(userId);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleDeleteRequest = async (requestId: string) => {
    if (!confirm("Are you sure you want to delete this request?")) {
      return;
    }

    try {
      const response = await fetch(`${url}/requests/${requestId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete request");
      }

      toast.success("Request deleted successfully");
      refetch();
    } catch (error) {
      console.error("Error deleting request:", error);
      toast.error("Failed to delete request");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Requests</h1>
            <p className="text-gray-600 mt-2">
              View and manage your submitted requests
            </p>
          </div>
          <Button
            onClick={() => navigate("/request/create")}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Request
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Request List</CardTitle>
            <CardDescription>
              Filter and view your requests by status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="all" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  All Requests
                </TabsTrigger>
                <TabsTrigger
                  value="pending"
                  className="flex items-center gap-2"
                >
                  <Clock className="w-4 h-4" />
                  Need Approval
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <RequestTable
                  requests={requests.requests}
                  isLoading={isLoading}
                  showSubmitter={false}
                  onDelete={handleDeleteRequest}
                />
              </TabsContent>

              <TabsContent value="pending">
                <RequestTable
                  requests={requests.approver}
                  isLoading={isLoading}
                  showSubmitter={true}
                  onDelete={handleDeleteRequest}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
