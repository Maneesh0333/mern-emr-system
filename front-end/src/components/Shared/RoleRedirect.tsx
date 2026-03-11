import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";

const RoleRedirect = () => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.accessToken);


  if (!token) return <Navigate to="/auth" replace />;

  switch (user?.role) {
    case "SUPER_ADMIN":
      return <Navigate to="/admin" replace />;
    case "DOCTOR":
      return <Navigate to="/doctor" replace />;
    case "RECEPTIONIST":
      return <Navigate to="/receptionist" replace />;
    default:
      return <Navigate to="/auth" replace />;
  }
};

export default RoleRedirect;