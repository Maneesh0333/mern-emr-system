import { Link, useLocation } from "react-router-dom";

type propsTypes = {
  id: string;
  icon: string;
  label: string;
  badge?: string;
  path: string;
};

export default function NavItem({ id, icon, label, badge, path }: propsTypes) {
  const { pathname } = useLocation();
  return (
    <Link
      to={path}
      className={`group flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition w-full
        ${
          pathname === path
            ? "bg-[#C4632A]/15 text-[#C4632A]"
            : "text-white/80 hover:bg-white/10 hover:text-white"
        }`}
    >
      <span className="text-lg">{icon}</span>
      <span className="flex-1 text-left">{label}</span>
      {badge && (
        <span className="text-[11px] bg-[#C4632A] text-white px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </Link>
  );
}
