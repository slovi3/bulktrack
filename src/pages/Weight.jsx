import React, { useMemo, useState } from "react";
import { Plus, Trash2, TrendingUp, Scale, CalendarDays } from "lucide-react";

const LS_PROFILE = "bulktrack_profile";
const LS_WEIGHT_LOG = "bulktrack_weight_log";

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

function toYMD(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function uid() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function fmtDate(ymd) {
  // 2026-02-26 -> 26.02
  if (!ymd) return "";
  const mm = ymd.slice(5, 7);
  const dd = ymd.slice(8, 10);
  return `${dd}.${mm}`;
}

function Sparkline({ values = [] }) {
  // values: [number]
  const w = 520;
  const h = 92;
  const pad = 10;

  if (!values.length) return null;
  const minV = Math.min(...values);
  const maxV = Math.max(...values);
  const span = maxV - minV || 1;

  const pts = values.map((v, i) => {
    const x = pad + (i * (w - pad * 2)) / Math.max(1, values.length - 1);
    const y = pad + (1 - (v - minV) / span) * (h - pad * 2);
    return { x, y };
  });

  const d = pts
    .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
    .join(" ");

  const last = pts[pts.length - 1];

  return (
    <div
      className="bt-card"
      style={{
        padding: 14,
      }}
    >
      <div className="bt-row">
        <div>
          <div className="bt-title">Kilo Trend</div>
          <div className="bt-sub">Son {values.length} kayıt</div>
        </div>

        <div className="bt-badge">
          <TrendingUp size={14} />
          {minV.toFixed(1)} → {maxV.toFixed(1)}
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <svg
          viewBox={`0 0 ${w} ${h}`}
          width="100%"
          height="92"
          style={{
            borderRadius: 16,
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.03)",
          }}
        >
          {/* grid line */}
          <line
            x1="0"
            y1={h / 2}
            x2={w}
            y2={h / 2}
            stroke="rgba(255,255,255,0.08)"
          />
          <path d={d} fill="none" stroke="rgba(57,255,136,0.85)" strokeWidth="2.5" />
          <circle cx={last.x} cy={last.y} r="4.5" fill="rgba(124,58,237,0.95)" />
        </svg>

        <div className="bt-sub" style={{ marginTop: 10, display: "flex", justifyContent: "space-between" }}>
          <span>Min: {minV.toFixed(1)} kg</span>
          <span>Max: {maxV.toFixed(1)} kg</span>
        </div>
      </div>
    </div>
  );
}

