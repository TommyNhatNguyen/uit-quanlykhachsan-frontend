import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/auth";

const AuthContext = createContext(null);

const STORAGE_KEY = "auth_user";

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = async (username, password) => {
    const employee = await authApi.login({ username, password });
    setUser(employee);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(employee));
    return employee;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      navigate("/dashboard", { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
