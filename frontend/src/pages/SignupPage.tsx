import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import Checkbox from "../components/common/Checkbox";
import GoogleButton from "../components/common/GoogleButton";
import Input from "../components/common/Input";
import { useToken } from "../context/useToken";
import AuthLayout from "../layouts/AuthLayout";
import { api } from "../lib/axios";

const SignupPage: React.FC = () => {
  const [, setToken] = useToken();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [googleUrl, setGoogleUrl] = useState("");

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

  const handleSignUp = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post<{ token: string }>("/auth/api/sign-up", {
        email,
        password,
      });
      setToken(response.data.token);
      navigate("/", { replace: true });
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(
          err.response?.data?.message ?? "Sign up failed. Please try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Lorem ipsum dolor sit amet consectetur adipiscing elit."
      error={error}
      footer={{
        text: "Already have an account?",
        linkText: "Log in",
        linkTo: "/login",
      }}
    >
      <form
        className="flex flex-col w-full"
        onSubmit={(e) => {
          e.preventDefault();
          handleSignUp();
        }}
      >
        <Input
          label="Username"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
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
        <section className="flex items-center mb-4">
          <Checkbox text="I agree to the Terms & Conditions and Privacy Policy" />
        </section>
        <Button
          type="submit"
          onClick={handleSignUp}
          disabled={loading}
          text={loading ? "Creating account..." : "Sign up"}
        />
        <section className="flex justify-between items-center mt-5 gap-2">
          <div className="flex-1 border-t border-[#83C5BE]/30" />
          <span className="text-[#00363A]/60 text-sm">or</span>
          <div className="flex-1 border-t border-[#83C5BE]/30" />
        </section>
        <GoogleButton googleUrl={googleUrl} text="Sign up with Google" />
      </form>
    </AuthLayout>
  );
};

export default SignupPage;
