import google_icon from "../../assets/Images/Google.svg";
import type { GoogleUrlProps } from "./types";

const GoogleButton = ({ googleUrl, text }: GoogleUrlProps) => {
  return (
    <>
      <button
        type="button"
        disabled={!googleUrl}
        onClick={() => (window.location.href = googleUrl)}
        className="flex justify-center gap-2.5 items-center bg-[#1D3557] px-4 py-3 w-full mt-5 rounded-lg text-[#F1FAEE] hover:bg-[#1D3557]/85 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        <img src={google_icon} alt="" />
        {text}
      </button>
    </>
  );
};

export default GoogleButton;
