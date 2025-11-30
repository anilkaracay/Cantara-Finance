import { useTheme } from "../context/ThemeContext";

export const useSocialMediaIconStyles = () => {
  const { colors: colorPalette } = useTheme();

  return {
    color: colorPalette.text.primary,
    background: "rgba(255, 255, 255, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: 3,
    width: 44,
    height: 44,
    p: 0.5,
    "&:hover": {
      color: colorPalette.primary[50],
      background: "rgba(255, 255, 255, 0.12)",
      border: "1px solid rgba(255, 255, 255, 0.28)",
      transform: "translateY(-1px)",
      boxShadow: `0 4px 14px ${colorPalette.primary[50]}25`,
    },
    transition: "all 0.3s ease",
  };
};
