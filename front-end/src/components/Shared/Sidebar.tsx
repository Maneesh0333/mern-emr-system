import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { SidebarNavSection } from "../../pages/Admin";
import { useAuthStore } from "../../stores/authStore";
import NavItem from "./NavItem";
import axiosApi from "../../lib/axios";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";

type SidebarProps = {
  sidebarNav: SidebarNavSection[];
};

type ResponseType = {
  success: boolean;
  message: string;
};

export default function Sidebar({ sidebarNav }: SidebarProps) {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const queryClient = useQueryClient();

  const logoutMutation = useMutation<
    ResponseType,
    AxiosError<ResponseType>,
    void
  >({
    mutationFn: async () => {
      const res = await axiosApi.post<ResponseType>("/auth/logout");
      return res.data;
    },
    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.message || "Logout Failed.");
        return;
      }
      logout();
      queryClient.clear();
      toast.success("Logout Success.");
    },
    onError: (err) => {
      if (!err.response) {
        toast.error("Network error, please try again later.");
        return;
      }
      toast.error(err.response.data.message || "Logout Failed.");
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <aside className="w-72 bg-[#2C1A0E] text-white flex flex-col h-screen">
      {/* TOP */}
      <div className="px-6 py-5 border-b border-white/10">
        <div className="flex flex-col text-2xl font-black mb-6">
          <span>
            MedCore<span className="text-[var(--clay)]">EMR</span>
          </span>
        </div>

        <div className="flex items-center gap-3 bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.08)] px-2.5 py-3 rounded-2xl">
          <div className="relative w-11 h-11 rounded-xl bg-[#C4632A] flex items-center justify-center text-lg">
            🧑‍💼
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#2C1A0E] rounded-full" />
          </div>

          <div>
            <div className="font-semibold leading-tight">{user?.name}</div>
            <div className="flex items-center gap-2 text-xs text-[rgba(255,255,255,0.4)]">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              {user?.role}
            </div>
          </div>
        </div>
      </div>

      {/* NAV */}
      <nav
        className="flex-1 overflow-y-auto px-3 py-4 space-y-6"
        style={{ scrollbarWidth: "none" }}
      >
        {/* MAIN */}

        {sidebarNav.map((item) => (
          <div key={item.title}>
            <div className="px-3 mb-2 text-[10px] uppercase tracking-wide text-white/40">
              {item.title}
            </div>

            <div className="space-y-1">
              {item.items.map((item) => (
                <NavItem
                  key={item.id}
                  id={item.id}
                  icon={item.icon}
                  label={item.label}
                  badge={item.badge}
                  path={item.path}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* LOGOUT */}
      <div className="p-3 border-t border-white/10">
        <button
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
          className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/40 hover:text-white hover:bg-white/10 rounded-lg w-full transition cursor-pointer disabled:opacity-50"
        >
          <span className="text-lg">🚪</span>
          {logoutMutation.isPending ? (
            <>
              <span className="flex items-center justify-center w-10">
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
              </span>
            </>
          ) : (
            "Logout"
          )}
        </button>
      </div>
    </aside>
  );
}
