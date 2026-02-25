import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import mainLogo from "../assets/Images/Group 1.svg";
import Button from "../components/common/Button";
import Checkbox from "../components/common/Checkbox";
import GoogleButton from "../components/common/GoogleButton";
import Input from "../components/common/Input";
import { useToken } from "../context/useToken";
import { useUser } from "../hooks/useUser";
import AuthLayout from "../layouts/AuthLayout";
import { api } from "../lib/axios";

const LoginPage: React.FC = () => {
  const [, setToken] = useToken();
  const user = useUser();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [googleUrl, setGoogleUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGoogleUrl = async () => {
      try {
        const res = await api.get("/auth/api/google/url");
        setGoogleUrl(res.data.url);
      } catch (err) {
        console.error(err);
      }
    };
    loadGoogleUrl();
  }, []);

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/auth/api/login", { email, password });
      setToken(res.data.token);
      navigate("/", { replace: true });
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.error || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  if (user === undefined) {
    return <p className="text-center mt-10">Loading...</p>;
  }
  if (user) return null;

  return (
    <AuthLayout
      title="Hey, Welcome Back!"
      error={error}
      footer={{
        text: "New member?",
        linkText: "Create an account",
        linkTo: "/sign-up",
      }}
      mainLogo={mainLogo}
    >
      <form
        className="flex flex-col w-full"
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
      >
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <section className="flex justify-between items-center mb-4">
          <Checkbox text="Remember me" />
          <Link
            to="/forgot-password"
            className="text-sm text-[#00363A] hover:underline focus:outline-none focus:ring-2 focus:ring-[#006D77] rounded"
          >
            Forgot password?
          </Link>
        </section>
        <Button
          type="submit"
          onClick={handleLogin}
          disabled={loading || !email}
          text={loading ? "Logging in..." : "Log In"}
        />
        <section className="flex justify-between items-center mt-5 gap-2">
          <div className="flex-1 border-t border-[#83C5BE]/30" />
          <span className="text-[#00363A]/60 text-sm">or</span>
          <div className="flex-1 border-t border-[#83C5BE]/30" />
        </section>
        <GoogleButton googleUrl={googleUrl} text="Sign in with Google" />
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
