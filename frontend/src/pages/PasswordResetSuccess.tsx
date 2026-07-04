import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import AuthLayout from "../layouts/AuthLayout";

const PasswordResetSuccess = () => {
  const navigate = useNavigate();

  return (
    <AuthLayout
      title="Password Reset!"
      subtitle="Your password has been updated successfully. You can now sign in with your new password."
      footer={{
        text: "Ready to continue?",
        linkText: "Sign in",
        linkTo: "/login",
      }}
    >
      <section className="mt-3">
        <Button
          type="button"
          text="Back to Login"
          onClick={() => navigate("/login")}
        />
      </section>
    </AuthLayout>
  );
};

export default PasswordResetSuccess;
