import React from "react";
import { Box, Button } from "@mui/material";
import { keyframes } from "@mui/system";
import { useTheme } from "@/context/ThemeContext";
import { colors } from "@/theme/colors";

const alongBorder = keyframes`
  from { stroke-dashoffset: 0; }
  to   { stroke-dashoffset: -1000; } /* pathLength ile normalize */
`;

export default function EdgeLightButton({ children }) {
  const { colors: colorPalette, isDark, toggleTheme } = useTheme();
  const [isHovered, setIsHovered] = React.useState(false);
  
  return (
    <Box
      sx={{
        position: "relative",
        display: "inline-block",
        // .edge sınıfına animasyonu sx içinde bağla (kritik nokta)
        "& .edge": {
          animation: `${alongBorder} 12s linear infinite`,
        },
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Buton */}
      <Button
        sx={{
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(20px)",
          color: colorPalette.text.primary,
          borderRadius: 3,
          px: 4,
          py: 1.5,
          textTransform: "none",
          fontWeight: 500,
          boxShadow: `0 8px 32px ${colors.glass.dark.shadow}`,
          width: { xs: "120px", sm: "140px", md: "160px" },
          "&:hover": {
            backdropFilter: "blur(25px)",
            boxShadow: `0 12px 40px ${colors.glass.dark.shadow}`,
          },
        }}
      >
        {isHovered ? "Coming Soon" : children}
      </Button>

      {/* Kenar boyunca dolaşan tek çizgi (SVG stroke animasyonu) */}
      <Box
        aria-hidden
        sx={{
          pointerEvents: "none",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 2,
          borderRadius: 3,
          overflow: "visible",
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1000 300"
          preserveAspectRatio="none"
          style={{ display: "block" }}
        >
          {/* Işık çizgisi tam buton kenarına hizalı */}
          <rect
            x="1" // çok hafif içeride başlat
            y="1"
            width="998"
            height="298"
            rx="64" // radius=3 MUI&apos;de px cinsinden, SVG&apos;de ~16px&apos;e denk
            ry="64"
            fill="none"
            pathLength="1000"
            className="edge"
            stroke="rgba(255,255,255,0.9)"
            strokeWidth="1" // kalınlık
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            strokeDasharray="40 960" // 40px ışık, 960px boşluk
            filter="drop-shadow(0 0 8px rgba(255,255,255,0.4))"
          />
        </svg>
      </Box>
    </Box>
  );
}
