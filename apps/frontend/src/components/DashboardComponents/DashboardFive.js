"use client";

import React from "react";
import { Box, Container, Typography, Grid } from "@mui/material";
import Card from "../cards/Card";
import { useTheme } from "../../context/ThemeContext";
import { colors } from "../../theme/colors";
import { CoreValuesDatas } from "@/utils/data";
import { getBuiltForTrustImages } from "@/utils/helpers";

const DashboardFive = () => {
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
        <Container maxWidth="lg" sx={{ px: 0 }}>
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
              Built for Trust, Designed for Institutions
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
              Cantara is engineered to be secure, compliant, and
              capital-efficient: no hidden risks, no opaque processes, just
              transparent, auditable lending markets.
            </Typography>
          </Box>
          {/* Cards Grid */}
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mx: "auto",
            }}
          >
            <Grid
              container
              spacing={{ xs: 2, sm: 3, md: 3 }}
              sx={{
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                mx: { xs: 2, md: 1 },
                px: { xs: 2, md: 0 },
                maxWidth: { md: 900, lg: 960 },
              }}
            >
              {CoreValuesDatas.map((card, index) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  lg={6}
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Card
                    imageSrc={getBuiltForTrustImages(String(index + 1))}
                    imageAlt={`Built for Trust ${index + 1}`}
                    title={card.title}
                    description={card.description}
                    onLearnMore={() => handleLearnMore(card.title)}
                    cardWidth={{ xs: "100%", sm: 300, md: 360 }}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Summary Section */}
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",

              textAlign: "center",
              marginBottom: "4rem",
              marginTop: "8rem",
            }}
          >
            <Typography
              sx={{
                width: "100%",
                textAlign: "center",
                color: colorPalette.text.primary,
                fontWeight: "bold",
                marginBottom: "1.5rem",
                fontSize: { xs: "1.5rem", md: "2rem" },
              }}
            >
              Not Your Average Lending Protocol
            </Typography>
            <Typography
              sx={{
                width: "65%",
                color: colorPalette.text.secondary,
                margin: "0 auto",
                lineHeight: "1.6",
                fontSize: "1rem",
              }}
            >
              We didn&apos;t just fork an existing DeFi money market. We built a
              hybrid protocol where institutions and individuals can co-exist
              securely.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default DashboardFive;
