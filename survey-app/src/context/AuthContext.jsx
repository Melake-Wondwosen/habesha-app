import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("survey_user"));
    } catch {
      return null;
    }
  });

  const login = (userData) => {
    localStorage.setItem("survey_user", JSON.stringify(userData));
    setUser(userData);
  };

  /* Queued surveys deliberately survive sign-out. They belong to the
     device, not the session: a BA who signs out on a shared phone
     before reaching signal would otherwise destroy another BA's
     unsent work. */
  const logout = () => {
    localStorage.removeItem("survey_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
