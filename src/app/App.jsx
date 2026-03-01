import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./Layout";

import Dashboard from "../pages/Dashboard";
import Weight from "../pages/Weight";
import Workout from "../pages/Workout";
import Habits from "../pages/Habits";
import Login from "../pages/Login";
import Onboarding from "../pages/Onboarding";

const LS_AUTH = "bulktrack_auth";
const LS_PROFILE = "bulktrack_profile";

function isAuthed() {
  return localStorage.getItem(LS_AUTH) === "1";
}

function hasProfile() {
  try {
    const p = JSON.parse(localStorage.getItem(LS_PROFILE) || "null");
    return !!(p && p.heightCm && p.weightKg && p.goalWeightKg);
  } catch {
    return false;
  }
}

function RequireAuth({ children }) {
  if (!isAuthed()) return <Navigate to="/login" replace />;
  return children;
}

function RequireOnboarding({ children }) {
  // auth var ama profil yoksa onboarding'e zorla
  if (!hasProfile()) return <Navigate to="/onboarding" replace />;
  return children;
}

export default function App() {
  const [authed, setAuthed] = useState(isAuthed());

  // diğer tabda login/logout olursa sync
  useEffect(() => {
    const onStorage = () => setAuthed(isAuthed());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<Login onAuthed={() => setAuthed(true)} />} />

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
          authed ? (
            // authed ise dashboard'a git, onboarding guard zaten /dashboard'da devreye girecek
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }
      >
        <Route
          path="/dashboard"
          element={
            <RequireOnboarding>
              <Dashboard />
            </RequireOnboarding>
          }
        />
        <Route
          path="/kilo"
          element={
            <RequireOnboarding>
              <Weight />
            </RequireOnboarding>
          }
        />
        <Route
          path="/antrenman"
          element={
            <RequireOnboarding>
              <Workout />
            </RequireOnboarding>
          }
        />
        <Route
          path="/aliskanlik"
          element={
            <RequireOnboarding>
              <Habits />
            </RequireOnboarding>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to={authed ? "/dashboard" : "/login"} replace />} />
    </Routes>
  );
}