import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";

export default function RequireAuth({ children }) {
  const { user, booting } = useAuth();
  const location = useLocation();

  if (booting) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}