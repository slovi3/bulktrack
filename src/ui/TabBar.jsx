import { Link, useLocation } from "react-router-dom";
import { Home, Scale, Dumbbell, Settings } from "lucide-react";

function TabItem({ to, label, icon, active }) {
  const Icon = icon;

  return (
    <Link to={to} className={`bt-navItem ${active ? "active" : ""}`}>
      <Icon size={18} />
      <span>{label}</span>
    </Link>
  );
}

export default function TabBar() {
  const { pathname } = useLocation();

  return (
    <nav className="bt-bottomnav">
      <div className="bt-navRow">
        <TabItem
          to="/dashboard"
          label="Ana"
          icon={Home}
          active={pathname.startsWith("/dashboard")}
        />
        <TabItem
          to="/kilo"
          label="Kilo"
          icon={Scale}
          active={pathname.startsWith("/kilo")}
        />
        <TabItem
          to="/antrenman"
          label="Spor"
          icon={Dumbbell}
          active={pathname.startsWith("/antrenman")}
        />
        <TabItem
          to="/aliskanlik"
          label="Rutin"
          icon={Settings}
          active={pathname.startsWith("/aliskanlik")}
        />
      </div>
    </nav>
  );
}