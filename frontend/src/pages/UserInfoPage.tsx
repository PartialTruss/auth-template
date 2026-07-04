import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { useToken } from "../context/useToken";
import { useUser } from "../hooks/useUser";
import AuthLayout from "../layouts/AuthLayout";

const UserInfoPage: React.FC = () => {
  const user = useUser();
  const [, setToken] = useToken();
  const navigate = useNavigate();

  const logOut = () => {
    setToken("");
    navigate("/login");
  };

  if (!user) {
    return (
      <AuthLayout title="Loading" subtitle="Please wait a moment..." />
    );
  }

  return (
    <AuthLayout
      title="Your Account"
      subtitle="View your account details and manage your session."
      footer={{
        text: "Need to change your password?",
        linkText: "Reset password",
        linkTo: "/forgot-password",
      }}
    >
      <div className="mt-3 flex w-full flex-col">
        <Input
          label="Email"
          type="email"
          value={user.email ?? ""}
          readOnly
          className="cursor-default bg-[#F1FAEE]/60"
        />
        <section className="mt-3">
          <Button type="button" text="Log Out" onClick={logOut} />
        </section>
      </div>
    </AuthLayout>
  );
};

export default UserInfoPage;
