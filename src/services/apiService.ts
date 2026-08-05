import api from "./api";

export async function fetchEmployeesApi() {
  const res = await api.get("/employees");
  return res.data;
}

export async function fetchEmployeeByIdApi(id: string) {
  const res = await api.get(`/employees/${id}`);
  return res.data;
}

export async function fetchSuccessProfilesApi() {
  const res = await api.get("/success-profiles");
  return res.data;
}

export async function fetchSuccessProfileByIdApi(id: string) {
  const res = await api.get(`/success-profiles/${id}`);
  return res.data;
}

export async function fetchGapAnalysisApi(employeeId: string, targetRole: string) {
  const res = await api.post("/gap-analysis", { employeeId, targetRole });
  return res.data;
}

export async function fetchIdpApi(employeeId: string) {
  const res = await api.post("/ai/generate-idp", { employeeId });
  return res.data;
}
