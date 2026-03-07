const USERS_KEY = "bulktrack_users";
const SESSION_KEY = "bulktrack_session";

export function getUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function setUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function findUserByEmail(email) {
  const users = getUsers();
  const safeEmail = String(email || "").trim().toLowerCase();

  return users.find(
    (u) => String(u.email || "").trim().toLowerCase() === safeEmail
  ) || null;
}

export function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function makeId() {
  return crypto.randomUUID();
}

export function makeToken() {
  return `${Date.now()}_${Math.random().toString(36).slice(2)}`;
}