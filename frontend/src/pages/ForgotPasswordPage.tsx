import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import AuthLayout from "../layouts/AuthLayout";
import { api } from "../lib/axios";
import { getErrorMessage } from "../lib/getErrorMessage";
import { validateEmail } from "../lib/validation";

const ForgotPasswordPage = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [emailValue, setEmailValue] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const clearError = () => {
    if (error) setError(null);
  };

  const onSubmitClicked = async () => {
    const emailError = validateEmail(emailValue);
    if (emailError) {
      setError(emailError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await api.put("/auth/api/forgot-password", {
        email: emailValue.trim(),
      });

      setSuccess(true);
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1500);
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Could not send reset instructions. Please try again.",
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AuthLayout
        title="Check Your Email"
        subtitle="If an account exists for that address, we've sent password reset instructions. Redirecting you to login..."
      />
    );
  }

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Reset your password quickly and securely to regain access."
      error={error}
    >
      <form
        className="mt-3 flex w-full flex-col"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          onSubmitClicked();
        }}
      >
        <Input
          label="Email"
          type="email"
          value={emailValue}
          onChange={(e) => {
            setEmailValue(e.target.value);
            clearError();
          }}
        />
        <section className="mt-3">
          <Button
            type="submit"
            text={loading ? "Sending..." : "Send me instructions"}
            disabled={loading}
          />
        </section>
      </form>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
