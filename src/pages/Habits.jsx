import React, { useMemo, useState } from "react";
import {
  CheckSquare,
  CigaretteOff,
  BookOpen,
  Languages,
  HandHeart,
  Moon,
  Sun,
  CalendarDays,
  Save,
  StickyNote,
} from "lucide-react";

const LS_HABITS = "bulktrack_habits_daily";

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

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function fmtDateShort(ymd) {
  // 2026-02-26 -> 26.02
  const mm = ymd.slice(5, 7);
  const dd = ymd.slice(8, 10);
  return `${dd}.${mm}`;
}

function dayNameTR(ymd) {
  const d = new Date(ymd + "T00:00:00");
  const idx = d.getDay();
  const map = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];
  return map[idx];
}

function defaultDay() {
  return {
    noSmoking: false,
    reading: false,
    english: false,
    prayer: false,
    sleepStart: "",
    sleepEnd: "",
    willpower: "Ben kazandım",
    note: "",
    updatedAt: 0,
  };
}

function Card({ children }) {
  return <div className="bt-card">{children}</div>;
}

function HabitRow({ icon, title, desc, checked, onToggle }) {
  const IconComp = icon;

  return (
    <button
      className="bt-btn"
      onClick={onToggle}
      style={{ justifyContent: "space-between" }}
      title="Değiştir"
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span className="bt-iconBox">
          {IconComp ? <IconComp size={18} /> : null}
        </span>

        <div style={{ display: "flex", flexDirection: "column", gap: 2, textAlign: "left" }}>
          <div style={{ fontWeight: 900 }}>{title}</div>
          <div className="bt-sub">{desc}</div>
        </div>
      </div>

      <div
        className="bt-badge"
        style={{
          borderColor: checked ? "rgba(57,255,136,0.30)" : "rgba(255,255,255,0.10)",
          background: checked ? "rgba(57,255,136,0.10)" : "rgba(0,0,0,0.18)",
          minWidth: 54,
          justifyContent: "center",
        }}
      >
        {checked ? "✅" : "⬜"}
      </div>
    </button>
  );
}

