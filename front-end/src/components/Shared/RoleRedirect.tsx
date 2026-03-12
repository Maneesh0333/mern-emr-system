import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";

const RoleRedirect = () => {
  const { accessToken, user, loading } = useAuthStore();

  if (loading) return <div>Loading...</div>;

  console.log(accessToken, "-------")
  if (!accessToken) return <Navigate to="/auth" replace />;
  if (!user) return <div>Loading...</div>;

  console.log(user, "user-------")
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