import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import TabBar from "../ui/TabBar";

export default function Layout({ authed, onLogout }) {
  const nav = useNavigate();
  const { pathname } = useLocation();

  const titleMap = {
    "/dashboard": { title: "Dashboard", subtitle: "BulkTrack", icon: "home" },
    "/kilo": { title: "Kilo", subtitle: "BulkTrack", icon: "scale" },
    "/antrenman": { title: "Antrenman", subtitle: "BulkTrack", icon: "dumbbell" },
    "/aliskanlik": { title: "Alışkanlık", subtitle: "BulkTrack", icon: "check" },
  };

  const meta = titleMap[pathname] || { title: "BulkTrack", subtitle: "Premium panel", icon: "home" };

  return (
    <div className="app-shell">
      {/* TOP BAR */}
      <header className="topbar">
        <div className="topbar__left" onClick={() => nav("/dashboard")} role="button" tabIndex={0}>
          <div className="topbar__icon" aria-hidden="true">
            {meta.icon === "home" && "⌂"}
            {meta.icon === "scale" && "⚖"}
            {meta.icon === "dumbbell" && "🏋"}
            {meta.icon === "check" && "✓"}
          </div>
          <div className="topbar__titles">
            <div className="topbar__title">{meta.title}</div>
            <div className="topbar__subtitle">{meta.subtitle}</div>
          </div>
        </div>

        <div className="topbar__right">
          <span className="pill">Premium</span>

          {/* ÇIKIŞ: authed true iken her sayfada görünür */}
          {authed && (
            <button className="iconbtn" onClick={onLogout} title="Çıkış">
              ⎋
            </button>
          )}
        </div>
      </header>

      {/* CONTENT */}
      <main className="app-content">
        <Outlet />
      </main>

      {/* BOTTOM TAB */}
      <TabBar />
    </div>
  );
}