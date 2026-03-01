import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import Layout from "./Layout";

import Dashboard from "../pages/Dashboard";
import Weight from "../pages/Weight";
import Workout from "../pages/Workout";
import Habits from "../pages/Habits";
import Login from "../pages/Login";
import Onboarding from "../pages/Onboarding";

import {
  LS_AUTH,
  hasProfile,
  clearAuth,
} from "../ui/storage";

function isAuthed() {
  return localStorage.getItem(LS_AUTH) === "1";
}

function RequireAuth({ children }) {
  if (!isAuthed()) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const nav = useNavigate();
  const [authed, setAuthed] = useState(isAuthed());

  // başka tab'da login/logout olursa sync
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === LS_AUTH) setAuthed(isAuthed());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // giriş yaptıktan sonra profil yoksa onboarding
  useEffect(() => {
    if (!authed) return;
    if (!hasProfile()) nav("/onboarding", { replace: true });
  }, [authed, nav]);

  const onLogout = () => {
    // "geç açılıyor" hissi genelde replace + state update gecikmesinden
    // önce state'i düşür, sonra navigate et (anında tepki)
    setAuthed(false);
    clearAuth();
    nav("/login", { replace: true });
  };

  const onAuthed = () => setAuthed(true);

  return (
    <Routes>
      <Route path="/login" element={<Login onAuthed={onAuthed} />} />

      <Route
        path="/onboarding"
        element={
          <RequireAuth>
            <Onboarding />
          </RequireAuth>
        }
      />

      <Route
        path="/"
        element={
          <RequireAuth>
            <Layout authed={authed} onLogout={onLogout} />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="kilo" element={<Weight />} />
        <Route path="antrenman" element={<Workout />} />
        <Route path="aliskanlik" element={<Habits />} />
      </Route>

      <Route path="*" element={<Navigate to={authed ? "/dashboard" : "/login"} replace />} />
    </Routes>
  );
}