export default function Habits() {
  const today = useMemo(() => toYMD(new Date()), []);
  const [db, setDb] = useState(() => readJSON(LS_HABITS, {}));

  const day = db[today] || defaultDay();

  const score = useMemo(() => {
    const keys = ["noSmoking", "reading", "english", "prayer"];
    const done = keys.reduce((acc, k) => acc + (day[k] ? 1 : 0), 0);
    const total = keys.length;
    const pct = Math.round((done / total) * 100);
    return { done, total, pct };
  }, [day]);

  const setDayPatch = (patch) => {
    const nextDay = { ...day, ...patch, updatedAt: Date.now() };
    const nextDb = { ...db, [today]: nextDay };
    setDb(nextDb);
    writeJSON(LS_HABITS, nextDb);
  };

  const toggle = (key) => {
    setDayPatch({ [key]: !day[key] });
  };

  const last7 = useMemo(() => {
    const now = new Date();
    const days = Array.from({ length: 7 }, (_, i) => toYMD(addDays(now, -(6 - i))));
    return days.map((d) => {
      const it = db[d] || defaultDay();
      const done =
        (it.noSmoking ? 1 : 0) +
        (it.reading ? 1 : 0) +
        (it.english ? 1 : 0) +
        (it.prayer ? 1 : 0);
      return { date: d, done, total: 4 };
    });
  }, [db]);

  return (
    <div className="bt-wrap">
      {/* Header */}
      <Card>
        <div className="bt-row">
          <div>
            <div className="bt-title">Alışkanlıklar</div>
            <div className="bt-sub">Bugünü işaretle, çizgiyi bozma</div>
          </div>

          <div className="bt-badge">
            <CheckSquare size={14} />
            <b>{score.pct}%</b>
          </div>
        </div>

        <div className="bt-progress" style={{ marginTop: 12 }}>
          <div style={{ width: `${score.pct}%` }} />
        </div>

        <div className="bt-sub" style={{ marginTop: 10 }}>
          Bugün: <b>{score.done}/{score.total}</b> tamamlandı
        </div>
      </Card>

      {/* Last 7 days mini calendar */}
      <Card>
        <div className="bt-row">
          <div>
            <div className="bt-title">Son 7 Gün</div>
            <div className="bt-sub">Her gün kaç görev tamamlandı</div>
          </div>
          <div className="bt-badge">
            <CalendarDays size={14} />
            7 gün
          </div>
        </div>

        <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8 }}>
          {last7.map((d) => {
            const isToday = d.date === today;
            const ok = d.done >= 3; // 3/4 iyi sayalım
            return (
              <div
                key={d.date}
                style={{
                  padding: "10px 8px",
                  borderRadius: 14,
                  border: `1px solid ${
                    isToday
                      ? "rgba(124,58,237,0.40)"
                      : ok
                      ? "rgba(57,255,136,0.25)"
                      : "rgba(255,255,255,0.08)"
                  }`,
                  background: isToday
                    ? "linear-gradient(180deg, rgba(124,58,237,0.18), rgba(255,255,255,0.03))"
                    : ok
                    ? "linear-gradient(180deg, rgba(57,255,136,0.10), rgba(124,58,237,0.06))"
                    : "rgba(255,255,255,0.03)",
                  textAlign: "center",
                }}
                title={d.date}
              >
                <div style={{ fontWeight: 900, fontSize: 12 }}>{dayNameTR(d.date)}</div>
                <div className="bt-sub" style={{ marginTop: 2 }}>{fmtDateShort(d.date)}</div>
                <div style={{ marginTop: 6, fontSize: 12 }}>
                  {d.done}/{d.total}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Today checklist */}
      <Card>
        <div className="bt-row">
          <div>
            <div className="bt-title">Bugün</div>
            <div className="bt-sub">Checklist</div>
          </div>

          <div className="bt-badge">
            <Save size={14} />
            Otomatik kayıt
          </div>
        </div>

        <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
          <HabitRow
            icon={CigaretteOff}
            title="Gün İçinde Sigara Yok"
            desc="Bugünü temiz geçirdin mi?"
            checked={!!day.noSmoking}
            onToggle={() => toggle("noSmoking")}
          />
          <HabitRow
            icon={Languages}
            title="İngilizce"
            desc="En az 20 dk"
            checked={!!day.english}
            onToggle={() => toggle("english")}
          />
          <HabitRow
            icon={BookOpen}
            title="Kitap"
            desc="En az 10 sayfa"
            checked={!!day.reading}
            onToggle={() => toggle("reading")}
          />
          <HabitRow
            icon={HandHeart}
            title="Namaz / Dua"
            desc="Bugün tamamlandı mı?"
            checked={!!day.prayer}
            onToggle={() => toggle("prayer")}
          />
        </div>
      </Card>

      {/* Sleep + Willpower */}
      <Card>
        <div className="bt-row">
          <div>
            <div className="bt-title">Uyku & İrade</div>
            <div className="bt-sub">Kendini net gör</div>
          </div>
          <div className="bt-badge">Sistem 2.0</div>
        </div>

        <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div>
            <div className="bt-sub" style={{ marginBottom: 6 }}>Uyku Başlangıç</div>
            <div style={{ display: "flex", gap: 10 }}>
              <div className="bt-iconBox"><Moon size={18} /></div>
              <input
                type="time"
                value={day.sleepStart}
                onChange={(e) => setDayPatch({ sleepStart: e.target.value })}
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
          </div>

          <div>
            <div className="bt-sub" style={{ marginBottom: 6 }}>Uyku Bitiş</div>
            <div style={{ display: "flex", gap: 10 }}>
              <div className="bt-iconBox"><Sun size={18} /></div>
              <input
                type="time"
                value={day.sleepEnd}
                onChange={(e) => setDayPatch({ sleepEnd: e.target.value })}
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
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <div className="bt-sub" style={{ marginBottom: 6 }}>İrade Durumu</div>
          <select
            value={day.willpower}
            onChange={(e) => setDayPatch({ willpower: e.target.value })}
            style={{
              width: "100%",
              padding: "12px 12px",
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.10)",
              background: "rgba(255,255,255,0.04)",
              color: "rgba(255,255,255,0.92)",
              outline: "none",
            }}
          >
            <option>Ben kazandım</option>
            <option>Zorlandım ama tuttum</option>
            <option>Nefsim kazandı</option>
          </select>
        </div>
      </Card>

      {/* Note */}
      <Card>
        <div className="bt-row">
          <div>
            <div className="bt-title">Günlük Not</div>
            <div className="bt-sub">Kısa, net</div>
          </div>
          <div className="bt-badge">
            <StickyNote size={14} />
            {day.note?.length || 0} karakter
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <textarea
            value={day.note}
            onChange={(e) => setDayPatch({ note: e.target.value })}
            placeholder="Bugün ne iyi gitti? Ne zorladı?"
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
          <div className="bt-sub" style={{ marginTop: 8 }}>
            Not: Bu sayfa her değişiklikte otomatik kaydeder.
          </div>
        </div>
      </Card>
    </div>
  );
}