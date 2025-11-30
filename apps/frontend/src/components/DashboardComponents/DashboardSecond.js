"use client";

import React from "react";
import { Box, Container, Typography, Grid } from "@mui/material";
import HubCard from "../cards/HubCard";
import RotatingLogos from "../animations/RotatingLogos";
import { useTheme } from "../../context/ThemeContext";
import { colors } from "../../theme/colors";
import PartnershipBanner from "./PartnershipBanner";
import { hubCardsInformations } from "@/utils/data";

const DashboardSecond = () => {
  const { colors: colorPalette } = useTheme();

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        justifyContent: "space-between",
        alignItems: "center",
        background: colorPalette.background.primary,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Dönen Logolar */}
      {/* <RotatingLogos /> */}
      {/* <PartnershipBanner /> */}

      <Container
        maxWidth="xl"
        sx={{ position: "relative", zIndex: 1, marginTop: "100px" }}
      >
        <Grid
          container
          spacing={4}
          sx={{
            alignItems: "flex-start",
            paddingLeft: "120px",
            paddingRight: "120px",
          }}
        >
          {hubCardsInformations.map((card, index) => (
            <Grid
              item
              xs={12}
              md={4}
              key={index}
              sx={{
                display: "flex",
                justifyContent: "center",
                // Ortadaki kartı hafif yukarı taşı
                transform: index === 1 ? "translateY(-20px)" : "none",
                transition: "transform 0.3s ease",
              }}
            >
              <HubCard {...card} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default DashboardSecond;
