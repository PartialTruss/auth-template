import { AxiosError } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import forgotPasswordLogo from "../assets/Images/Forgot_Password.svg";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import AuthLayout from "../layouts/AuthLayout";
import { api } from "../lib/axios";

const ForgotPasswordPage = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [emailValue, setEmailValue] = useState("");

  const navigate = useNavigate();

  const onSubmitClicked = async () => {
    try {
      await api.put("/auth/api/forgot-password", {
        email: emailValue,
      });

      setSuccess(true);
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1500);
    } catch (error) {
      if (error instanceof AxiosError) {
        setErrorMessage(error.response?.data?.message || error.message);
      }
    }
  };

  return success ? (
    <div className="">
      <h1>success!</h1>
    </div>
  ) : (
    <AuthLayout
      title="Forgot Password"
      error={errorMessage}
      mainLogo={forgotPasswordLogo}
    >
      <Input
        label="Email"
        type="email"
        value={emailValue}
        onChange={(e) => setEmailValue(e.target.value)}
      />
      <section className="mt-3">
        <Button
          type="submit"
          text="Send me instructions"
          disabled={!emailValue}
          onClick={onSubmitClicked}
        />
      </section>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
