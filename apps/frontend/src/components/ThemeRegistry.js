"use client";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useTheme } from "../context/ThemeContext";
import { colors } from "../theme/colors";

const MuiThemeProvider = ({ children }) => {
  const { themeMode, colors: colorPalette } = useTheme();

  const muiTheme = createTheme({
    palette: {
      mode: themeMode,
      primary: {
        main: colorPalette?.primary?.[500] || "#20B2AA",
        light: colorPalette?.primary?.[300] || "#66D2D2",
        dark: colorPalette?.primary?.[700] || "#14847D",
        contrastText: colorPalette?.text?.inverse || "#FFFFFF",
      },
      secondary: {
        main: colorPalette?.secondary?.[500] || "#B9BFC4",
        light: colorPalette?.secondary?.[300] || "#D5D9DC",
        dark: colorPalette?.secondary?.[700] || "#7F878E",
        contrastText: colorPalette?.text?.inverse || "#FFFFFF",
      },
      background: {
        default: colorPalette?.background?.primary || "#000000",
        paper: colorPalette?.background?.secondary || "#1A1A2E",
      },
      text: {
        primary: colorPalette?.text?.primary || "#FFFFFF",
        secondary: colorPalette?.text?.secondary || "#CCCCCC",
      },
      success: {
        main: colorPalette?.success || "#10B981",
      },
      warning: {
        main: colorPalette?.warning || "#F59E0B",
      },
      error: {
        main: colorPalette?.error || "#EF4444",
      },
      info: {
        main: colorPalette?.info || "#3B82F6",
      },
    },
    typography: {
      fontFamily: "var(--font-geist-sans), Arial, sans-serif",
      h1: {
        fontWeight: 700,
        color: colorPalette?.text?.primary || "#FFFFFF",
      },
      h2: {
        fontWeight: 600,
        color: colorPalette?.text?.primary || "#FFFFFF",
      },
      h3: {
        fontWeight: 600,
        color: colorPalette?.text?.primary || "#FFFFFF",
      },
      h4: {
        fontWeight: 500,
        color: colorPalette?.text?.primary || "#FFFFFF",
      },
      h5: {
        fontWeight: 500,
        color: colorPalette?.text?.primary || "#FFFFFF",
      },
      h6: {
        fontWeight: 500,
        color: colorPalette?.text?.primary || "#FFFFFF",
      },
      body1: {
        color: colorPalette?.text?.primary || "#FFFFFF",
      },
      body2: {
        color: colorPalette?.text?.secondary || "#CCCCCC",
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            borderRadius: 8,
            fontWeight: 500,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default MuiThemeProvider;
