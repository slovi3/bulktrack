import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    setErr("");
    try {
      register({ email, password });
      nav("/onboarding");
    } catch (ex) {
      setErr(ex.message || "Kayıt başarısız.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl">
        <h1 className="text-xl font-semibold">Kayıt Ol</h1>
        <p className="text-sm opacity-70 mt-1">Yeni BulkTrack hesabı oluştur.</p>

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
            Devam
          </button>

          <button
            type="button"
            onClick={() => nav("/login")}
            className="w-full text-sm opacity-80 hover:opacity-100"
          >
            Zaten hesabın var mı? Giriş yap
          </button>
        </form>
      </div>
    </div>
  );
}