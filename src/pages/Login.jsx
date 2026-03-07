import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

export default function Login() {

  const { login } = useAuth();
  const navigate = useNavigate();

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  function handleSubmit(e){
    e.preventDefault();

    try{
      login({email,password});
      navigate("/dashboard");
    }catch(err){
      alert(err.message);
    }
  }

  return (

    <div className="bt-container bt-center" style={{height:"100vh"}}>

      <div className="bt-card" style={{width:"360px"}}>

        <div className="bt-stack">

          <div>
            <h1 className="bt-h1">BulkTrack</h1>
            <p className="bt-sub">Hesabına giriş yap</p>
          </div>

          <form className="bt-stack" onSubmit={handleSubmit}>

            <input
              className="bt-input"
              placeholder="Email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />

            <input
              className="bt-input"
              placeholder="Şifre"
              type="password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            />

            <button className="bt-btn primary">
              Giriş Yap
            </button>

          </form>

          <p className="bt-sub">
            Hesabın yok mu? <Link to="/register">Kayıt ol</Link>
          </p>

        </div>

      </div>

    </div>
  )
}