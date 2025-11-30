// Cantara Finance Color Palette
export const colors = {
  light: {
    // Primary Colors
    primary: {
      50: "#9683ef",
      100: "#a896f0",
      200: "#bca9f2",
      300: "#d0bcf4",
      400: "#e4cff6",
      500: "#8cff96", // Main primary - yeşil başlangıç
      600: "#a8ffb0",
      700: "#c4ffca",
      800: "#e0ffe4",
      900: "#f0fff2",
    },

    // Secondary Colors
    secondary: {
      50: "#F8F9FA",
      100: "#F1F3F4",
      200: "#E3E6E8",
      300: "#D5D9DC",
      400: "#C7CCD0",
      500: "#B9BFC4",
      600: "#d1d5d9",
      700: "#e9ebed",
      800: "#f1f2f4",
      900: "#f8f9fa",
    },

    // Accent Colors
    accent: {
      purple: "#8B5CF6",
      pink: "#EC4899",
      blue: "#3B82F6",
      green: "#10B981",
      orange: "#F59E0B",
    },

    // Neutral Colors
    neutral: {
      50: "#FFFFFF",
      100: "#F8F9FA",
      200: "#F1F3F4",
      300: "#E3E6E8",
      400: "#D5D9DC",
      500: "#B9BFC4",
      600: "#d1d5d9",
      700: "#e9ebed",
      800: "#f1f2f4",
      900: "#f8f9fa",
    },

    // Background Colors
    background: {
      primary: "#FFFFFF",
      secondary: "#F8F9FA",
      tertiary: "#F1F3F4",
    },

    // Text Colors
    text: {
      primary: "#1A1A1A",
      secondary: "#454F58",
      tertiary: "#7F878E",
      inverse: "#FFFFFF",
    },

    // Status Colors
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#3B82F6",
  },

  dark: {
    // Primary Colors
    primary: {
      50: "#9683ef",
      100: "#a896f0",
      200: "#bca9f2",
      300: "#d0bcf4",
      400: "#e4cff632",
      500: "#031635", // Main primary - dark blue
      600: "#184b76", // Medium blue
      700: "#2d5a8a", // Lighter blue
      800: "#82c3dbff", // Even lighter blue
      900: "#97cfe322", // Lightest blue
    },

    // Secondary Colors
    secondary: {
      50: "#1A1A1A",
      100: "#2D2D2D",
      200: "#404040",
      300: "#535353",
      400: "#666666",
      500: "#808080",
      600: "#a3a3a3",
      700: "#c6c6c6",
      800: "#e9e9e9",
      900: "#f5f5f5",
    },

    // Accent Colors
    accent: {
      purple: "#A78BFA",
      pink: "#F472B6",
      blue: "#60A5FA",
      green: "#34D399",
      orange: "#FBBF24",
    },

    // Neutral Colors
    neutral: {
      50: "#0A0A0A",
      100: "#1A1A1A",
      200: "#2D2D2D",
      300: "#404040",
      400: "#535353",
      500: "#666666",
      600: "#a3a3a3",
      700: "#c6c6c6",
      800: "#e9e9e9",
      900: "#f5f5f5",
    },

    // Background Colors
    background: {
      primary: "#000000",
      secondary: "#1A1A2E",
      tertiary: "#16213E",
    },

    // Text Colors
    text: {
      primary: "#FFFFFF",
      secondary: "#CCCCCC",
      tertiary: "#999999",
      inverse: "#1A1A1A",
    },

    // Status Colors
    success: "#20c55f",
    waiting: "#ebb30b",
    warning: "#fb7215",
    danger: "#fb3f3f",
    info: "#60A5FA",
  },

  // Glassmorphism Colors
  glass: {
    light: {
      background: "rgba(255, 255, 255, 0.1)",
      border: "rgba(255, 255, 255, 0.2)",
      shadow: "rgba(0, 0, 0, 0.1)",
    },
    dark: {
      background: "rgba(255, 255, 255, 0.05)",
      border: "rgba(255, 255, 255, 0.1)",
      shadow: "rgba(0, 0, 0, 0.3)",
    },
  },
};

// Theme modes
export const themeModes = {
  LIGHT: "light",
  DARK: "dark",
};

// Default theme
export const defaultTheme = themeModes.DARK;
