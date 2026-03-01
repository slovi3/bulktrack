import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout.jsx";

import RequireAuth from "../auth/RequireAuth.jsx";

import Dashboard from "../pages/Dashboard.jsx";
import Weight from "../pages/Weight.jsx";
import Workout from "../pages/Workout.jsx";
import Habits from "../pages/Habits.jsx";

import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import Onboarding from "../pages/Onboarding.jsx";

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected but no Layout */}
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
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/kilo" element={<Weight />} />
        <Route path="/antrenman" element={<Workout />} />
        <Route path="/aliskanlik" element={<Habits />} />
      </Route>

      {/* Default */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}