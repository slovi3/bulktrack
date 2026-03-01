import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function RequireAuth({ children }) {
  const { user, booting } = useAuth();
  const location = useLocation();

  if (booting) return null; // istersek loader ekleriz
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;

  return children;
}