// context/ThemeContext.jsx
import React, { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const color = isDarkMode
    ? { background: "#1a1a1a", text: "#fff", textSecondary: "#ccc", primary: "#4a90e2", secondary: "#50e3c2", surface: "#2a2a2a", error: "#ff4444" }
    : { background: "#f5f5f5", text: "#000", textSecondary: "#666", primary: "#4a90e2", secondary: "#50e3c2", surface: "#fff", error: "#ff4444" };

  return (
    <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode, color }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeProvider; 