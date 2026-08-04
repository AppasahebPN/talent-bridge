import api from "./api";
import type { GenerateIdpRequest, GenerateIdpResponse } from "@/types";

/**
 * Calls POST /api/ai/generate-idp to generate AI Development Plan for given employee
 */
export const generateIdpApi = async (data: GenerateIdpRequest): Promise<GenerateIdpResponse> => {
  const response = await api.post<GenerateIdpResponse>("/ai/generate-idp", data);
  return response.data;
};
