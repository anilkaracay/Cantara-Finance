"use client";

import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  useMediaQuery,
  useTheme as useMuiTheme,
} from "@mui/material";
import Card from "../cards/Card";
import { useTheme } from "../../context/ThemeContext";
import { colors } from "../../theme/colors";
import { howCantaraWorksDatas } from "@/utils/data";
import Image from "next/image";

const DashboardThird = () => {
  const { colors: colorPalette } = useTheme();
  const muiTheme = useMuiTheme();

  const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"));
  const isTablet = useMediaQuery(muiTheme.breakpoints.between("md", "lg"));
  const isDesktop = useMediaQuery(muiTheme.breakpoints.up("lg"));

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
          backgroundColor: "#000000",
          padding: "4rem 0",
        }}
      >
        <Container maxWidth="lg" sx={{ px: { xs: 2, md: 3 } }}>
          {/* Hero Section */}
          <Box
            sx={{
              textAlign: "center",
              marginBottom: { xs: "2rem", md: "4rem" },
              px: { xs: 2, md: 0 },
            }}
          >
            <Typography
              variant="h2"
              sx={{
                background: colorPalette.text.primary,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontWeight: "bold",
                marginBottom: { xs: "1rem", md: "1.5rem" },
                fontSize: {
                  xs: "2rem",
                  sm: "2.5rem",
                  md: "3.5rem",
                  lg: "4rem",
                },
                lineHeight: 1.1,
              }}
            >
              How Cantara Works
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "#a0a0a0",
                maxWidth: { xs: "100%", md: "600px" },
                margin: "0 auto",
                lineHeight: "1.6",
                fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem" },
                px: { xs: 2, md: 0 },
              }}
            >
              Our hybrid credit market operates in 4 simple steps.
            </Typography>
          </Box>

          {/* Cards Grid */}
          <Grid
            container
            spacing={{ xs: 3, md: 6 }}
            sx={{
              justifyContent: "center",
              alignItems: "center",
              mb: { xs: 3, md: 4 },
            }}
          >
            {howCantaraWorksDatas.map((card, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={4}
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  p: { xs: 1, md: 2 },
                }}
              >
                <Card
                  imageSrc={`/images/dashboardImages/card${index + 1}.png`}
                  imageAlt={`Step ${index + 1}`}
                  title={card.title}
                  description={card.description}
                  onLearnMore={() => handleLearnMore(card.title)}
                />
              </Grid>
            ))}
          </Grid>
          {/* Last Card */}
          <Box
            sx={{
              flexDirection: { xs: "column", md: "row" },
              width: "100%",
              maxHeight: { xs: "auto", md: 430 },
              color: "white",
              px: { xs: 3, md: 2 },
              py: { xs: 3, md: 4 },
              fontSize: { xs: "1rem", md: "1.25rem" },
              fontWeight: 500,
              borderRadius: { xs: "64px", md: "64px" },
              textTransform: "none",
              background: "rgba(68, 72, 84, 0.163)", // #ffffff14
              border: "1px solid rgba(255, 255, 255, 0.12)", // ince beyaz kenar
              boxShadow:
                "inset 0 0 10px rgba(255, 255, 255, 0.08), 0 8px 2px rgba(0, 0, 0, 0.45)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              position: "relative",
              overflow: "hidden",

              "&:hover": {
                bgcolor: "rgba(228, 239, 254, 0.1)",
                // boxShadow: "0 0 20px #767676, inset 0 0 15px #767676",
                boxShadow:
                  "inset 0 0 10px rgba(255, 255, 255, 0.08), 0 8px 32px rgba(0, 0, 0, 0.45)",
                "& .arrow": {
                  transform: "translateX(5px)",
                },
              },
              display: "flex",
              alignItems: "center",
              gap: { xs: 2, md: 1.5 },
              transition: "all 0.3s ease",
              "@keyframes shimmer": {
                "0%": {
                  backgroundPosition: "200% 0",
                },
                "100%": {
                  backgroundPosition: "-200% 0",
                },
              },
            }}
            // sx={{
            //   backgroundColor: "#1A1A1A",
            //   borderRadius: "12px",
            //   padding: "1.5rem",
            //   textAlign: "left",
            //   boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            //   transition: "all 0.3s ease",
            //   height: "100%",
            //   display: "flex",
            //   flexDirection: "column",
            //   alignItems: "flex-start",
            //   aspectRatio: "1 / 1", // Makes the card square
            //   maxWidth: "300px", // Limit maximum width
            //   width: "100%",
            //   "&:hover": {
            //     transform: "translateY(-8px)",
            //     boxShadow: "0 8px 30px rgba(0, 0, 0, 0.15)",
            //   },
            // }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: { xs: "center", md: "flex-start" },
                justifyContent: "center",
                width: { xs: "100%", md: "50%" },
                height: "100%",
                textAlign: { xs: "center", md: "left" },
                marginLeft: { xs: 0, md: 4 },
              }}
            >
              {/* <Typography
                sx={{
                  fontSize: "1rem",
                  position: "absolute",
                  top: 20,
                  left: 50,
                }}
              >
                step4
              </Typography> */}

              {/* Title */}
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  color: "white",
                  marginBottom: { xs: "0.5rem", md: "0.75rem" },
                  fontSize: { xs: "1rem", md: "1.1rem" },
                  ml: { xs: 0, md: 3 },
                  textAlign: { xs: "center", md: "left" },
                }}
              >
                Risk Management & Settlement
              </Typography>

              {/* Description */}
              <Typography
                variant="body2"
                sx={{
                  color: "#a0a0a0",
                  lineHeight: "1.5",
                  marginBottom: { xs: "1rem", md: "1.5rem" },
                  flex: 1,
                  fontSize: { xs: "0.85rem", md: "0.9rem" },
                  px: { xs: 0, md: 1 },
                  textAlign: { xs: "center", md: "left" },
                }}
              >
                If your HF drops below the threshold, your position is partially
                liquidated. The Insurance Vault steps in first, followed by
                Junior Tranche absorbing losses.
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: { xs: "100%", md: "50%" },
                mt: { xs: 2, md: 0 },
              }}
            >
              {/* Image */}
              <Box
                sx={{
                  width: "70%",
                  height: { xs: 150, md: 250 },
                  backgroundColor: "#58585848",
                  borderRadius: { xs: "54px", md: "54px" },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: { xs: 0, md: "1rem" },
                  fontSize: { xs: "1.2rem", md: "1.5rem" },
                }}
              >
                <Image
                  src="/images/dashboardImages/card4.png"
                  alt="Step 4"
                  width={800}
                  height={400}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "54px",
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default DashboardThird;