export default function Weight() {
  const today = useMemo(() => toYMD(new Date()), []);
  const [profile, setProfile] = useState(() =>
    readJSON(LS_PROFILE, { heightCm: "", weightKg: "", goalWeightKg: "" })
  );

  const [log, setLog] = useState(() => {
    const raw = readJSON(LS_WEIGHT_LOG, []);
    // newest first
    return Array.isArray(raw) ? raw.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)) : [];
  });

  const latestWeight = useMemo(() => {
    const p = Number(profile.weightKg);
    if (p) return p;
    const first = log[0]?.kg;
    return first ? Number(first) : null;
  }, [profile.weightKg, log]);

  const [kgInput, setKgInput] = useState(() => (latestWeight ? String(latestWeight) : ""));
  const [dateInput, setDateInput] = useState(() => today);

  const recentForChart = useMemo(() => {
    // chart oldest -> newest (max 14)
    const slice = log.slice(0, 14).slice().reverse();
    return slice.map((x) => Number(x.kg)).filter((n) => Number.isFinite(n));
  }, [log]);

  const empty = log.length === 0;

  const syncProfileWeight = (kg) => {
    const next = { ...profile, weightKg: String(kg) };
    setProfile(next);
    writeJSON(LS_PROFILE, next);
  };

  const addEntry = (kg, ymd) => {
    const entry = {
      id: uid(),
      kg: Number(kg),
      date: ymd,
      createdAt: Date.now(),
    };
    const next = [entry, ...log].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    setLog(next);
    writeJSON(LS_WEIGHT_LOG, next);
    syncProfileWeight(Number(kg));
  };

  const quickAdd = (delta) => {
    const base = (latestWeight != null ? Number(latestWeight) : Number(kgInput)) || 0;
    if (!base) return;
    const nextKg = clamp(Number(base) + delta, 30, 250);
    setKgInput(String(nextKg));
    addEntry(nextKg, today);
  };

  const handleSave = () => {
    const kg = Number(kgInput);
    if (!Number.isFinite(kg) || kg < 30 || kg > 250) return;
    addEntry(kg, dateInput || today);
  };

  const deleteEntry = (id) => {
    const next = log.filter((x) => x.id !== id);
    setLog(next);
    writeJSON(LS_WEIGHT_LOG, next);

    // profil kilosunu en güncele çek
    const newLatest = next[0]?.kg;
    if (newLatest) syncProfileWeight(Number(newLatest));
  };

  const deltaText = useMemo(() => {
    if (log.length < 2) return null;
    const a = Number(log[0]?.kg);
    const b = Number(log[1]?.kg);
    if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
    const diff = a - b;
    const sign = diff > 0 ? "+" : "";
    return `${sign}${diff.toFixed(1)} kg`;
  }, [log]);

  return (
    <div className="bt-wrap">
      {/* Header card */}
      <div className="bt-card">
        <div className="bt-row">
          <div>
            <div className="bt-title">Kilo Takibi</div>
            <div className="bt-sub">Kayıt ekle, trendi gör</div>
          </div>

          <div className="bt-badge">
            <Scale size={14} />
            {latestWeight ? <b>{Number(latestWeight).toFixed(1)} kg</b> : <b>—</b>}
            {deltaText ? <span style={{ opacity: 0.8 }}>({deltaText})</span> : null}
          </div>
        </div>

        <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
          {/* Quick add row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            <button className="bt-btn" onClick={() => quickAdd(-0.5)} title="-0.5 kg">
              <span className="bt-iconBox">-</span>
              <div style={{ fontWeight: 900 }}>-0.5</div>
              <span className="bt-right">
                <Plus size={16} />
              </span>
            </button>

            <button className="bt-btn bt-btnPrimary" onClick={() => quickAdd(+0.5)} title="+0.5 kg">
              <span className="bt-iconBox">+</span>
              <div style={{ fontWeight: 900 }}>+0.5</div>
              <span className="bt-right">
                <Plus size={16} />
              </span>
            </button>

            <button className="bt-btn" onClick={() => quickAdd(+1)} title="+1 kg">
              <span className="bt-iconBox">+</span>
              <div style={{ fontWeight: 900 }}>+1.0</div>
              <span className="bt-right">
                <Plus size={16} />
              </span>
            </button>
          </div>

          {/* Manual entry */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr auto",
              gap: 10,
              alignItems: "end",
            }}
          >
            <div>
              <div className="bt-sub" style={{ marginBottom: 6 }}>Kilo (kg)</div>
              <input
                value={kgInput}
                onChange={(e) => setKgInput(e.target.value.replace(/[^\d.]/g, ""))}
                inputMode="decimal"
                placeholder="örn 58.0"
                style={{
                  width: "100%",
                  padding: "12px 12px",
                  borderRadius: 14,
                  border: "1px solid rgba(255,255,255,0.10)",
                  background: "rgba(255,255,255,0.04)",
                  color: "rgba(255,255,255,0.92)",
                  outline: "none",
                }}
              />
            </div>

            <div>
              <div className="bt-sub" style={{ marginBottom: 6 }}>Tarih</div>
              <input
                type="date"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 12px",
                  borderRadius: 14,
                  border: "1px solid rgba(255,255,255,0.10)",
                  background: "rgba(255,255,255,0.04)",
                  color: "rgba(255,255,255,0.92)",
                  outline: "none",
                }}
              />
            </div>

            <button className="bt-btn bt-btnPrimary" style={{ width: "auto" }} onClick={handleSave}>
              <Plus size={16} />
              Kaydet
            </button>
          </div>

          <div className="bt-sub">
            İpucu: Kilo kaydın otomatik olarak <b>Profil</b> kilosunu günceller.
          </div>
        </div>
      </div>

      {/* Empty state */}
      {empty && (
        <div className="bt-card" style={{ textAlign: "center", padding: 18 }}>
          <div style={{ fontSize: 36, marginBottom: 6 }}>📈</div>
          <div className="bt-title">İlk kilonu ekle</div>
          <div className="bt-sub" style={{ marginTop: 6 }}>
            Bugün 1 kayıt girince grafik + trend otomatik oluşacak.
          </div>
        </div>
      )}

      {/* Chart */}
      {!empty && <Sparkline values={recentForChart} />}

      {/* Log list */}
      <div className="bt-card">
        <div className="bt-row">
          <div>
            <div className="bt-title">Kayıtlar</div>
            <div className="bt-sub">Son kayıt en üstte</div>
          </div>

          <div className="bt-badge">
            <CalendarDays size={14} />
            {log.length} kayıt
          </div>
        </div>

        <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
          {log.slice(0, 30).map((x) => (
            <div
              key={x.id}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: 10,
                padding: 12,
                borderRadius: 16,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.03)",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 14,
                    display: "grid",
                    placeItems: "center",
                    border: "1px solid rgba(255,255,255,0.10)",
                    background: "rgba(0,0,0,0.22)",
                  }}
                >
                  <Scale size={18} />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <div style={{ fontWeight: 900 }}>{Number(x.kg).toFixed(1)} kg</div>
                  <div className="bt-sub">{fmtDate(x.date)}</div>
                </div>
              </div>

              <button
                className="bt-btn"
                style={{ width: "auto" }}
                onClick={() => deleteEntry(x.id)}
                title="Sil"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          {log.length > 30 && (
            <div className="bt-sub" style={{ textAlign: "center" }}>
              İlk 30 kayıt gösteriliyor.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}