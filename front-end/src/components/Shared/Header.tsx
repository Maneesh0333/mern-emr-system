import type { ReactNode } from "react";

type HeaderProps = {
  title: string;
  description?: string;
  name?: string;
  children?: ReactNode;
};

function Header({ title, description, name, children }: HeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="text-2xl font-bold">
          {title}{" "}
          {name && (
            <>
              <em className="not-italic text-[#C4632A]">{name}</em> 👋
            </>
          )}
        </div>
        <div className="text-sm text-[#6B4A2D]">{description}</div>
      </div>

      {children}
    </div>
  );
}

export default Header;
