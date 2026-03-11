import { useEffect, type ReactNode } from "react";

type SideSheetProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  discription?: string;
};

export default function SideSheet({
  open,
  onClose,
  title,
  children,
  discription
}: SideSheetProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed top-0 left-0 w-screen h-screen bg-[var(--ink)]/30 backdrop-blur-[1px] z-40"
          onClick={onClose}
        />
      )}

      {/* Side Sheet */}
      <div
        className={`flex flex-col fixed top-0 right-0 h-screen w-80 p-4 bg-white shadow-xl z-50 rounded-l-lg transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <header className="flex justify-between items-start mb-5">
          <div>
            <h2 className="text-lg font-semibold text-[var(--earth)]">{title}</h2>
            <p className="text-[11px] font-normal mt-1 text-[var(--earth-mid)]">{discription}</p>
          </div>

          <button onClick={onClose} className="px-2 py-1 border border-[var(--border-1)] rounded-md text-sm font-medium cursor-pointer text-[var(--ink)]/50 hover:text-[var(--ink)]/90">
            ✕
          </button>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </>
  );
}
