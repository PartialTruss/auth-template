import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import line from "../assets/Images/Line.svg";
import Button from "../components/common/Button";
import Checkbox from "../components/common/Checkbox";
import GoogleButton from "../components/common/GoogleButton";
import Input from "../components/common/Input";
import { useToken } from "../context/useToken";
import { useUser } from "../hooks/useUser";
import AuthLayout from "../layouts/AuthLayout";
import { api } from "../lib/axios";
import { getErrorMessage } from "../lib/getErrorMessage";
import { validateEmail, validatePassword } from "../lib/validation";

const LoginPage: React.FC = () => {
  const { setToken, isAuthReady } = useToken();
  const user = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [googleUrl, setGoogleUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    (location.state as { error?: string } | null)?.error ?? null,
  );

  useEffect(() => {
    const loadGoogleUrl = async () => {
      try {
        const res = await api.get("/auth/api/google/url");
        setGoogleUrl(res.data.url);
      } catch (err) {
        setError(
          getErrorMessage(err, "Google sign-in is unavailable right now."),
        );
      }
    };
    loadGoogleUrl();
  }, []);

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const clearError = () => {
    if (error) setError(null);
  };

  const handleLogin = async () => {
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.post("/auth/api/login", { email, password });
      setToken(res.data.token);
      navigate("/", { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, "Login failed. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthReady) {
    return (
      <AuthLayout title="Loading" subtitle="Checking your session..." />
    );
  }
  if (user) return null;

  return (
    <AuthLayout
      title="Hey, Welcome Back!"
      subtitle="Elon Musk’s repeated wavering on his deal to buy Twitter has roiled markets."
      error={error}
      footer={{
        text: "New member?",
        linkText: " Create an account",
        linkTo: "/sign-up",
      }}
    >
      <form
        className="mt-3 flex flex-col"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
      >
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            clearError();
          }}
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            clearError();
          }}
        />
        <section className="mb-4 flex justify-between items-center">
          <Checkbox text="Remember me" />
          <Link
            to="/forgot-password"
            className="text-sm text-[#1D3557] hover:underline focus:outline-none focus:ring-2 focus:ring-[#1D3557] rounded"
          >
            <span className="font-medium">Forgot password?</span>
          </Link>
        </section>
        <Button
          type="submit"
          disabled={loading}
          text={loading ? "Logging in..." : "Log In"}
        />
        <section className="mt-5 flex w-[46%] items-center justify-between gap-2">
          <img src={line} alt="" />
          <span className="text-sm text-[#00363A]/60">or</span>
          <img src={line} alt="" />
        </section>
        <section>
          <GoogleButton googleUrl={googleUrl} text="Sign in with Google" />
        </section>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
