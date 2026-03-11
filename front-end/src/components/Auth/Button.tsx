type ButtonProps = {
  isValid: boolean;
  label: string;
  type?: "submit" | "reset" | "button";
  isLoading?: boolean;
};

function Button({
  isValid,
  label,
  type = "submit",
  isLoading = false,
}: ButtonProps) {
  return (
    <button
      disabled={!isValid || isLoading}
      type={type}
      className={`${!isValid || isLoading ? "cursor-not-allowed opacity-80" : "hover:opacity-95 transition cursor-pointer"} relative bg-gradient-to-r from-[var(--clay)] to-[var(--clay-light-dark)] w-full py-4 rounded-xl
              text-white font-bold
              shadow-[0_8px_24px_rgba(196,99,42,0.35)]
              `}
    >
      {/* Keep text but hide it while loading to preserve width */}
      <span className={isLoading ? "opacity-0" : "opacity-100"}>
        {label}
      </span>

      {isLoading && (
        <span className="absolute top-0 flex items-center justify-center w-full h-full">
          <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
        </span>
      )}
    </button>
  );
}

export default Button;
