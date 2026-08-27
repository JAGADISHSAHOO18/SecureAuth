import axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";
import useAuth from "@/auth/store";
import type LoginResponseData from "@/models/LoginResponseData";

type RetryableConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

type QueueItem = {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
};

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8082/api/v1",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8082/api/v1",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

let isRefreshing = false;
let queue: QueueItem[] = [];

const AUTH_ENDPOINTS = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh",
  "/auth/logout",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/verify-email",
];

function isAuthEndpoint(url?: string) {
  return !!url && AUTH_ENDPOINTS.some((endpoint) => url.includes(endpoint));
}

function flushQueue(error?: unknown, token?: string) {
  queue.forEach((item) => {
    if (error) item.reject(error);
    else if (token) item.resolve(token);
    else item.reject(new Error("Token refresh failed"));
  });
  queue = [];
}

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuth.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetryableConfig | undefined;

    if (!error.response || error.response.status !== 401 || !original) {
      return Promise.reject(error);
    }

    if (original._retry || isAuthEndpoint(original.url)) {
      return Promise.reject(error);
    }

    original._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push({
          resolve: (token) => {
            original.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(original));
          },
          reject,
        });
      });
    }

    isRefreshing = true;

    try {
      const response = await refreshClient.post<LoginResponseData>("/auth/refresh");
      const { accessToken, user } = response.data;

      useAuth.getState().setSession(accessToken, user);
      flushQueue(undefined, accessToken);

      original.headers.Authorization = `Bearer ${accessToken}`;
      return apiClient(original);
    } catch (refreshError) {
      flushQueue(refreshError);
      useAuth.getState().clearSession();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default apiClient;
export type { AxiosRequestConfig };
