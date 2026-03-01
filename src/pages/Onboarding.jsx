import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const goals = [
  { id: "gain_muscle", label: "Kas kazanmak" },
  { id: "lose_weight", label: "Kilo vermek" },
  { id: "maintain", label: "Formda kalmak" },
];

const activity = [
  { id: "low", label: "Düşük" },
  { id: "mid", label: "Orta" },
  { id: "high", label: "Yüksek" },
];

export default function Onboarding() {
  const { user, updateProfile } = useAuth();
  const nav = useNavigate();

  const p = user?.profile || {};

  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState(p.fullName || "");
  const [goal, setGoal] = useState(p.goal || "");
  const [heightCm, setHeightCm] = useState(p.heightCm ?? "");
  const [weightKg, setWeightKg] = useState(p.weightKg ?? "");
  const [targetKg, setTargetKg] = useState(p.targetKg ?? "");
  const [act, setAct] = useState(p.activity || "");
  const [days, setDays] = useState(p.trainingDays ?? "");

  const saveAndGo = () => {
    updateProfile({
      fullName,
      goal,
      heightCm: heightCm === "" ? null : Number(heightCm),
      weightKg: weightKg === "" ? null : Number(weightKg),
      targetKg: targetKg === "" ? null : Number(targetKg),
      activity: act,
      trainingDays: days === "" ? null : Number(days),
    });
    nav("/dashboard");
  };

  const canStep1 = fullName.trim().length >= 2 && goal;

  return (
    <div className="min-h-screen p-4 flex items-center justify-center">
      <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Profilini Kur</h1>
            <p className="text-sm opacity-70 mt-1">3 adım — istersen atla.</p>
          </div>
          <button
            onClick={saveAndGo}
            className="text-sm opacity-80 hover:opacity-100 rounded-xl border border-white/10 bg-black/20 px-3 py-2"
          >
            Atla
          </button>
        </div>

        <div className="mt-4 flex gap-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full ${i <= step ? "bg-white/30" : "bg-white/10"}`}
            />
          ))}
        </div>

        {step === 1 && (
          <div className="mt-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="text-sm opacity-70">Ad Soyad</label>
                <input
                  className="mt-1 w-full rounded-xl bg-black/30 border border-white/10 p-3 outline-none"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ad Soyad"
                />
              </div>

              <div>
                <label className="text-sm opacity-70">Hedef</label>
                <div className="mt-1 grid gap-2">
                  {goals.map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setGoal(g.id)}
                      className={`rounded-xl p-3 border text-left ${
                        goal === g.id
                          ? "border-white/30 bg-white/10"
                          : "border-white/10 bg-black/20 hover:bg-white/5"
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                disabled={!canStep1}
                onClick={() => setStep(2)}
                className={`rounded-xl px-4 py-2 border border-white/10 ${
                  canStep1 ? "bg-white/10 hover:bg-white/15" : "opacity-40 cursor-not-allowed bg-white/5"
                }`}
              >
                Devam
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="mt-6 space-y-4">
            <div className="grid md:grid-cols-3 gap-3">
              <div>
                <label className="text-sm opacity-70">Boy (cm)</label>
                <input
                  className="mt-1 w-full rounded-xl bg-black/30 border border-white/10 p-3 outline-none"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  placeholder="178"
                  inputMode="numeric"
                />
              </div>
              <div>
                <label className="text-sm opacity-70">Kilo (kg)</label>
                <input
                  className="mt-1 w-full rounded-xl bg-black/30 border border-white/10 p-3 outline-none"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  placeholder="58"
                  inputMode="numeric"
                />
              </div>
              <div>
                <label className="text-sm opacity-70">Hedef Kilo (kg)</label>
                <input
                  className="mt-1 w-full rounded-xl bg-black/30 border border-white/10 p-3 outline-none"
                  value={targetKg}
                  onChange={(e) => setTargetKg(e.target.value)}
                  placeholder="65"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="rounded-xl px-4 py-2 border border-white/10 bg-black/20 hover:bg-white/5"
              >
                Geri
              </button>
              <button
                onClick={() => setStep(3)}
                className="rounded-xl px-4 py-2 border border-white/10 bg-white/10 hover:bg-white/15"
              >
                Devam
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="mt-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="text-sm opacity-70">Aktivite seviyesi</label>
                <div className="mt-1 grid grid-cols-3 gap-2">
                  {activity.map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => setAct(a.id)}
                      className={`rounded-xl p-3 border ${
                        act === a.id
                          ? "border-white/30 bg-white/10"
                          : "border-white/10 bg-black/20 hover:bg-white/5"
                      }`}
                    >
                      {a.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm opacity-70">Haftada kaç gün antrenman?</label>
                <select
                  className="mt-1 w-full rounded-xl bg-black/30 border border-white/10 p-3 outline-none"
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                >
                  <option value="">Seç (opsiyonel)</option>
                  <option value="2">2 gün</option>
                  <option value="3">3 gün</option>
                  <option value="4">4 gün</option>
                  <option value="5">5+ gün</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="rounded-xl px-4 py-2 border border-white/10 bg-black/20 hover:bg-white/5"
              >
                Geri
              </button>
              <button
                onClick={saveAndGo}
                className="rounded-xl px-4 py-2 border border-white/10 bg-white/10 hover:bg-white/15"
              >
                Bitir
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}