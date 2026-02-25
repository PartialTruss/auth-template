import type { GoogleUrlProps } from "./types";

const GoogleButton = ({ googleUrl, text }: GoogleUrlProps) => {
  return (
    <>
      <button
        type="button"
        disabled={!googleUrl}
        onClick={() => (window.location.href = googleUrl)}
        className="border px-4 py-3 w-full mt-5 border-[#006D77] rounded-lg text-[#006D77] hover:bg-[#006D77]/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {text}
      </button>
    </>
  );
};

export default GoogleButton;
