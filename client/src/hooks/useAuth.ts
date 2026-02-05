import { useState, useEffect } from "react";

export const useAuth = () => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUserId(storedUserId);
  }, []);

  const login = (id: string) => {
    localStorage.setItem("userId", id);
    setUserId(id);
  };

  const logout = () => {
    localStorage.removeItem("userId");
    setUserId(null);
  };

  return { userId, login, logout };
};
