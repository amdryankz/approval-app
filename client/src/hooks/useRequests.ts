import { useState, useCallback } from "react";
import type { Request, RequestsResponse } from "@/types/request";
import url from "@/constants/url";
import toast from "react-hot-toast";

export const useFetchRequests = (employeeId: string | null) => {
  const [requests, setRequests] = useState<RequestsResponse>({
    requests: [],
    approver: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchRequests = useCallback(async () => {
    if (!employeeId) {
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${url}/requests?employeeId=${employeeId}`).then(
        (res) => res.json()
      );

      setRequests(res.data || { requests: [], approver: [] });
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast.error("Failed to load requests");
    } finally {
      setIsLoading(false);
    }
  }, [employeeId]);

  return { requests, isLoading, fetchRequests, refetch: fetchRequests };
};

export const useFetchRequestById = (id: string | undefined) => {
  const [request, setRequest] = useState<Request | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRequest = useCallback(async () => {
    if (!id) return;

    setIsLoading(true);
    try {
      const res = await fetch(`${url}/requests/${id}`).then((res) =>
        res.json()
      );

      setRequest(res.data);
    } catch (error) {
      console.error("Error fetching request:", error);
      toast.error("Failed to load request details");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  return { request, isLoading, fetchRequest, refetch: fetchRequest };
};
