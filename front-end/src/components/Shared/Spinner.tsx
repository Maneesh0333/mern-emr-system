type SpinnerProps = {
  className?: string;
};

function Spinner({ className }: SpinnerProps) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <span className={`w-8 h-8 border-3 border-current border-t-transparent rounded-full animate-spin ${className}`}></span>
    </div>
  );
}

export default Spinner;
