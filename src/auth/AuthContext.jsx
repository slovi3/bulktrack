import React, { createContext, useEffect, useMemo, useReducer, useRef } from "react";
import {
  clearSession,
  findUserByEmail,
  getSession,
  getUsers,
  makeId,
  makeToken,
  setSession,
  setUsers,
} from "./authStorage";

const AuthContext = createContext(null);
export { AuthContext };

const initialState = { user: null, booting: true };

function reducer(state, action) {
  switch (action.type) {
    case "BOOT_DONE":
      return { user: action.user ?? null, booting: false };
    case "SET_USER":
      return { user: action.user ?? null, booting: false };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // StrictMode dev'de effect 2 kere çalışabiliyor → bunu engelliyoruz
  const didInit = useRef(false);

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    const session = getSession();
    if (session?.userId) {
      const users = getUsers();
      const u = users.find((x) => x.id === session.userId) || null;
      dispatch({ type: "BOOT_DONE", user: u });
    } else {
      dispatch({ type: "BOOT_DONE", user: null });
    }
  }, []);

  const value = useMemo(() => {
    return {
      user: state.user,
      booting: state.booting,

      register: ({ email, password }) => {
        const exists = findUserByEmail(email);
        if (exists) throw new Error("Bu email zaten kayıtlı.");

        const newUser = {
          id: makeId(),
          email: email.trim(),
          password, // mock
          createdAt: new Date().toISOString(),
          profile: {
            fullName: "",
            goal: "",
            heightCm: null,
            weightKg: null,
            targetKg: null,
            activity: "",
            trainingDays: null,
          },
        };

        const users = getUsers();
        users.push(newUser);
        setUsers(users);

        const token = makeToken();
        setSession({ token, userId: newUser.id });

        dispatch({ type: "SET_USER", user: newUser });
        return newUser;
      },

      login: ({ email, password }) => {
        const u = findUserByEmail(email);
        if (!u) throw new Error("Kullanıcı bulunamadı.");
        if (u.password !== password) throw new Error("Şifre hatalı.");

        const token = makeToken();
        setSession({ token, userId: u.id });

        dispatch({ type: "SET_USER", user: u });
        return u;
      },

      logout: () => {
        clearSession();
        dispatch({ type: "SET_USER", user: null });
      },

      updateProfile: (patch) => {
        if (!state.user) return;

        const users = getUsers();
        const idx = users.findIndex((x) => x.id === state.user.id);
        if (idx === -1) return;

        const updated = {
          ...users[idx],
          profile: {
            ...users[idx].profile,
            ...patch,
          },
        };

        users[idx] = updated;
        setUsers(users);

        dispatch({ type: "SET_USER", user: updated });
        return updated;
      },
    };
  }, [state.user, state.booting]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}