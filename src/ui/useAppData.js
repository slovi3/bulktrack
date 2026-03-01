// src/ui/useAppData.js
import { useMemo, useState } from "react";

export const LS_PROFILE = "bulktrack_profile";
export const LS_WORKOUTS = "bulktrack_workouts";
export const LS_HABITS = "bulktrack_habits_daily";
export const LS_WEIGHT_LOG = "bulktrack_weight_log";

export function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

export function toYMD(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function uid() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function defaultHabitDay() {
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

export default function useAppData() {
  const today = useMemo(() => toYMD(new Date()), []);

  const [profile, setProfile] = useState(() =>
    readJSON(LS_PROFILE, { heightCm: "", weightKg: "", goalWeightKg: "" })
  );

  const [workouts, setWorkouts] = useState(() => {
    const raw = readJSON(LS_WORKOUTS, []);
    return Array.isArray(raw) ? raw : [];
  });

  const [habitsDb, setHabitsDb] = useState(() => readJSON(LS_HABITS, {}));

  const [weightLog, setWeightLog] = useState(() => {
    const raw = readJSON(LS_WEIGHT_LOG, []);
    return Array.isArray(raw) ? raw : [];
  });

  const habitsToday = habitsDb[today] || defaultHabitDay();

  // --- derived ---
  const workoutDoneToday = workouts.some((w) => w.date === today);

  const habitScore = useMemo(() => {
    const keys = ["noSmoking", "reading", "english", "prayer"];
    const done = keys.reduce((acc, k) => acc + (habitsToday[k] ? 1 : 0), 0);
    return { done, total: keys.length, pct: Math.round((done / keys.length) * 100) };
  }, [habitsToday]);

  // --- mutations / actions ---
  const saveProfile = (next) => {
    setProfile(next);
    writeJSON(LS_PROFILE, next);
  };

  const addWorkoutToday = () => {
    if (workouts.some((w) => w.date === today)) return false;

    const entry = { id: uid(), date: today, title: "Antrenman", note: "", createdAt: Date.now() };
    const next = [entry, ...workouts].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    setWorkouts(next);
    writeJSON(LS_WORKOUTS, next);
    return true;
  };

  const toggleHabitToday = (key) => {
    const cur = habitsDb[today] || defaultHabitDay();
    const nextDay = { ...cur, [key]: !cur[key], updatedAt: Date.now() };
    const nextDb = { ...habitsDb, [today]: nextDay };
    setHabitsDb(nextDb);
    writeJSON(LS_HABITS, nextDb);
    return nextDay[key]; // new value
  };

  const addWeightEntry = (kg, ymd = today) => {
    const n = Number(kg);
    if (!Number.isFinite(n)) return false;

    const entry = { id: uid(), kg: n, date: ymd, createdAt: Date.now() };
    const next = [entry, ...weightLog].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    setWeightLog(next);
    writeJSON(LS_WEIGHT_LOG, next);

    // profile kilo güncelle
    const nextProfile = { ...profile, weightKg: String(n) };
    saveProfile(nextProfile);
    return true;
  };

  return {
    today,

    profile,
    workouts,
    habitsDb,
    habitsToday,
    weightLog,

    workoutDoneToday,
    habitScore,

    actions: {
      saveProfile,
      addWorkoutToday,
      toggleHabitToday,
      addWeightEntry,
    },
  };
}