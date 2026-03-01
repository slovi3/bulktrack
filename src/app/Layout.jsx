import { Outlet } from "react-router-dom";
import TabBar from "../ui/TabBar.jsx";

export default function Layout() {
  return (
    <div className="min-h-screen">
      {/* TOP BAR / HEADER */}
      <div className="w-full bg-gradient-to-r from-purple-600 to-purple-800">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex flex-col leading-tight">
            <div className="text-white font-semibold text-sm">Dashboard</div>
            <div className="text-white/80 text-xs">BulkTrack</div>
          </div>

          <button className="text-white/90 text-xs px-3 py-1 rounded-full bg-white/10 border border-white/15 hover:bg-white/15">
            Premium
          </button>
        </div>
      </div>

      {/* PAGE CONTENT */}
      <main className="max-w-6xl mx-auto px-4 py-6 pb-24">
        <Outlet />
      </main>

      {/* BOTTOM TAB BAR */}
      <TabBar />
    </div>
  );
}