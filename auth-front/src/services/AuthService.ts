import apiClient from "@/config/apiClient";
import type AuditLog from "@/models/AuditLog";
import type LoginData from "@/models/LoginData";
import type LoginResponseData from "@/models/LoginResponseData";
import type RegisterData from "@/models/RegisterData";
import type Session from "@/models/Session";
import type User from "@/models/User";

export const registerUser = async (data: RegisterData) => {
  const response = await apiClient.post<User>("/auth/register", data);
  return response.data;
};

export const loginUser = async (data: LoginData) => {
  const response = await apiClient.post<LoginResponseData>("/auth/login", data);
  return response.data;
};

export const logoutUser = async () => {
  await apiClient.post("/auth/logout");
};

export const refreshToken = async () => {
  const response = await apiClient.post<LoginResponseData>("/auth/refresh");
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await apiClient.get<User>("/auth/me");
  return response.data;
};

export const updateProfile = async (data: { name: string; image?: string | null }) => {
  const response = await apiClient.put<User>("/users/me", data);
  return response.data;
};

export const changePassword = async (data: {
  currentPassword: string;
  newPassword: string;
}) => {
  await apiClient.post("/users/me/password", data);
};

export const deleteAccount = async () => {
  await apiClient.delete("/users/me");
};

export const getSessions = async () => {
  const response = await apiClient.get<Session[]>("/auth/sessions");
  return response.data;
};

export const revokeSession = async (id: string) => {
  await apiClient.delete(`/auth/sessions/${id}`);
};

export const getAuditLog = async () => {
  const response = await apiClient.get<AuditLog[]>("/auth/audit-log");
  return response.data;
};

export const verifyEmail = async (token: string) => {
  await apiClient.post("/auth/verify-email", { token });
};

export const forgotPassword = async (email: string) => {
  await apiClient.post("/auth/forgot-password", { email });
};

export const validateResetToken = async (token: string) => {
  await apiClient.get("/auth/reset-password/validate", { params: { token } });
};

export const resetPassword = async (token: string, newPassword: string) => {
  await apiClient.post("/auth/reset-password", { token, newPassword });
};

export const getAdminUsers = async () => {
  const response = await apiClient.get<User[]>("/admin/users");
  return response.data;
};
