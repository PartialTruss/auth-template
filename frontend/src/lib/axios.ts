import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { getAccessToken, setAccessToken } from "./authToken";

export const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };

let refreshPromise: Promise<string | null> | null = null;

export const refreshAccessToken = async (): Promise<string | null> => {
  if (!refreshPromise) {
    refreshPromise = api
      .post<{ token: string }>("/auth/api/refresh")
      .then((res) => {
        const token = res.data.token;
        setAccessToken(token);
        return token;
      })
      .catch(() => {
        setAccessToken(null);
        return null;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetryConfig | undefined;
    const status = error.response?.status;
    const url = original?.url ?? "";

    const isRefreshCall = url.includes("/auth/api/refresh");
    const isAuthLogin = url.includes("/auth/api/login");

    if (
      status === 401 &&
      original &&
      !original._retry &&
      !isRefreshCall &&
      !isAuthLogin
    ) {
      original._retry = true;
      const token = await refreshAccessToken();

      if (token) {
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      }
    }

    return Promise.reject(error);
  },
);
