"use client";

import React from "react";
import {
  Box,
  Typography,
  useMediaQuery,
  useTheme as useMuiTheme,
} from "@mui/material";
import Image from "next/image";
import { useTheme } from "@/context/ThemeContext";
import { getPartnerLogoPNG } from "@/utils/helpers";

const partners = [
  { id: 1, name: "Canton", logo: "/images/partnersLogo/CantonLogo.png" },
  { id: 2, name: "Goldtag", logo: "/images/partnersLogo/GoldtagLogo.png" },
  { id: 3, name: "Whitebit", logo: "/images/partnersLogo/WhitebitLogo.png" },
  // { id: 4, name: "Republic", logo: "/images/partnersLogo/RepubligLogo.png" },
  { id: 5, name: "Colendi", logo: "/images/partnersLogo/ColendiLogo.png" },
];

const PartnershipBanner = () => {
  const { colors: colorPalette } = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        width: "100%",
        position: "relative",
        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        py: { xs: 3, md: 6 },
        overflow: "hidden",
      }}
    >
      <Typography
        sx={{
          width: "100%",
          textAlign: "center",
          color: "rgba(255, 255, 255, 0.6)",
          fontSize: { xs: "0.75rem", md: "0.875rem" },
          letterSpacing: { xs: "1px", md: "2px" },
          textTransform: "uppercase",
          mb: { xs: 2, md: 3 },
          fontFamily: "monospace",
        }}
      >
        In Partnership With
      </Typography>

      {/* Ana akış container */}
      <Box
        sx={{
          display: "flex",
          width: "fit-content",
          animation: "infiniteScroll 25s linear infinite",
          "@keyframes infiniteScroll": {
            "0%": { transform: "translateX(0)" },
            "100%": { transform: "translateX(calc(-100% / 3))" }, // 3 kopya olduğu için
          },
          "&:hover": {
            animationPlayState: "paused",
          },
        }}
      >
        {/* 🔁 Üç kopya yan yana — mükemmel sonsuz döngü için */}
        {[...Array(3)].map((_, i) => (
          <Box
            key={i}
            sx={{
              display: "flex",
              gap: { xs: 6, md: 10 },
              pr: { xs: 6, md: 10 },
              minWidth: "fit-content",
            }}
          >
            {partners.map((partner) => (
              <Box
                key={`${partner.id}-${i}`}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: { xs: "120px", sm: "140px", md: "160px" },
                  maxWidth: { xs: "120px", sm: "140px", md: "160px" },
                  height: { xs: "50px", sm: "60px", md: "70px" },
                  filter: "brightness(0.7) grayscale(1)",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  "&:hover": {
                    filter: "brightness(1) grayscale(0)",
                    transform: "scale(1.1)",
                  },
                }}
              >
                <Image
                  src={getPartnerLogoPNG(partner.id.toString())}
                  alt={partner.name}
                  width={160}
                  height={70}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </Box>
            ))}
          </Box>
        ))}
      </Box>

      {/* Fade overlay'ler - Daha yumuşak geçişler için */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: { xs: "60px", md: "120px" },
          height: "100%",
          background:
            "linear-gradient(to right, rgba(0,0,0,1), rgba(0,0,0,0.8), transparent)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          width: { xs: "60px", md: "120px" },
          height: "100%",
          background:
            "linear-gradient(to left, rgba(0,0,0,1), rgba(0,0,0,0.8), transparent)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />
    </Box>
  );
};

export default PartnershipBanner;
