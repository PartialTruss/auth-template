import { Route, Routes } from "react-router-dom";
import { useToken } from "../context/useToken";
import { useUser } from "../hooks/useUser";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import LoginPage from "../pages/LoginPage";
import OauthSuccess from "../pages/OauthSuccess";
import PasswordResetPage from "../pages/PasswordResetPage";
import SignupPage from "../pages/SignupPage";
import UserInfoPage from "../pages/UserInfoPage";
import VerifyPage from "../pages/VerifyPage";
import PrivateRoute from "./PrivateRoute";

const AppRoutes = () => {
  const user = useUser();
  const { isAuthReady, token } = useToken();
  const hasSession = !!user || !!token;

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/oauth-success" element={<OauthSuccess />} />
      <Route path="/sign-up" element={<SignupPage />} />
      <Route path="/verify-email" element={<VerifyPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route
        path="/forgot-password/:passwordResetCode"
        element={<PasswordResetPage />}
      />

      <Route
        element={
          <PrivateRoute
            isAllowed={hasSession}
            isLoading={!isAuthReady}
            redirectPath="/login"
          />
        }
      >
        <Route path="/" element={<UserInfoPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
