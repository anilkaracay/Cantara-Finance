"use client";

import React from "react";
import { Box, Container, Typography, Grid } from "@mui/material";
import Card from "../cards/Card";
import { useTheme } from "../../context/ThemeContext";
import { colors } from "../../theme/colors";
import { WhyCantaraDatas } from "@/utils/data";

const DashboardSix = () => {
  const { colors: colorPalette } = useTheme();

  const handleLearnMore = (title) => {
    console.log(`Learn more clicked for: ${title}`);
    // Add your navigation logic here
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Box
        component="main"
        sx={{
          flex: 1,

          padding: "4rem 0",
        }}
      >
        <Container maxWidth="lg">
          {/* Hero Section */}
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",

              textAlign: "center",
              marginBottom: "4rem",
            }}
          >
            <Typography
              variant="h2"
              sx={{
                width: "70%",
                textAlign: "center",
                color: colorPalette.text.primary,
                fontWeight: "bold",
                marginBottom: "1.5rem",
                fontSize: { xs: "2.5rem", md: "3.5rem" },
              }}
            >
              Built for{" "}
              <Typography
                variant="span"
                sx={{ color: colorPalette.primary[50] }}
              >
                Real Capital
              </Typography>
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "#a0a0a0",
                maxWidth: "600px",
                margin: "0 auto",
                lineHeight: "1.6",
                fontSize: "1.2rem",
              }}
            >
              A hybrid credit market protocol where institutions and individuals
              can co-exist securely.
            </Typography>
          </Box>
          {/* Cards Grid */}
          <Grid
            container
            spacing={4}
            sx={{
              justifyContent: "center",
              alignItems: "stretch",
            }}
          >
            {WhyCantaraDatas.map((card, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "stretch",
                }}
              >
                <Card
                  imageSrc={card.image}
                  imageAlt={card.title}
                  title={card.title}
                  description={card.description}
                  onLearnMore={() => handleLearnMore(card.title)}
                />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default DashboardSix;
