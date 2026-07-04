import { useId, useState } from "react";
import eye from "../../assets/Images/Eye.svg";
import eye_off from "../../assets/Images/eye-off.svg";
import type { InputProps } from "./types";

const Input = ({ type, label, className, ...props }: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const generatedId = useId();
  const inputId = props.id ?? generatedId;
  const isPasswordType = type === "password";
  const inputType = isPasswordType && showPassword ? "text" : type;

  return (
    <div className="mb-2 w-full md:max-w-md">
      <label
        htmlFor={inputId}
        className="mb-2 block text-sm font-medium text-[#1D3557]"
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={inputId}
          type={inputType}
          {...props}
          className={`w-full rounded-lg border-2 border-[#1D3557]/40 p-2 pr-10 text-base md:p-2.5 ${className ?? ""}`}
        />

        {isPasswordType && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <img
              src={showPassword ? eye_off : eye}
              alt=""
              className="h-5 w-5 cursor-pointer"
            />
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;
