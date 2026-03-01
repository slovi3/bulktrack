import React from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Home, Dumbbell, Scale, CheckSquare, LogOut } from "lucide-react";

const routeMeta = (pathname) => {
  if (pathname.startsWith("/dashboard")) return { title: "Dashboard", icon: Home };
  if (pathname.startsWith("/kilo")) return { title: "Kilo", icon: Scale };
  if (pathname.startsWith("/antrenman")) return { title: "Antrenman", icon: Dumbbell };
  if (pathname.startsWith("/aliskanlik")) return { title: "Alışkanlık", icon: CheckSquare };
  if (pathname.startsWith("/onboarding")) return { title: "İlk Kurulum", icon: Home };
  return { title: "BulkTrack", icon: Home };
};

export default function Layout({ onLogout }) {
  const location = useLocation();
  const meta = routeMeta(location.pathname);
  const TitleIcon = meta.icon;

  const hideNav = location.pathname.startsWith("/login");
  const hideTopbar = location.pathname.startsWith("/login");

  return (
    <div className="bt-app" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Top Bar */}
      {!hideTopbar && (
        <header className="bt-topbar">
          <div className="bt-topbarRow">
            <div className="bt-brand">
              <TitleIcon size={20} />
              <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
                <div className="bt-title">{meta.title}</div>
                <small>BulkTrack</small>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span className="bt-chip">Premium</span>

              {/* Logout (App.jsx onLogout verirse çalışır) */}
              {typeof onLogout === "function" && (
                <button
                  className="bt-btn small ghost"
                  onClick={onLogout}
                  title="Çıkış"
                  type="button"
                  style={{ padding: "0 10px" }}
                >
                  <LogOut size={16} />
                </button>
              )}
            </div>
          </div>
        </header>
      )}

      {/* Page */}
      <main
        className="bt-container"
        style={{
          flex: 1,
          padding: "16px 16px 86px", // alttaki navbar boşluğu
        }}
      >
        <Outlet />
      </main>

      {/* Bottom Nav */}
      {!hideNav && (
        <nav className="bt-bottomnav">
          <div className="bt-navRow">
            <Tab to="/dashboard" label="Dashboard" Icon={Home} />
            <Tab to="/kilo" label="Kilo" Icon={Scale} />
            <Tab to="/antrenman" label="Antrenman" Icon={Dumbbell} />
            <Tab to="/aliskanlik" label="Alışkanlık" Icon={CheckSquare} />
          </div>
        </nav>
      )}
    </div>
  );
}

function Tab({ to, label, Icon }) {
  const IconComp = Icon;

  return (
    <NavLink
      to={to}
      className={({ isActive }) => `bt-navItem ${isActive ? "active" : ""}`}
      end={to === "/dashboard"}
    >
      <IconComp size={20} />
      <span>{label}</span>
    </NavLink>
  );
}