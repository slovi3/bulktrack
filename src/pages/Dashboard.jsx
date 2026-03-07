import { Link } from "react-router-dom";
import {
  Dumbbell,
  Scale,
  BookOpen,
  Languages,
  CigaretteOff,
  HandHeart,
  ChevronRight,
  Flame,
  Target,
  Ruler,
  PencilLine,
  CheckSquare,
} from "lucide-react";
import useAppData from "../ui/useAppData";

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function daysBetween(a, b) {
  const ms = startOfDay(a).getTime() - startOfDay(b).getTime();
  return Math.round(ms / 86400000);
}

function getLast7DaysCount(workouts) {
  const now = new Date();
  return workouts.filter((w) => {
    if (!w?.date) return false;
    const diff = daysBetween(now, new Date(w.date));
    return diff >= 0 && diff < 7;
  }).length;
}

function getWorkoutStreak(workouts) {
  if (!Array.isArray(workouts) || workouts.length === 0) return 0;

  const dates = [...new Set(workouts.map((w) => w.date).filter(Boolean))].sort(
    (a, b) => new Date(b) - new Date(a)
  );

  let streak = 0;
  let cursor = startOfDay(new Date());

  for (let i = 0; i < 30; i += 1) {
    const ymd = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}-${String(
      cursor.getDate()
    ).padStart(2, "0")}`;

    if (dates.includes(ymd)) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      if (i === 0) {
        cursor.setDate(cursor.getDate() - 1);
        continue;
      }
      break;
    }
  }

  return streak;
}

function getStartWeight(weightLog, currentWeight) {
  if (Array.isArray(weightLog) && weightLog.length > 0) {
    const sorted = [...weightLog].sort((a, b) => new Date(a.date) - new Date(b.date));
    return Number(sorted[0]?.kg || currentWeight || 0);
  }
  return Number(currentWeight || 0);
}

function getLatestWeight(weightLog, fallback) {
  if (Array.isArray(weightLog) && weightLog.length > 0) {
    const sorted = [...weightLog].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    return Number(sorted[0]?.kg || fallback || 0);
  }
  return Number(fallback || 0);
}

function getProgressPct(start, current, goal) {
  const s = Number(start || 0);
  const c = Number(current || 0);
  const g = Number(goal || 0);

  if (!g || g === s) return 0;
  const pct = ((c - s) / (g - s)) * 100;
  return Math.max(0, Math.min(100, Math.round(pct)));
}

function getBmi(weightKg, heightCm) {
  const w = Number(weightKg || 0);
  const h = Number(heightCm || 0) / 100;
  if (!w || !h) return 0;
  return +(w / (h * h)).toFixed(1);
}

function QuickAction({ to, icon, title, subtitle, pill }) {
  const Icon = icon;

  return (
    <Link to={to} className="bt-action">
      <div className="left">
        <div className="bt-iconBox">
          <Icon size={18} />
        </div>

        <div className="txt">
          <div className="t">{title}</div>
          <div className="s">{subtitle}</div>
        </div>
      </div>

      <div className="right">
        {pill ? <span className="pill">{pill}</span> : null}
        <ChevronRight size={18} />
      </div>
    </Link>
  );
}

function MiniStat({ icon, title, value, sub }) {
  const Icon = icon;

  return (
    <div className="bt-item">
      <div className="l">
        <div className="bt-iconBox">
          <Icon size={18} />
        </div>

        <div className="meta">
          <b>{title}</b>
          <span>{sub}</span>
        </div>
      </div>

      <div className="bt-title">{value}</div>
    </div>
  );
}

export default function Dashboard() {
  const {
    profile,
    workouts,
    habitsToday,
    weightLog,
    workoutDoneToday,
    habitScore,
  } = useAppData();

  const heightCm = Number(profile?.heightCm || 0);
  const weightKg = Number(profile?.weightKg || 0);
  const goalWeightKg = Number(profile?.goalWeightKg || profile?.targetKg || 0);
  const trainingDays = Number(profile?.trainingDays || 0);

  const latestWeight = getLatestWeight(weightLog, weightKg);
  const startWeight = getStartWeight(weightLog, weightKg);
  const remainingKg = goalWeightKg ? +(goalWeightKg - latestWeight).toFixed(1) : 0;
  const progressPct = getProgressPct(startWeight, latestWeight, goalWeightKg);
  const weeklyWorkoutCount = getLast7DaysCount(workouts);
  const workoutStreak = getWorkoutStreak(workouts);
  const bmi = getBmi(latestWeight, heightCm);

  const doneHabits = habitScore?.done || 0;
  const totalHabits = habitScore?.total || 4;
  const habitPct = habitScore?.pct || 0;

  const quickActions = [
    {
      to: "/antrenman",
      icon: Dumbbell,
      title: workoutDoneToday ? "Bugün antrenman tamam" : "Bugün antrenman",
      subtitle: workoutDoneToday ? "Harika, seri devam ediyor" : "1 kayıt = streak ilerler",
      pill: workoutDoneToday ? "Tamam" : "Yap",
    },
    {
      to: "/kilo",
      icon: Scale,
      title: "Kilo ekle",
      subtitle: "Takibi güncelle",
      pill: latestWeight ? `${latestWeight} kg` : "Yeni",
    },
    {
      to: "/aliskanlik",
      icon: CigaretteOff,
      title: "Sigara yok",
      subtitle: habitsToday?.noSmoking ? "Bugün temiz gidiyor" : "Bugünü işaretle",
      pill: habitsToday?.noSmoking ? "İyi" : "",
    },
    {
      to: "/aliskanlik",
      icon: Languages,
      title: "İngilizce",
      subtitle: habitsToday?.english ? "Bugün tamamlandı" : "En az 20 dk",
      pill: habitsToday?.english ? "Bitti" : "",
    },
    {
      to: "/aliskanlik",
      icon: BookOpen,
      title: "Kitap",
      subtitle: habitsToday?.reading ? "Günlük okuma tamam" : "Günlük okuma",
      pill: habitsToday?.reading ? "Bitti" : "",
    },
    {
      to: "/aliskanlik",
      icon: HandHeart,
      title: "Namaz / Dua",
      subtitle: habitsToday?.prayer ? "Bugün tamamlandı" : "Bugün tamamlandı mı?",
      pill: habitsToday?.prayer ? "Tamam" : "",
    },
  ];

  return (
    <div className="bt-container" style={{ padding: "16px 12px 110px" }}>
      <div className="bt-stack">
        <div className="bt-card">
          <div className="bt-row" style={{ alignItems: "flex-start" }}>
            <div>
              <div className="bt-h1">BulkTrack</div>
              <div className="bt-sub">Kas ve kilo alma takibin burada.</div>
            </div>

            <span className="bt-badge green">
              <Flame size={14} />
              Bu hafta {weeklyWorkoutCount}/{trainingDays || 7}
            </span>
          </div>

          <div style={{ height: 14 }} />

          <div className="bt-grid3">
            <MiniStat
              icon={Scale}
              title="Güncel kilo"
              value={`${latestWeight || 0} kg`}
              sub="Son kayıt / profil"
            />
            <MiniStat
              icon={Target}
              title="Hedef"
              value={goalWeightKg ? `${goalWeightKg} kg` : "-"}
              sub={goalWeightKg ? `Kalan: ${remainingKg > 0 ? `+${remainingKg}` : remainingKg} kg` : "Hedef ekle"}
            />
            <MiniStat
              icon={Dumbbell}
              title="Workout streak"
              value={`${workoutStreak}`}
              sub="Ardışık gün"
            />
          </div>

          <div style={{ height: 14 }} />

          <div className="bt-card soft pad">
            <div className="bt-row">
              <div>
                <div className="bt-h2">Kilo ilerleme</div>
                <div className="bt-sub">
                  Başlangıç: {startWeight || 0} kg · Şu an: {latestWeight || 0} kg · Hedef:{" "}
                  {goalWeightKg || 0} kg
                </div>
              </div>

              <span className="bt-badge violet">{progressPct}%</span>
            </div>

            <div style={{ height: 10 }} />

            <div className="bt-progressWrap">
              <div className="bt-progressFill" style={{ width: `${progressPct}%` }} />
            </div>
          </div>
        </div>

        <div className="bt-card">
          <div className="bt-h2">Quick Actions</div>
          <div className="bt-sub">Bugün için tek tık</div>

          <div style={{ height: 12 }} />

          <div className="bt-grid3">
            {quickActions.map((item) => (
              <QuickAction key={item.title} {...item} />
            ))}
          </div>
        </div>

        <div className="bt-card">
          <div className="bt-row">
            <div>
              <div className="bt-h2">Günün skoru</div>
              <div className="bt-sub">
                {doneHabits}/{totalHabits} tamamlandı
              </div>
            </div>

            <span className="bt-badge">{habitPct}%</span>
          </div>

          <div style={{ height: 10 }} />

          <div className="bt-progressWrap">
            <div className="bt-progressFill" style={{ width: `${habitPct}%` }} />
          </div>

          <div style={{ height: 12 }} />

          <div className="bt-row" style={{ flexWrap: "wrap", justifyContent: "flex-start" }}>
            <span className={`bt-chip ${habitsToday?.noSmoking ? "green" : ""}`}>Sigara</span>
            <span className={`bt-chip ${habitsToday?.english ? "green" : ""}`}>İngilizce</span>
            <span className={`bt-chip ${habitsToday?.reading ? "green" : ""}`}>Kitap</span>
            <span className={`bt-chip ${habitsToday?.prayer ? "green" : ""}`}>Namaz</span>
          </div>
        </div>

        <div className="bt-card">
          <div className="bt-row">
            <div>
              <div className="bt-h2">Profil özeti</div>
              <div className="bt-sub">Hızlı kontrol</div>
            </div>

            <Link to="/onboarding" className="bt-btn small">
              <PencilLine size={14} />
              Düzenle
            </Link>
          </div>

          <div style={{ height: 12 }} />

          <div className="bt-grid3">
            <MiniStat
              icon={Ruler}
              title="Boy"
              value={heightCm ? `${heightCm} cm` : "-"}
              sub={`BMI: ${bmi || 0}`}
            />
            <MiniStat
              icon={Scale}
              title="Kilo"
              value={latestWeight ? `${latestWeight} kg` : "-"}
              sub={weightLog?.length ? "Log ile güncel" : "Profil verisi"}
            />
            <MiniStat
              icon={Target}
              title="Hedef"
              value={goalWeightKg ? `${goalWeightKg} kg` : "-"}
              sub={
                goalWeightKg
                  ? `Fark: ${remainingKg > 0 ? `+${remainingKg}` : remainingKg} kg`
                  : "Hedef belirle"
              }
            />
          </div>
        </div>

        <div className="bt-grid2">
          <div className="bt-card">
            <div className="bt-h2">Bugün durumu</div>
            <div className="bt-sub">Geriye kalan en net şeyler</div>

            <div style={{ height: 12 }} />

            <div className="bt-stack">
              <div className="bt-item">
                <div className="l">
                  <div className="bt-iconBox">
                    <Dumbbell size={18} />
                  </div>
                  <div className="meta">
                    <b>Antrenman</b>
                    <span>{workoutDoneToday ? "Bugün tamamlandı" : "Bugün kayıt yok"}</span>
                  </div>
                </div>
                <div className="bt-title">{workoutDoneToday ? "✅" : "—"}</div>
              </div>

              <div className="bt-item">
                <div className="l">
                  <div className="bt-iconBox">
                    <Scale size={18} />
                  </div>
                  <div className="meta">
                    <b>Son kilo</b>
                    <span>{weightLog?.[0]?.date || "Henüz kayıt yok"}</span>
                  </div>
                </div>
                <div className="bt-title">{latestWeight ? `${latestWeight} kg` : "-"}</div>
              </div>

              <div className="bt-item">
                <div className="l">
                  <div className="bt-iconBox">
                    <CheckSquare size={18} />
                  </div>
                  <div className="meta">
                    <b>Alışkanlık skoru</b>
                    <span>Bugünkü tamamlanma</span>
                  </div>
                </div>
                <div className="bt-title">{habitPct}%</div>
              </div>
            </div>
          </div>

          <div className="bt-card">
            <div className="bt-h2">Hızlı yönlendirme</div>
            <div className="bt-sub">Bugün en mantıklı 3 hareket</div>

            <div style={{ height: 12 }} />

            <div className="bt-stack">
              <Link to="/kilo" className="bt-btn primary">
                <Scale size={16} />
                Kilo kaydı ekle
              </Link>

              <Link to="/antrenman" className="bt-btn">
                <Dumbbell size={16} />
                Antrenmanı işle
              </Link>

              <Link to="/aliskanlik" className="bt-btn ghost">
                <CheckSquare size={16} />
                Rutinleri tamamla
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}