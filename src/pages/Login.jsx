import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      login({ email, password });
      navigate("/dashboard");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f1220] text-white">
      <div className="w-full max-w-sm bg-[#1a1f38] p-6 rounded-xl shadow-lg">

        <h1 className="text-2xl font-bold mb-2">BulkTrack</h1>
        <p className="text-gray-400 mb-6">Hesabına giriş yap</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">

          <input
            type="email"
            placeholder="Email"
            className="p-2 rounded bg-[#0f1220] border border-gray-600"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Şifre"
            className="p-2 rounded bg-[#0f1220] border border-gray-600"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="bg-purple-600 hover:bg-purple-700 p-2 rounded mt-2">
            Giriş Yap
          </button>

        </form>

        <p className="text-sm text-gray-400 mt-4">
          Hesabın yok mu?{" "}
          <Link to="/register" className="text-purple-400">
            Kayıt ol
          </Link>
        </p>

      </div>
    </div>
  );
}