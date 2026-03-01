import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Ruler, Scale, Target, ArrowRight, Save } from "lucide-react";

const LS_PROFILE = "bulktrack_profile";

function readProfile() {
  try {
    return JSON.parse(localStorage.getItem(LS_PROFILE) || "null");
  } catch {
    return null;
  }
}

function writeProfile(p) {
  localStorage.setItem(LS_PROFILE, JSON.stringify(p));
}

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

export default function Onboarding() {
  const nav = useNavigate();

  const existing = useMemo(() => readProfile(), []);
  const [heightCm, setHeightCm] = useState(existing?.heightCm ? String(existing.heightCm) : "");
  const [weightKg, setWeightKg] = useState(existing?.weightKg ? String(existing.weightKg) : "");
  const [goalWeightKg, setGoalWeightKg] = useState(
    existing?.goalWeightKg ? String(existing.goalWeightKg) : ""
  );

  const [err, setErr] = useState("");

  const submit = (e) => {
    e.preventDefault();
    setErr("");

    const h = Number(heightCm);
    const w = Number(weightKg);
    const g = Number(goalWeightKg);

    if (!Number.isFinite(h) || h < 120 || h > 220) return setErr("Boy 120–220 cm aralığında olmalı.");
    if (!Number.isFinite(w) || w < 30 || w > 250) return setErr("Kilo 30–250 kg aralığında olmalı.");
    if (!Number.isFinite(g) || g < 30 || g > 250) return setErr("Hedef kilo 30–250 kg aralığında olmalı.");

    const profile = {
      heightCm: clamp(h, 120, 220),
      weightKg: clamp(w, 30, 250),
      goalWeightKg: clamp(g, 30, 250),
      updatedAt: Date.now(),
    };

    writeProfile(profile);
    nav("/dashboard", { replace: true });
  };

  return (
    <div style={styles.bg}>
      <div style={styles.shell}>
        <div style={styles.head}>
          <div>
            <div style={styles.title}>İlk Kurulum</div>
            <div style={styles.sub}>1 dakikada biter. Sonra direkt Dashboard.</div>
          </div>
          <div style={styles.badge}>V1</div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardTitle}>Profil Bilgileri</div>
          <div style={styles.cardSub}>Boy, kilo ve hedef kilonu gir.</div>

          <form onSubmit={submit} style={{ display: "grid", gap: 12, marginTop: 12 }}>
            <Field
              icon={<Ruler size={18} />}
              label="Boy (cm)"
              value={heightCm}
              onChange={(v) => setHeightCm(v)}
              placeholder="örn: 178"
            />
            <Field
              icon={<Scale size={18} />}
              label="Kilo (kg)"
              value={weightKg}
              onChange={(v) => setWeightKg(v)}
              placeholder="örn: 58"
            />
            <Field
              icon={<Target size={18} />}
              label="Hedef Kilo (kg)"
              value={goalWeightKg}
              onChange={(v) => setGoalWeightKg(v)}
              placeholder="örn: 65"
            />

            {err ? <div style={styles.err}>{err}</div> : null}

            <button type="submit" style={styles.btn}>
              <Save size={18} />
              Kaydet ve Devam Et
              <ArrowRight size={18} />
            </button>

            <div style={styles.note}>
              Not: Bu veriler şu an <b>localStorage</b>’a kaydoluyor. Sonra hesabına bağlarız.
            </div>
          </form>
        </div>

        <div style={styles.footerHint}>
          İstersen sonra Dashboard → Profil kısmından güncelleyeceğiz.
        </div>
      </div>
    </div>
  );
}

function Field({ icon, label, value, onChange, placeholder }) {
  return (
    <div>
      <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 6 }}>{label}</div>
      <div style={styles.inputWrap}>
        <span style={styles.iconBox}>{icon}</span>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/[^\d]/g, ""))}
          placeholder={placeholder}
          inputMode="numeric"
          style={styles.input}
          maxLength={10}
        />
      </div>
    </div>
  );
}

const styles = {
  bg: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: 16,
    background:
      "radial-gradient(1000px 600px at 10% 0%, rgba(124,58,237,0.22), transparent 60%), radial-gradient(1000px 600px at 90% 10%, rgba(57,255,136,0.12), transparent 55%), #0b0f16",
    color: "rgba(255,255,255,0.92)",
    fontFamily:
      "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
  },
  shell: { width: "min(720px, 100%)" },
  head: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 12,
  },
  title: { fontWeight: 950, fontSize: 26, letterSpacing: 0.2 },
  sub: { fontSize: 12, opacity: 0.78, marginTop: 4 },
  badge: {
    fontSize: 12,
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(0,0,0,0.18)",
  },

  card: {
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
    padding: 16,
    boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
  },
  cardTitle: { fontWeight: 950, fontSize: 16 },
  cardSub: { fontSize: 12, opacity: 0.75, marginTop: 4 },

  inputWrap: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "12px 12px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.04)",
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.12)",
    display: "grid",
    placeItems: "center",
    background: "rgba(0,0,0,0.14)",
  },
  input: {
    width: "100%",
    border: "none",
    outline: "none",
    background: "transparent",
    color: "rgba(255,255,255,0.92)",
    fontSize: 14,
  },

  btn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: "12px 12px",
    borderRadius: 14,
    border: "1px solid rgba(57,255,136,0.22)",
    background:
      "linear-gradient(180deg, rgba(57,255,136,0.18), rgba(124,58,237,0.10))",
    color: "rgba(255,255,255,0.95)",
    fontWeight: 950,
    cursor: "pointer",
  },

  err: {
    fontSize: 12,
    padding: "10px 12px",
    borderRadius: 14,
    border: "1px solid rgba(255,80,80,0.25)",
    background: "rgba(255,80,80,0.10)",
  },
  note: { fontSize: 12, opacity: 0.7, textAlign: "center", marginTop: 4 },
  footerHint: { fontSize: 12, opacity: 0.65, marginTop: 12, textAlign: "center" },
};