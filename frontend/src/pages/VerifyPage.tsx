import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import { api } from "../lib/axios";
import { getErrorMessage } from "../lib/getErrorMessage";

type Status = "verifying" | "success" | "error";

const VerifyPage = () => {
  const [status, setStatus] = useState<Status>("verifying");
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  useEffect(() => {
    const controller = new AbortController();

    const verifyEmail = async () => {
      if (!token) {
        setStatus("error");
        setError("Verification link is missing or invalid.");
        return;
      }

      try {
        await api.get(`/auth/verify-email?token=${token}`, {
          signal: controller.signal,
        });

        setStatus("success");

        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 1500);
      } catch (err) {
        if (controller.signal.aborted) return;

        setStatus("error");
        setError(
          getErrorMessage(
            err,
            "Email verification failed. The link may be invalid or expired.",
          ),
        );
      }
    };

    verifyEmail();

    return () => {
      controller.abort();
    };
  }, [token, navigate]);

  const subtitles: Record<Status, string> = {
    verifying: "Please wait while we verify your email address.",
    success: "Your email has been verified. Redirecting you to login...",
    error: "We couldn't verify your email.",
  };

  return (
    <AuthLayout
      title="Email Verification"
      subtitle={subtitles[status]}
      error={status === "error" ? error : null}
    />
  );
};

export default VerifyPage;
