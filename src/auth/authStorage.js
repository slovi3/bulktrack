const USERS_KEY = "bt_users";
const SESSION_KEY = "bt_session";

function safeJsonParse(str, fallback) {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

export function getUsers() {
  return safeJsonParse(localStorage.getItem(USERS_KEY), []);
}

export function setUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function findUserByEmail(email) {
  const users = getUsers();
  const e = (email || "").trim().toLowerCase();
  return users.find((u) => (u.email || "").toLowerCase() === e);
}

export function getSession() {
  return safeJsonParse(localStorage.getItem(SESSION_KEY), null);
}

export function setSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function makeToken() {
  return "bt_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function makeId() {
  return (crypto?.randomUUID?.() || String(Date.now() + Math.random()));
}