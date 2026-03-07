import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout";
import RequireAuth from "../auth/RequireAuth";

import Dashboard from "../pages/Dashboard";
import Weight from "../pages/Weight";
import Workout from "../pages/Workout";
import Habits from "../pages/Habits";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Onboarding from "../pages/Onboarding";

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected but no layout */}
      <Route
        path="/onboarding"
        element={
          <RequireAuth>
            <Onboarding />
          </RequireAuth>
        }
      />

      {/* Protected + Layout */}
      <Route
        path="/"
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="kilo" element={<Weight />} />
        <Route path="antrenman" element={<Workout />} />
        <Route path="aliskanlik" element={<Habits />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}