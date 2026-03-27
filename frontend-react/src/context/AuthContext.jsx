import { createContext, useContext, useState, useEffect } from "react";
import { authApi, setToken, clearToken } from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, try to restore session via cookie
  useEffect(() => {
    authApi.me()
      .then((data) => setUser(data.user))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const data = await authApi.login(email, password); // throws on error
    setToken(data.accessToken);
    setUser(data.user);
    return data.user;
  }

  async function logout() {
    await authApi.logout().catch(() => {});
    clearToken();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
