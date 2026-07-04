import { Link } from "react-router-dom";
import Image from "../assets/Images/Image2.png";
import logo from "../assets/Images/logo.svg";
import type { AuthLayoutProps } from "./types";

const AuthLayout = ({
  title,
  subtitle,
  children,
  footer,
  error,
}: AuthLayoutProps) => {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center bg-[#F1FAEE] md:flex-row md:h-screen lg:min-h-screen lg:justify-around">
      <img src={logo} alt="sample-logo" className="auth-logo" />

      <div className="flex w-full flex-col px-5 py-16 sm:px-6 sm:py-20 md:px-16 md:py-12 lg:w-[90%] lg:px-24">
        <div className="mx-auto flex w-full max-w-full flex-col md:max-w-xs lg:max-w-md">
          <div className="text-center">
            <h1 className="auth-title">{title}</h1>
            {subtitle && (
              <p className="auth-subtitle mt-2 sm:mt-3">{subtitle}</p>
            )}
          </div>

          {error && (
            <p
              className="auth-error mt-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-center"
              role="alert"
            >
              {error}
            </p>
          )}

          {children && <div className="w-full">{children}</div>}

          {footer && (
            <p className="auth-footer mt-8 text-center">
              <span>{footer.text}</span>{" "}
              <Link
                to={footer.linkTo}
                className="font-medium text-[#1D3557] hover:underline focus:outline-none focus:ring-2 focus:ring-[#006D77] focus:ring-offset-1 rounded"
              >
                {footer.linkText}
              </Link>
            </p>
          )}
        </div>
      </div>

      <div
        className="hidden min-h-dvh bg-cover bg-center bg-no-repeat lg:block lg:w-full"
        style={{ backgroundImage: `url(${Image})` }}
        aria-hidden="true"
      />
    </main>
  );
};

export default AuthLayout;
