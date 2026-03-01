import { Link, useLocation } from "react-router-dom";
import { Home, Scale, Dumbbell, Settings } from "lucide-react";

function TabItem({ to, label, icon: Icon, active }) {
  return (
    <Link
      to={to}
      className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all ${
        active
          ? "text-neon bg-[rgba(var(--neon),0.10)] border border-[rgba(var(--neon),0.25)] shadow-[0_0_16px_rgba(57,255,20,0.45)]"
          : "text-white/60 hover:text-white hover:bg-white/5 border border-transparent"
      }`}
    >
      {Icon ? (
        <Icon
          size={18}
          className={active ? "drop-shadow-[0_0_12px_rgba(57,255,20,0.45)]" : ""}
        />
      ) : null}

      <span className="text-[11px]">{label}</span>
    </Link>
  );
}

export default function TabBar() {
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-3 left-0 right-0 z-50">
      <div className="mx-auto w-[min(520px,calc(100%-24px))] rounded-3xl border border-white/10 bg-[rgba(10,12,16,0.75)] backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.45)]">
        <div className="grid grid-cols-4 gap-2 p-2">
          <TabItem
            to="/dashboard"
            label="Ana"
            icon={Home}
            active={pathname === "/dashboard"}
          />
          <TabItem to="/kilo" label="Kilo" icon={Scale} active={pathname === "/kilo"} />
          <TabItem
            to="/antrenman"
            label="Spor"
            icon={Dumbbell}
            active={pathname === "/antrenman"}
          />
          <TabItem
            to="/aliskanlik"
            label="Rutin"
            icon={Settings}
            active={pathname === "/aliskanlik"}
          />
        </div>
      </div>
    </nav>
  );
}