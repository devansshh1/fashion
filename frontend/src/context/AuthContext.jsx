import { createContext, useState, useEffect } from "react";
import React from "react";
import API from "../api/API";
export const AuthContext = createContext();

const STARTUP_REQUEST_TIMEOUT = 10000;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    API.get("/api/auth/user/me", { timeout: STARTUP_REQUEST_TIMEOUT })
      .then(res => {
        if (isMounted) {
          setUser(res.data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setUser(null);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const logout = async () => {
    await API.post("/api/auth/user/logout");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
