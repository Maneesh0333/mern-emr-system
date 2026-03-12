import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";

interface Props {
  children: React.ReactNode;
  requiredRole?: "SUPER_ADMIN" | "DOCTOR" | "RECEPTIONIST";
}

const ProtectedRoute = ({ children, requiredRole }: Props) => {
  const { accessToken, user, loading } = useAuthStore();

  if (loading) return <div>Loading...</div>;

  if (!accessToken) return <Navigate to="/auth" replace />;

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;