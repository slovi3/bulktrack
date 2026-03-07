const KEY = "bulktrack_users";

export function getUsers() {
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveUsers(users) {
  localStorage.setItem(KEY, JSON.stringify(users));
}

export function findUser(email) {
  const users = getUsers();
  return users.find((u) => u.email === email);
}

export function addUser(user) {
  const users = getUsers();
  users.push(user);
  saveUsers(users);
}