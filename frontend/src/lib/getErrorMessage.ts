import { AxiosError } from "axios";

type ApiErrorBody = {
  error?: string;
  message?: string;
  details?: string;
};

export function getErrorMessage(
  err: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  if (err instanceof AxiosError) {
    if (!err.response) {
      if (err.code === "ERR_NETWORK") {
        return "Unable to reach the server. Check your connection and try again.";
      }
      if (err.code === "ECONNABORTED") {
        return "Request timed out. Please try again.";
      }
      return "Network error. Please try again.";
    }

    const data = err.response.data as ApiErrorBody | string | undefined;

    if (typeof data === "string" && data.trim()) return data;
    if (data && typeof data === "object") {
      if (data.message) return data.message;
      if (data.error) return data.error;
      if (data.details) return data.details;
    }

    switch (err.response.status) {
      case 400:
        return "Invalid request. Please check your input.";
      case 401:
        return "Invalid credentials. Please try again.";
      case 403:
        return "You don't have permission to do that.";
      case 404:
        return "The requested resource was not found.";
      case 409:
        return "This account already exists.";
      case 500:
        return "Server error. Please try again later.";
      default:
        return fallback;
    }
  }

  if (err instanceof Error && err.message) return err.message;

  return fallback;
}
