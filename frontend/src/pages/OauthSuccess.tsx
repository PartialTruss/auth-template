import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useToken } from "../context/useToken";
import AuthLayout from "../layouts/AuthLayout";
import { refreshAccessToken } from "../lib/axios";

const OauthSuccess = () => {
  const { setToken, isAuthReady, token } = useToken();
  const navigate = useNavigate();
  const startedRef = useRef(false);

  useEffect(() => {
    if (!isAuthReady || startedRef.current) return;
    startedRef.current = true;

    const completeOauth = async () => {
      const nextToken = token ?? (await refreshAccessToken());

      if (nextToken) {
        setToken(nextToken);
        navigate("/", { replace: true });
        return;
      }

      navigate("/login", {
        replace: true,
        state: { error: "Google sign-in failed. Please try again." },
      });
    };

    void completeOauth();
  }, [isAuthReady, navigate, setToken, token]);

  return (
    <AuthLayout
      title="Signing You In"
      subtitle="Please wait while we complete your Google sign-in..."
    />
  );
};

export default OauthSuccess;
