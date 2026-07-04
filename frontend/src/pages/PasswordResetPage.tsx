import { AxiosError } from "axios";
import { useState } from "react";
import { useParams } from "react-router-dom";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import AuthLayout from "../layouts/AuthLayout";
import { api } from "../lib/axios";
import { getErrorMessage } from "../lib/getErrorMessage";
import { validatePassword, validatePasswordMatch } from "../lib/validation";
import PasswordResetFail from "./PasswordResetFail";
import PasswordResetSuccess from "./PasswordResetSuccess";

const PasswordResetPage = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailure, setIsFailure] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");
  const [confirmPasswordValue, setConfirmPasswordValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { passwordResetCode } = useParams();

  const clearError = () => {
    if (error) setError(null);
  };

  const onResetClicked = async () => {
    if (!passwordResetCode) {
      setIsFailure(true);
      return;
    }

    const passwordError = validatePassword(passwordValue);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    const matchError = validatePasswordMatch(
      passwordValue,
      confirmPasswordValue,
    );
    if (matchError) {
      setError(matchError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await api.put(`/auth/api/reset-password/${passwordResetCode}`, {
        newPassword: passwordValue,
      });
      setIsSuccess(true);
    } catch (err) {
      if (err instanceof AxiosError && err.response?.status === 404) {
        setIsFailure(true);
        return;
      }

      setError(
        getErrorMessage(
          err,
          "Could not reset your password. Please try again.",
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  if (isFailure) return <PasswordResetFail />;
  if (isSuccess) return <PasswordResetSuccess />;

  return (
    <AuthLayout
      title="Create New Password"
      subtitle="Choose a strong password to secure your account."
      error={error}
      footer={{
        text: "Remember your password?",
        linkText: "Sign in",
        linkTo: "/login",
      }}
    >
      <form
        className="mt-3 flex w-full flex-col"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          onResetClicked();
        }}
      >
        <Input
          label="New Password"
          type="password"
          value={passwordValue}
          onChange={(e) => {
            setPasswordValue(e.target.value);
            clearError();
          }}
        />
        <Input
          label="Confirm Password"
          type="password"
          value={confirmPasswordValue}
          onChange={(e) => {
            setConfirmPasswordValue(e.target.value);
            clearError();
          }}
        />
        <section className="mt-3">
          <Button
            type="submit"
            text={loading ? "Resetting..." : "Reset Password"}
            disabled={loading}
          />
        </section>
      </form>
    </AuthLayout>
  );
};

export default PasswordResetPage;
