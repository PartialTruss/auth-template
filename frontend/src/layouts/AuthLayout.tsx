import { Link } from "react-router-dom";
import brandLogo from "../assets/Images/brand_logo.svg";
import type { AuthLayoutProps } from "./types";

const AuthLayout: React.FC<AuthLayoutProps> = ({
  title,
  subtitle,
  children,
  footer,
  error,
  mainLogo,
}) => {
  return (
    <main className="flex justify-evenly items-center bg-[#EDF6F9]/18 w-full min-h-screen ">
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        {error && (
          <p
            className="text-red-500 mb-3 w-full max-w-sm text-center text-sm"
            role="alert"
          >
            {error}
          </p>
        )}
        <div className="flex flex-col w-full max-w-sm">
          <section className="flex justify-center">
            <img src={brandLogo} alt="brandLogo" className="w-[20%]" />
          </section>
          <h1 className="text-[2.37rem] font-myfont text-[#006D77] mb-2 mt-2">
            {title}
          </h1>
          <p className="text-[#006D77]">{subtitle}</p>
          {children}
        </div>
        {footer && (
          <p className="mt-6 text-center">
            <span className="text-[#00363A]/60">{footer.text}</span>{" "}
            <Link
              to={footer.linkTo}
              className="text-[#006D77] font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-[#006D77] focus:ring-offset-1 rounded"
            >
              {footer.linkText}
            </Link>
          </p>
        )}
      </div>
      <div className="hidden md:block h-screen bg-[#00363A]/25 w-0.5 shrink-0" />
      <div className="hidden md:flex items-center justify-center flex-1 max-w-md">
        <img
          src={mainLogo}
          alt=""
          className="h-80 lg:h-112 w-auto object-contain"
        />
      </div>
    </main>
  );
};

export default AuthLayout;
