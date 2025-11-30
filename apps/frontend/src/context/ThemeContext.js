"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { colors, themeModes, defaultTheme } from "../theme/colors";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState(defaultTheme);
  const [isLoading, setIsLoading] = useState(true);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("cantara-theme");
    if (savedTheme && Object.values(themeModes).includes(savedTheme)) {
      setThemeMode(savedTheme);
    }
    setIsLoading(false);
  }, []);

  // Save theme to localStorage when it changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("cantara-theme", themeMode);
    }
  }, [themeMode, isLoading]);

  const toggleTheme = () => {
    setThemeMode((prevMode) =>
      prevMode === themeModes.LIGHT ? themeModes.DARK : themeModes.LIGHT
    );
  };

  const setLightTheme = () => setThemeMode(themeModes.LIGHT);
  const setDarkTheme = () => setThemeMode(themeModes.DARK);

  const currentColors = colors[themeMode];
  const isDark = themeMode === themeModes.DARK;
  const isLight = themeMode === themeModes.LIGHT;

  const value = {
    themeMode,
    colors: currentColors,
    isDark,
    isLight,
    toggleTheme,
    setLightTheme,
    setDarkTheme,
    isLoading,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
