import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!email.trim() || !password.trim() || !password2.trim()) {
      alert("Tüm alanları doldur.");
      return;
    }

    if (password !== password2) {
      alert("Şifreler eşleşmiyor.");
      return;
    }

    try {
      register({ email, password });
      navigate("/onboarding");
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="bt-container bt-center" style={{ height: "100vh" }}>
      <div className="bt-card" style={{ width: "360px" }}>
        <div className="bt-stack">
          <div>
            <h1 className="bt-h1">BulkTrack</h1>
            <p className="bt-sub">Yeni hesap oluştur</p>
          </div>

          <form className="bt-stack" onSubmit={handleSubmit}>
            <input
              className="bt-input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              className="bt-input"
              type="password"
              placeholder="Şifre"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <input
              className="bt-input"
              type="password"
              placeholder="Şifre Tekrar"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
            />

            <button className="bt-btn primary" type="submit">
              Kayıt Ol
            </button>
          </form>

          <p className="bt-sub">
            Zaten hesabın var mı? <Link to="/login">Giriş yap</Link>
          </p>
        </div>
      </div>
    </div>
  );
}