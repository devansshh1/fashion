import { createContext, useState, useEffect } from "react";
import React from "react";
import API from "../api/API";
import { authSession } from "../auth/sessionStorage";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    API.get("/api/auth/user/me")
      .then(res => {
        if (isMounted) {
          setUser(res.data);
        }
      })
      .catch(() => {
        if (isMounted) {
          authSession.clearUserToken();
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
    authSession.clearUserToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
