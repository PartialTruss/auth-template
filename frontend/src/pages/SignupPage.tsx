import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import line from "../assets/Images/Line.svg";
import Button from "../components/common/Button";
import Checkbox from "../components/common/Checkbox";
import GoogleButton from "../components/common/GoogleButton";
import Input from "../components/common/Input";
import AuthLayout from "../layouts/AuthLayout";
import { api } from "../lib/axios";
import { getErrorMessage } from "../lib/getErrorMessage";
import {
  validateEmail,
  validatePassword,
  validateUsername,
} from "../lib/validation";

const SignupPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isChecked, setIsChecked] = useState(false);
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
        setError(
          getErrorMessage(err, "Google sign-up is unavailable right now."),
        );
      }
    };
    loadGoogleUrl();
  }, []);

  const clearError = () => {
    if (error) setError(null);
  };

  const handleSignUp = async () => {
    const usernameError = validateUsername(username);
    if (usernameError) {
      setError(usernameError);
      return;
    }

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

    if (!isChecked) {
      setError("You must agree to the terms & conditions.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await api.post("/auth/api/sign-up", {
        email: email.trim(),
        password,
      });
      navigate("/login", { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, "Sign up failed. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Get Started Now!"
      subtitle="Elon Musk’s repeated wavering on his deal to buy Twitter has roiled markets."
      error={error}
      footer={{
        text: "Already have an account?",
        linkText: "Log in",
        linkTo: "/login",
      }}
    >
      <form
        className="mt-3 flex w-full flex-col"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          handleSignUp();
        }}
      >
        <Input
          label="Username"
          type="text"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            clearError();
          }}
        />
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
        <section className="mb-4 flex items-center">
          <Checkbox
            text="I agree to the"
            secondary_text="terms & conditions"
            checked={isChecked}
            onChange={(e) => {
              setIsChecked(e.target.checked);
              if (e.target.checked) clearError();
            }}
            required
          />
        </section>
        <Button
          type="submit"
          disabled={loading || !isChecked}
          text={loading ? "Creating account..." : "Sign up"}
        />
        <section className="mt-5 flex w-[47%] items-center justify-between gap-2">
          <img src={line} alt="" />
          <span className="text-sm text-[#00363A]/60">or</span>
          <img src={line} alt="" />
        </section>
        <GoogleButton googleUrl={googleUrl} text="Sign up with Google" />
      </form>
    </AuthLayout>
  );
};

export default SignupPage;
