import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToken } from "../context/useToken";
import AuthLayout from "../layouts/AuthLayout";

const OauthSuccess = () => {
  const [, setToken] = useToken();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      setToken(token);
      navigate("/", { replace: true });
    } else {
      navigate("/login", {
        replace: true,
        state: { error: "Google sign-in failed. Please try again." },
      });
    }
  }, [navigate, setToken]);

  return (
    <AuthLayout
      title="Signing You In"
      subtitle="Please wait while we complete your Google sign-in..."
    />
  );
};

export default OauthSuccess;
