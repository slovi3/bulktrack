import React, { useMemo, useState } from "react";
import {
  Dumbbell,
  Plus,
  Trash2,
  CalendarDays,
  Flame,
  PencilLine,
  Save,
  X,
} from "lucide-react";

const LS_WORKOUTS = "bulktrack_workouts";

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

function uid() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function dayLabelTR(ymd) {
  // 2026-02-26 -> Ç (takvim chip)
  const d = new Date(ymd + "T00:00:00");
  const idx = d.getDay(); // 0 Pazar
  const map = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];
  return map[idx];
}

function fmtDate(ymd) {
  const mm = ymd.slice(5, 7);
  const dd = ymd.slice(8, 10);
  return `${dd}.${mm}`;
}

function Card({ children }) {
  return <div className="bt-card">{children}</div>;
}

export default function Workout() {
  const today = useMemo(() => toYMD(new Date()), []);
  const [workouts, setWorkouts] = useState(() => {
    const raw = readJSON(LS_WORKOUTS, []);
    return Array.isArray(raw)
      ? raw.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
      : [];
  });

  // modal
  const [editing, setEditing] = useState(null); // workout object
  const [noteInput, setNoteInput] = useState("");

  const empty = workouts.length === 0;

  // week calc
  const week = useMemo(() => {
    const start = startOfWeekMonday(new Date());
    const days = Array.from({ length: 7 }, (_, i) => toYMD(addDays(start, i)));
    const doneSet = new Set(workouts.map((w) => w.date));
    const count = days.filter((d) => doneSet.has(d)).length;
    return { start, days, doneSet, count };
  }, [workouts]);

  const addWorkoutToday = () => {
    if (workouts.some((w) => w.date === today)) return;

    const next = [
      {
        id: uid(),
        date: today,
        title: "Antrenman",
        note: "",
        createdAt: Date.now(),
      },
      ...workouts,
    ].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

    setWorkouts(next);
    writeJSON(LS_WORKOUTS, next);
  };

  const openEdit = (w) => {
    setEditing(w);
    setNoteInput(w.note || "");
  };

  const closeEdit = () => {
    setEditing(null);
    setNoteInput("");
  };

  const saveEdit = () => {
    if (!editing) return;
    const next = workouts.map((w) =>
      w.id === editing.id ? { ...w, note: noteInput } : w
    );
    setWorkouts(next);
    writeJSON(LS_WORKOUTS, next);
    closeEdit();
  };

  const deleteWorkout = (id) => {
    const next = workouts.filter((w) => w.id !== id);
    setWorkouts(next);
    writeJSON(LS_WORKOUTS, next);
    if (editing?.id === id) closeEdit();
  };

  return (
    <div className="bt-wrap">
      {/* Header */}
      <Card>
        <div className="bt-row">
          <div>
            <div className="bt-title">Antrenman</div>
            <div className="bt-sub">Haftalık streak + kayıtlar</div>
          </div>

          <div className="bt-badge">
            <Flame size={14} />
            Bu hafta <b>{week.count}/7</b>
          </div>
        </div>

        {/* Week mini calendar */}
        <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8 }}>
          {week.days.map((d) => {
            const done = week.doneSet.has(d);
            return (
              <div
                key={d}
                style={{
                  padding: "10px 8px",
                  borderRadius: 14,
                  border: `1px solid ${done ? "rgba(57,255,136,0.25)" : "rgba(255,255,255,0.08)"}`,
                  background: done
                    ? "linear-gradient(180deg, rgba(57,255,136,0.12), rgba(124,58,237,0.08))"
                    : "rgba(255,255,255,0.03)",
                  textAlign: "center",
                }}
              >
                <div style={{ fontWeight: 900, fontSize: 12 }}>{dayLabelTR(d)}</div>
                <div className="bt-sub" style={{ marginTop: 2 }}>{d.slice(8, 10)}</div>
                <div style={{ marginTop: 6, fontSize: 12 }}>{done ? "✅" : "⬜"}</div>
              </div>
            );
          })}
        </div>

        {/* Quick actions */}
        <div className="bt-gridActions" style={{ marginTop: 14 }}>
          <button className="bt-btn bt-btnPrimary" onClick={addWorkoutToday}>
            <span className="bt-iconBox">
              <Dumbbell size={18} />
            </span>
            <div>
              <div style={{ fontWeight: 900 }}>Bugün Antrenman</div>
              <div className="bt-sub">1 kayıt = streak ilerler</div>
            </div>
            <span className="bt-right">
              <Plus size={16} />
            </span>
          </button>

          <div className="bt-btn" style={{ cursor: "default" }}>
            <span className="bt-iconBox">
              <CalendarDays size={18} />
            </span>
            <div>
              <div style={{ fontWeight: 900 }}>Kural</div>
              <div className="bt-sub">Haftada 3 gün hedefle, 7/7 bonus</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Empty state */}
      {empty && (
        <Card>
          <div style={{ textAlign: "center", padding: 10 }}>
            <div style={{ fontSize: 38, marginBottom: 6 }}>🏋️</div>
            <div className="bt-title">İlk antrenmanı ekle</div>
            <div className="bt-sub" style={{ marginTop: 6 }}>
              “Bugün Antrenman” ile tek tık kayıt açılır.
            </div>
          </div>
        </Card>
      )}

      {/* List */}
      <Card>
        <div className="bt-row">
          <div>
            <div className="bt-title">Kayıtlar</div>
            <div className="bt-sub">Son kayıt en üstte</div>
          </div>

          <div className="bt-badge">
            <CalendarDays size={14} />
            {workouts.length} kayıt
          </div>
        </div>

        <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
          {workouts.slice(0, 30).map((w) => (
            <div
              key={w.id}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto auto",
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
                  <Dumbbell size={18} />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <div style={{ fontWeight: 900 }}>
                    {w.title || "Antrenman"} <span style={{ opacity: 0.75 }}>•</span>{" "}
                    <span style={{ opacity: 0.9 }}>{fmtDate(w.date)}</span>
                  </div>
                  <div className="bt-sub" style={{ opacity: 0.85 }}>
                    {w.note ? w.note.slice(0, 70) + (w.note.length > 70 ? "…" : "") : "Not yok"}
                  </div>
                </div>
              </div>

              <button className="bt-btn" style={{ width: "auto" }} onClick={() => openEdit(w)} title="Not düzenle">
                <PencilLine size={16} />
              </button>

              <button className="bt-btn" style={{ width: "auto" }} onClick={() => deleteWorkout(w.id)} title="Sil">
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          {workouts.length > 30 && (
            <div className="bt-sub" style={{ textAlign: "center" }}>
              İlk 30 kayıt gösteriliyor.
            </div>
          )}
        </div>
      </Card>

      {/* EDIT MODAL */}
      {editing && (
        <div
          onClick={closeEdit}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            display: "grid",
            placeItems: "center",
            zIndex: 200,
            padding: 16,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bt-card"
            style={{
              width: "min(720px, 100%)",
            }}
          >
            <div className="bt-row">
              <div>
                <div className="bt-title">Not Düzenle</div>
                <div className="bt-sub">
                  {editing.title || "Antrenman"} • {fmtDate(editing.date)}
                </div>
              </div>

              <button className="bt-btn" style={{ width: "auto" }} onClick={closeEdit} title="Kapat">
                <X size={16} />
              </button>
            </div>

            <div style={{ marginTop: 12 }}>
              <div className="bt-sub" style={{ marginBottom: 6 }}>
                Not
              </div>
              <textarea
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder="Örn: Bench 3x8, Row 3x10, Squat 3x5..."
                style={{
                  width: "100%",
                  minHeight: 120,
                  padding: 12,
                  borderRadius: 14,
                  border: "1px solid rgba(255,255,255,0.10)",
                  background: "rgba(255,255,255,0.04)",
                  color: "rgba(255,255,255,0.92)",
                  outline: "none",
                  resize: "vertical",
                }}
              />
            </div>

            <div style={{ marginTop: 12, display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button className="bt-btn" style={{ width: "auto" }} onClick={closeEdit}>
                <X size={16} /> Vazgeç
              </button>
              <button className="bt-btn bt-btnPrimary" style={{ width: "auto" }} onClick={saveEdit}>
                <Save size={16} /> Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}