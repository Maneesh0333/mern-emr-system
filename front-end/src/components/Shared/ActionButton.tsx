type ActionButtonProps = {
  onClick?: () => void;
  isLoading?: boolean;
  variant?:
    | "success"
    | "danger"
    | "warning"
    | "primary"
    | "secondary"
    | "outline"
    | "ghost";
  children: React.ReactNode;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
};

export function ActionButton({
  onClick,
  isLoading = false,
  variant = "primary",
  children,
  disabled = false,
  type = "button",
}: ActionButtonProps) {
  const baseStyles =
    "relative inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed";

  const variantStyles: Record<string, string> = {
    success: "bg-green-100 text-green-700 hover:bg-green-200",
    danger: "bg-red-100 text-red-700 hover:bg-red-200",
    warning: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
    primary: "bg-orange-500 text-white hover:bg-orange-600",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50",
    ghost: "text-gray-700 hover:bg-gray-100",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`${baseStyles} ${variantStyles[variant]} cursor-pointer text-xs`}
    >
      {/* Keep text but hide it while loading to preserve width */}
      <span className={isLoading ? "opacity-0" : "opacity-100"}>
        {children}
      </span>

      {isLoading && (
        <span className="absolute flex">
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
        </span>
      )}
    </button>
  );
}
