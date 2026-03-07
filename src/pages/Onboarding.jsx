import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

export default function Onboarding() {

  const { updateProfile } = useAuth();
  const navigate = useNavigate();

  const [height,setHeight] = useState("");
  const [weight,setWeight] = useState("");
  const [target,setTarget] = useState("");
  const [days,setDays] = useState("");

  function handleSubmit(e){
    e.preventDefault();

    updateProfile({
      heightCm: Number(height),
      weightKg: Number(weight),
      targetKg: Number(target),
      trainingDays: Number(days)
    });

    navigate("/dashboard");
  }

  return (
    <div className="bt-container bt-center" style={{height:"100vh"}}>

      <div className="bt-card" style={{width:"380px"}}>

        <div className="bt-stack">

          <div>
            <h1 className="bt-h1">Profilini oluştur</h1>
            <p className="bt-sub">BulkTrack sana özel çalışsın</p>
          </div>

          <form className="bt-stack" onSubmit={handleSubmit}>

            <input
              className="bt-input"
              placeholder="Boy (cm)"
              value={height}
              onChange={(e)=>setHeight(e.target.value)}
            />

            <input
              className="bt-input"
              placeholder="Başlangıç kilo"
              value={weight}
              onChange={(e)=>setWeight(e.target.value)}
            />

            <input
              className="bt-input"
              placeholder="Hedef kilo"
              value={target}
              onChange={(e)=>setTarget(e.target.value)}
            />

            <input
              className="bt-input"
              placeholder="Haftada kaç gün spor"
              value={days}
              onChange={(e)=>setDays(e.target.value)}
            />

            <button className="bt-btn primary">
              Başla
            </button>

          </form>

        </div>

      </div>

    </div>
  )
}