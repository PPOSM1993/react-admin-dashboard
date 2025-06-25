import { Navigate, useLocation } from "react-router-dom";
import { getCurrentUser } from "../utils/auth";

export default function ProtectedRoute({ children, roles = [] }) {
  const user = getCurrentUser();
  const location = useLocation();

  if (!user) return <Navigate to="/login" state={{ from: location }} />;
  if (roles.length && !roles.includes(user.role)) return <Navigate to="/" />;

  return children;
}
