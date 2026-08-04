import { useState, useCallback } from "react";
import { generateIdpApi } from "@/services/aiService";
import { normalizeIdpResponse } from "@/utils/idp";
import type { GenerateIdpResponse, IdpData } from "@/types";

export function useGenerateIdp() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<GenerateIdpResponse | null>(null);
  const [idpData, setIdpData] = useState<IdpData | null>(null);

  const generatePlan = useCallback(async (employeeId: string) => {
    if (!employeeId) {
      setError("Employee ID is required.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await generateIdpApi({ employeeId });
      if (res && res.success !== false) {
        setResponse(res);
        const normalized = normalizeIdpResponse(res);
        setIdpData(normalized);
      } else {
        setError(res?.message || "Failed to generate AI Development Plan.");
      }
    } catch (err: any) {
      console.error("Error generating AI IDP:", err);
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to connect to AI server. Please verify backend is running at http://localhost:5000";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setResponse(null);
    setIdpData(null);
  }, []);

  return {
    loading,
    error,
    response,
    idpData,
    generatePlan,
    reset,
  };
}
