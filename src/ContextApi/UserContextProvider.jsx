import React, { useState, useEffect } from "react";
import UserContext from "./UserContext";

export default function UserContextProvider({ children }) {
  const [leadId, setLeadId] = useState(() => localStorage.getItem("leadId") || "");
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  useEffect(() => {
    localStorage.setItem("leadId", leadId);
  }, [leadId]);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.className = theme; // Apply theme class to <html>
  }, [theme]);

  const handleLeadId = (newLeadId) => {
    setLeadId(newLeadId);
    localStorage.setItem("leadId", newLeadId);
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <UserContext.Provider value={{ handleLeadId, leadId, theme, toggleTheme }}>
      {children}
    </UserContext.Provider>
  );
}
