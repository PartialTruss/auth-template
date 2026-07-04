import type { ButtonProps } from "./types";

const Button = ({ type, text, ...props }: ButtonProps) => {
  return (
    <>
      <button
        className="bg-[#1D3557] text-white px-4 py-3 w-full md:max-w-md disabled:opacity-50 rounded-lg cursor-pointer disabled:cursor-not-allowed transition-colors"
        type={type}
        {...props}
      >
        {text}
      </button>
    </>
  );
};

export default Button;
