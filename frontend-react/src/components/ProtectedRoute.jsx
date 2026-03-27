import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="dash-loading"><i className="fa-solid fa-spinner fa-spin"></i></div>;
  if (!user) return <Navigate to="/" replace />;
  if (role && user.role !== role) {
    return <Navigate to={user.role === "ADMIN" ? "/dashboard/admin" : "/dashboard/client"} replace />;
  }

  return children;
}
