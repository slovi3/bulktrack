const KEY = "bulktrack.v1";

const defaultData = {
  goalKg: 65,
  weights: [], // { id, date: "YYYY-MM-DD", kg: number }
  workouts: [], // { id, date: "YYYY-MM-DD", title: string, note?: string }
};

export function loadData() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultData;
    const parsed = JSON.parse(raw);

    return {
      ...defaultData,
      ...parsed,
      weights: Array.isArray(parsed.weights) ? parsed.weights : [],
      workouts: Array.isArray(parsed.workouts) ? parsed.workouts : [],
      goalKg: typeof parsed.goalKg === "number" ? parsed.goalKg : defaultData.goalKg,
    };
  } catch {
    return defaultData;
  }
}

export function saveData(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}