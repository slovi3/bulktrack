import { Outlet } from "react-router-dom";
import TabBar from "../ui/TabBar";

export default function Layout() {
  return (
    <div className="min-h-screen bg-black text-white pb-24">
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Outlet />
      </main>
      <TabBar />
    </div>
  );
}