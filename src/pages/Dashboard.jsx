import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dumbbell,
  CigaretteOff,
  Languages,
  BookOpen,
  CheckSquare,
  Scale,
  Flame,
  Ruler,
  Save,
  X,
  ArrowRight,
  HandHeart,
} from "lucide-react";

import useAppData from "../ui/useAppData";

function pad2(n) {
  return String(n).padStart(2, "0");
}
function toYMD(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}
function startOfWeekMonday(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}
function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}
function fmtDateShort(ymd) {
  const mm = ymd.slice(5, 7);
  const dd = ymd.slice(8, 10);
  return `${dd}.${mm}`;
}
function calcBMI(heightCm, weightKg) {
  const h = Number(heightCm) / 100;
  const w = Number(weightKg);
  if (!h || !w) return null;
  const bmi = w / (h * h);
  return Math.round(bmi * 10) / 10;
}

function Card({ children, style }) {
  return (
    <div className="bt-card" style={style}>
      {children}
    </div>
  );
}
function Badge({ children, style }) {
  return (
    <div className="bt-badge" style={style}>
      {children}
    </div>
  );
}

function ActionCard({ icon, title, sub, rightText, onClick, active }) {
  const IconComp = icon; // ESLint "unused" kesin susar

  return (
    <button
      className={`bt-action ${active ? "active" : ""}`}
      onClick={onClick}
      type="button"
    >
      <div className="left">
        <span className="bt-iconBox">
          {IconComp ? <IconComp size={18} /> : null}
        </span>
        <div className="txt">
          <div className="t">{title}</div>
          <div className="s">{sub}</div>
        </div>
      </div>

      <div className="right">
        {rightText ? <span className="pill">{rightText}</span> : null}
        <ArrowRight size={16} />
      </div>
    </button>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { today, profile, workouts, habitsToday, habitScore, workoutDoneToday, actions } =
    useAppData();

  // Toast
  const [toast, setToast] = useState(null);
  const showToast = (msg) => {
    setToast(msg);
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(null), 1500);
  };

  // Profil modal
  const [openProfile, setOpenProfile] = useState(false);
  const [pHeight, setPHeight] = useState(profile.heightCm || "");
  const [pWeight, setPWeight] = useState(profile.weightKg || "");
  const [pGoal, setPGoal] = useState(profile.goalWeightKg || "");

  const bmi = useMemo(
    () => calcBMI(profile.heightCm, profile.weightKg),
    [profile.heightCm, profile.weightKg]
  );

  const weekly = useMemo(() => {
    const start = startOfWeekMonday(new Date());
    const days = Array.from({ length: 7 }, (_, i) => toYMD(addDays(start, i)));
    const doneSet = new Set(workouts.map((w) => w.date));
    const count = days.filter((d) => doneSet.has(d)).length;
    return { days, doneSet, count };
  }, [workouts]);

  const goalDiff = useMemo(() => {
    const w = Number(profile.weightKg);
    const g = Number(profile.goalWeightKg);
    if (!w || !g) return null;
    return Math.round((g - w) * 10) / 10;
  }, [profile.weightKg, profile.goalWeightKg]);

  const dayDone = useMemo(() => {
    const habitsDone = habitScore.done; // 0-4
    const workoutDone = workoutDoneToday ? 1 : 0;
    const total = 5; // 4 habit + workout
    const done = habitsDone + workoutDone;
    const pct = Math.round((done / total) * 100);
    return { done, total, pct };
  }, [habitScore.done, workoutDoneToday]);

  const toggleHabit = (key, label) => {
    const val = actions.toggleHabitToday(key);
    showToast(label + (val ? " ✅" : " ❌"));
  };

  const onWorkoutQuick = () => {
    const added = actions.addWorkoutToday();
    showToast(added ? "Antrenman eklendi ✅" : "Bugün zaten kayıt var");
    navigate("/antrenman");
  };

  const onWeightQuick = () => {
    navigate("/kilo");
  };

  const onHabitsPage = () => {
    navigate("/aliskanlik");
  };

  const saveProfile = () => {
    actions.saveProfile({
      ...profile,
      heightCm: pHeight,
      weightKg: pWeight,
      goalWeightKg: pGoal,
    });
    showToast("Profil kaydedildi ✅");
    setOpenProfile(false);
  };

  return (
    <div className="bt-wrap">
      {/* Dashboard local styles */}
      <style>{`
        .bt-wrap{ display:grid; gap:14px; }

        .bt-card{
          border:1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          border-radius: 18px;
          padding: 14px;
        }
        .bt-row{
          display:flex;
          align-items:flex-start;
          justify-content:space-between;
          gap:12px;
        }
        .bt-title{ font-weight: 900; font-size: 15px; }
        .bt-sub{ font-size: 12px; opacity: .78; }

        .bt-badge{
          display:inline-flex;
          align-items:center;
          gap:8px;
          padding:6px 10px;
          border-radius:999px;
          border:1px solid rgba(255,255,255,0.12);
          background: rgba(0,0,0,0.18);
          font-size:12px;
          white-space:nowrap;
        }

        .bt-btn{
          display:flex;
          align-items:center;
          gap:10px;
          padding:10px 12px;
          border-radius:14px;
          border:1px solid rgba(255,255,255,0.10);
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.92);
          cursor:pointer;
        }
        .bt-btnPrimary{
          border-color: rgba(57,255,136,0.22);
          background: linear-gradient(180deg, rgba(57,255,136,0.12), rgba(124,58,237,0.08));
        }

        .bt-iconBox{
          width: 36px;
          height: 36px;
          border-radius: 14px;
          display:grid;
          place-items:center;
          border:1px solid rgba(255,255,255,0.10);
          background: rgba(0,0,0,0.22);
        }

        .bt-progress{
          height: 12px;
          border-radius: 999px;
          border:1px solid rgba(255,255,255,0.10);
          background: rgba(255,255,255,0.03);
          overflow:hidden;
        }
        .bt-progress > div{
          height:100%;
          width:0%;
          background: linear-gradient(90deg, rgba(57,255,136,0.85), rgba(124,58,237,0.85));
        }

        .bt-actionsGrid{
          margin-top: 12px;
          display:grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }
        @media (max-width: 820px){
          .bt-actionsGrid{ grid-template-columns: 1fr; }
        }

        .bt-action{
          width:100%;
          border-radius: 16px;
          border:1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          padding: 12px;
          cursor:pointer;
          color: rgba(255,255,255,0.92);
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap: 10px;
        }
        .bt-action:hover{
          background: rgba(255,255,255,0.05);
          border-color: rgba(255,255,255,0.12);
        }
        .bt-action.active{
          background: linear-gradient(180deg, rgba(57,255,136,0.12), rgba(124,58,237,0.08));
          border-color: rgba(57,255,136,0.22);
        }
        .bt-action .left{
          display:flex;
          align-items:center;
          gap: 12px;
          text-align:left;
        }
        .bt-action .txt{ display:flex; flex-direction:column; gap:2px; }
        .bt-action .t{ font-weight: 900; }
        .bt-action .s{ font-size: 12px; opacity:.78; }
        .bt-action .right{
          display:flex;
          align-items:center;
          gap: 10px;
          opacity:.95;
        }
        .bt-action .pill{
          font-size: 12px;
          padding: 4px 8px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(0,0,0,0.18);
          opacity: .9;
        }

        .bt-chipsRow{
          margin-top: 10px;
          display:flex;
          flex-wrap:wrap;
          gap:8px;
        }
        .bt-chip{
          display:inline-flex;
          align-items:center;
          gap:8px;
          padding:6px 10px;
          border-radius:999px;
          border:1px solid rgba(255,255,255,0.10);
          background: rgba(255,255,255,0.03);
          font-size:12px;
          cursor:pointer;
          user-select:none;
        }
        .bt-chip.on{
          border-color: rgba(57,255,136,0.22);
          background: rgba(57,255,136,0.10);
        }

        .bt-modalBg{
          position:fixed; inset:0; z-index:200;
          background: rgba(0,0,0,0.55);
          display:grid; place-items:center;
          padding: 16px;
        }
        .bt-modal{
          width: min(720px, 100%);
          border-radius: 18px;
          border:1px solid rgba(255,255,255,0.10);
          background: rgba(10,14,22,0.90);
          backdrop-filter: blur(10px);
          padding: 14px;
        }
        .bt-field{ display:grid; gap:6px; }
        .bt-input{
          width:100%;
          padding: 12px 12px;
          border-radius: 14px;
          border:1px solid rgba(255,255,255,0.10);
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.92);
          outline:none;
        }
        .bt-grid3{
          display:grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }
        @media (max-width: 820px){
          .bt-grid3{ grid-template-columns: 1fr; }
        }

        .bt-toast{
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 12px 16px;
          border-radius: 14px;
          background: linear-gradient(90deg, rgba(57,255,136,0.95), rgba(124,58,237,0.95));
          color: #000;
          font-weight: 900;
          z-index: 999;
          box-shadow: 0 10px 30px rgba(0,0,0,0.4);
          animation: fadeInOut 1.5s ease forwards;
        }
        @keyframes fadeInOut{
          0%{ opacity:0; transform: translateY(-10px); }
          10%{ opacity:1; transform: translateY(0); }
          90%{ opacity:1; }
          100%{ opacity:0; }
        }
      `}</style>

      {/* QUICK ACTIONS */}
      <Card>
        <div className="bt-row">
          <div>
            <div className="bt-title">Quick Actions</div>
            <div className="bt-sub">Bugün için tek tık</div>
          </div>
          <Badge>
            <Flame size={14} />
            Bu hafta <b>{weekly.count}/7</b>
          </Badge>
        </div>

        <div className="bt-actionsGrid">
          <ActionCard
            icon={Dumbbell}
            title="Bugün Antrenman"
            sub="1 kayıt = streak ilerler"
            rightText={workoutDoneToday ? "✅" : ""}
            onClick={onWorkoutQuick}
            active={workoutDoneToday}
          />

          <ActionCard
            icon={CigaretteOff}
            title="Sigara Yok"
            sub="Bugünü işaretle"
            rightText={habitsToday.noSmoking ? "✅" : ""}
            onClick={() => toggleHabit("noSmoking", "Sigara Yok")}
            active={habitsToday.noSmoking}
          />

          <ActionCard
            icon={Languages}
            title="İngilizce"
            sub="30 günlük sistem"
            rightText={habitsToday.english ? "✅" : ""}
            onClick={() => toggleHabit("english", "İngilizce")}
            active={habitsToday.english}
          />

          <ActionCard
            icon={BookOpen}
            title="Kitap"
            sub="Günlük okuma"
            rightText={habitsToday.reading ? "✅" : ""}
            onClick={() => toggleHabit("reading", "Kitap")}
            active={habitsToday.reading}
          />

          <ActionCard
            icon={HandHeart}
            title="Namaz / Dua"
            sub="Bugün tamamlandı mı?"
            rightText={habitsToday.prayer ? "✅" : ""}
            onClick={() => toggleHabit("prayer", "Namaz")}
            active={habitsToday.prayer}
          />

          <ActionCard
            icon={CheckSquare}
            title="Alışkanlık Sayfası"
            sub="Detaylı kayıt / not"
            rightText=""
            onClick={onHabitsPage}
            active={false}
          />

          <ActionCard
            icon={Scale}
            title="Kilo Ekle"
            sub="Takibi güncelle"
            rightText=""
            onClick={onWeightQuick}
            active={false}
          />
        </div>
      </Card>

      {/* DAY SCORE */}
      <Card>
        <div className="bt-row">
          <div>
            <div className="bt-title">Günün Skoru</div>
            <div className="bt-sub">
              {dayDone.done}/{dayDone.total} tamamlandı • {fmtDateShort(today)}
            </div>
          </div>
          <Badge>
            <b>{dayDone.pct}%</b>
          </Badge>
        </div>

        <div className="bt-progress" style={{ marginTop: 12 }}>
          <div style={{ width: `${dayDone.pct}%` }} />
        </div>

        <div className="bt-chipsRow">
          <div className={`bt-chip ${workoutDoneToday ? "on" : ""}`} onClick={onWorkoutQuick}>
            <Dumbbell size={14} /> Antrenman {workoutDoneToday ? "✅" : "⬜"}
          </div>
          <div className={`bt-chip ${habitsToday.noSmoking ? "on" : ""}`} onClick={() => toggleHabit("noSmoking", "Sigara Yok")}>
            <CigaretteOff size={14} /> Sigara {habitsToday.noSmoking ? "✅" : "⬜"}
          </div>
          <div className={`bt-chip ${habitsToday.english ? "on" : ""}`} onClick={() => toggleHabit("english", "İngilizce")}>
            <Languages size={14} /> İngilizce {habitsToday.english ? "✅" : "⬜"}
          </div>
          <div className={`bt-chip ${habitsToday.reading ? "on" : ""}`} onClick={() => toggleHabit("reading", "Kitap")}>
            <BookOpen size={14} /> Kitap {habitsToday.reading ? "✅" : "⬜"}
          </div>
          <div className={`bt-chip ${habitsToday.prayer ? "on" : ""}`} onClick={() => toggleHabit("prayer", "Namaz")}>
            <HandHeart size={14} /> Namaz {habitsToday.prayer ? "✅" : "⬜"}
          </div>
        </div>
      </Card>

      {/* PROFILE SUMMARY */}
      <Card>
        <div className="bt-row">
          <div>
            <div className="bt-title">Profil Özeti</div>
            <div className="bt-sub">Hızlı kontrol</div>
          </div>

          <button
            className="bt-btn bt-btnPrimary"
            style={{ width: "auto" }}
            onClick={() => setOpenProfile(true)}
          >
            <Ruler size={16} />
            Düzenle
          </button>
        </div>

        <div style={{ marginTop: 12 }} className="bt-grid3">
          <div className="bt-btn" style={{ cursor: "default" }}>
            <span className="bt-iconBox">
              <Ruler size={18} />
            </span>
            <div>
              <div style={{ fontWeight: 900 }}>Boy</div>
              <div className="bt-sub">{profile.heightCm ? `${profile.heightCm} cm` : "—"}</div>
            </div>
          </div>

          <div className="bt-btn" style={{ cursor: "default" }}>
            <span className="bt-iconBox">
              <Scale size={18} />
            </span>
            <div>
              <div style={{ fontWeight: 900 }}>Kilo</div>
              <div className="bt-sub">{profile.weightKg ? `${profile.weightKg} kg` : "—"}</div>
            </div>
          </div>

          <div className="bt-btn" style={{ cursor: "default" }}>
            <span className="bt-iconBox">
              <Flame size={18} />
            </span>
            <div>
              <div style={{ fontWeight: 900 }}>Hedef</div>
              <div className="bt-sub">
                {profile.goalWeightKg ? `${profile.goalWeightKg} kg` : "—"}
                {goalDiff != null ? ` • fark: ${goalDiff > 0 ? "+" : ""}${goalDiff} kg` : ""}
              </div>
            </div>
          </div>
        </div>

        <div className="bt-sub" style={{ marginTop: 10 }}>
          BMI: <b>{bmi != null ? bmi : "—"}</b>
        </div>
      </Card>

      {/* PROFILE MODAL */}
      {openProfile && (
        <div className="bt-modalBg" onClick={() => setOpenProfile(false)}>
          <div className="bt-modal" onClick={(e) => e.stopPropagation()}>
            <div className="bt-row">
              <div>
                <div className="bt-title">Profil Düzenle</div>
                <div className="bt-sub">Boy / Kilo / Hedef</div>
              </div>
              <button className="bt-btn" style={{ width: "auto" }} onClick={() => setOpenProfile(false)}>
                <X size={16} />
              </button>
            </div>

            <div style={{ marginTop: 12 }} className="bt-grid3">
              <div className="bt-field">
                <div className="bt-sub">Boy (cm)</div>
                <input
                  className="bt-input"
                  value={pHeight}
                  onChange={(e) => setPHeight(e.target.value.replace(/[^\d]/g, ""))}
                  inputMode="numeric"
                  placeholder="178"
                />
              </div>

              <div className="bt-field">
                <div className="bt-sub">Kilo (kg)</div>
                <input
                  className="bt-input"
                  value={pWeight}
                  onChange={(e) => setPWeight(e.target.value.replace(/[^\d.]/g, ""))}
                  inputMode="decimal"
                  placeholder="58"
                />
              </div>

              <div className="bt-field">
                <div className="bt-sub">Hedef Kilo (kg)</div>
                <input
                  className="bt-input"
                  value={pGoal}
                  onChange={(e) => setPGoal(e.target.value.replace(/[^\d.]/g, ""))}
                  inputMode="decimal"
                  placeholder="65"
                />
              </div>
            </div>

            <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button className="bt-btn" style={{ width: "auto" }} onClick={() => setOpenProfile(false)}>
                <X size={16} /> Vazgeç
              </button>
              <button className="bt-btn bt-btnPrimary" style={{ width: "auto" }} onClick={saveProfile}>
                <Save size={16} /> Kaydet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && <div className="bt-toast">{toast}</div>}
    </div>
  );
}