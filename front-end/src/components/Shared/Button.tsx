type ButtonProps = {
  label: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
  isLoading?: boolean;
};

function Button({ label, onClick, type = "button", disabled=false, className="", isLoading = false }: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${disabled? "cursor-not-allowed opacity-80": "cursor-pointer hover:bg-[var(--clay-light-dark)]"} relative flex items-center justify-center px-4 py-2 rounded-lg bg-[var(--clay)] text-white text-sm font-semibold ${className}`}
    >
      {/* Keep text but hide it while loading to preserve width */}
      <span className={isLoading ? "opacity-0" : "opacity-100"}>
        {label}
      </span>
      {isLoading && (
        <span className="absolute flex">
          <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
        </span>
      )}
    </button>
  );
}

export default Button;