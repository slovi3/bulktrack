import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

export default function Login() {
  const { login, user } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();

  const from = loc.state?.from || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    if (user) nav("/dashboard");
  }, [user, nav]);

  const onSubmit = (e) => {
    e.preventDefault();
    setErr("");
    try {
      const u = login({ email, password });
      const p = u?.profile || {};
      if (!p.fullName || !p.goal) nav("/onboarding");
      else nav(from);
    } catch (ex) {
      setErr(ex.message || "Giriş başarısız.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl">
        <h1 className="text-xl font-semibold">Giriş Yap</h1>
        <p className="text-sm opacity-70 mt-1">BulkTrack hesabına giriş yap.</p>

        {err && (
          <div className="mt-4 rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-sm">
            {err}
          </div>
        )}

        <form onSubmit={onSubmit} className="mt-5 space-y-3">
          <input
            className="w-full rounded-xl bg-black/30 border border-white/10 p-3 outline-none"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />
          <input
            className="w-full rounded-xl bg-black/30 border border-white/10 p-3 outline-none"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
          />

          <button className="w-full rounded-xl p-3 bg-white/10 hover:bg-white/15 border border-white/10">
            Giriş
          </button>

          <button
            type="button"
            onClick={() => nav("/register")}
            className="w-full text-sm opacity-80 hover:opacity-100"
          >
            Hesabın yok mu? Kayıt ol
          </button>
        </form>
      </div>
    </div>
  );
}