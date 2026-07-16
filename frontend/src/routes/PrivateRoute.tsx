import { Navigate, Outlet } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";

interface PrivateRouteProps {
  isAllowed: boolean;
  isLoading?: boolean;
  redirectPath: string;
}

const PrivateRoute = ({
  isAllowed,
  isLoading = false,
  redirectPath,
}: PrivateRouteProps) => {
  if (isLoading) {
    return (
      <AuthLayout title="Loading" subtitle="Checking your session..." />
    );
  }

  return isAllowed ? <Outlet /> : <Navigate to={redirectPath} replace />;
};

export default PrivateRoute;
