import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import AuthLayout from "../layouts/AuthLayout";

const PasswordResetFail = () => {
  const navigate = useNavigate();

  return (
    <AuthLayout
      title="Reset Failed"
      subtitle="This reset link is invalid or has expired. Please request a new one."
      footer={{
        text: "Need a new link?",
        linkText: "Request reset",
        linkTo: "/forgot-password",
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

export default PasswordResetFail;
