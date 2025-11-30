import { Box, Typography, Button, Container, Grid, Paper } from "@mui/material";
import React from "react";
import EdgeLightButton from "../buttons/EdgeLightButton";
import { useTheme } from "../../context/ThemeContext";
import { colors } from "../../theme/colors";

const Onboarding = () => {
  const { colors: colorPalette } = useTheme();
  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: "url('/images/OnboardingBg.jpeg')",
        backgroundSize: { xs: "cover", sm: "cover", md: "cover" },
        backgroundPosition: { xs: "center", sm: "center", md: "center" },
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.4)",
          zIndex: 0,
        },
      }}
    >
      {/* Main Content */}
      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          zIndex: 2,
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          height: "100%",
        }}
      >
        <Grid container spacing={4} alignItems="center" justifyContent="center">
          <Grid item xs={12}>
            <Box sx={{ textAlign: "center", mb: 6 }}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: "2.5rem", md: "4rem", lg: "5rem" },
                  fontWeight: "bold",
                  color: colorPalette.text.primary,
                  mb: 3,
                  lineHeight: 1.1,
                  background: `linear-gradient(45deg, ${colorPalette.text.primary} 30%, ${colorPalette.text.secondary} 90%)`,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Hybrid Money Markets
              </Typography>
              <Paper
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "fit-content",
                  p: 2,
                  px: 4,
                  position: "relative",
                  mx: "auto",
                  marginBottom: 4,
                  background: colorPalette.primary[400],
                  border: "none",
                  boxShadow: `0 4px 8px ${colors.glass.dark.shadow}`,
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "20px",
                    height: "20px",
                    borderTop: `2px solid ${colorPalette.primary[50]}`,
                    borderLeft: `2px solid ${colorPalette.primary[50]}`,
                  },
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: "20px",
                    height: "20px",
                    borderTop: `2px solid ${colorPalette.primary[50]}`,
                    borderRight: `2px solid ${colorPalette.primary[50]}`,
                  },
                }}
              >
                {/* Bottom corners */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "20px",
                    height: "20px",
                    borderBottom: `2px solid ${colorPalette.primary[50]}`,
                    borderLeft: `2px solid ${colorPalette.primary[50]}`,
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    width: "20px",
                    height: "20px",
                    borderBottom: `2px solid ${colorPalette.primary[50]}`,
                    borderRight: `2px solid ${colorPalette.primary[50]}`,
                  }}
                />
                <Box sx={{ textAlign: "center", flex: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: colorPalette.text.primary,
                      fontWeight: 600,
                      fontSize: { xs: "2rem", md: "4rem" },
                    }}
                  >
                    One Protocol
                  </Typography>
                </Box>
              </Paper>
              <Typography
                variant="h6"
                sx={{
                  color: colorPalette.text.secondary,
                  mb: 4,
                  opacity: 0.9,
                  maxWidth: "700px",
                  mx: "auto",
                }}
              >
                Cantara is a hybrid lending and borrowing protocol built on
                Canton Network. It unifies permissionless and permissioned rails
                within a single core, creating a secure gateway for
                institutional capital with transparency, privacy, and regulatory
                compliance.
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <EdgeLightButton>GET STARTED</EdgeLightButton>
                {/* <Button
                  variant="contained"
                  sx={{
                    bgcolor: "transparent",
                    color: "white",
                    px: 6,
                    py: 2,
                    fontSize: "1.25rem",
                    fontWeight: 500,
                    borderRadius: 50,
                    textTransform: "none",
                    border: "1px solid #f4f6f8",
                    boxShadow: "0 0 10px #f4f6f8, inset 0 0 10px #f4f6f8",
                    position: "relative",
                    overflow: "hidden",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background:
                        "linear-gradient(45deg, transparent 25%, rgba(0, 102, 255, 0.1) 50%, transparent 75%)",
                      backgroundSize: "200% 200%",
                      animation: "shimmer 2s infinite linear",
                    },
                    "&:hover": {
                      bgcolor: "rgba(0, 102, 255, 0.1)",
                      boxShadow: "0 0 20px #d5d9de, inset 0 0 15px #d5d9de",
                      "& .arrow": {
                        transform: "translateX(5px)",
                      },
                    },
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
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
                >
                  Earn Now
                  <Box
                    component="span"
                    className="arrow"
                    sx={{
                      fontSize: "1.4rem",
                      transition: "transform 0.3s ease",
                      display: "inline-block",
                    }}
                  >
                    →
                  </Box>
                </Button> */}
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Metrics Section */}

        {/* <Paper
          sx={{
            background: "rgba(68, 72, 84, 0.163)", // #ffffff14
            border: "1px solid rgba(255, 255, 255, 0.12)", // ince beyaz kenar
            boxShadow:
              "inset 0 0 10px rgba(255, 255, 255, 0.08), 0 8px 2px rgba(0, 0, 0, 0.45)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            position: "relative",
            overflow: "hidden",
            borderRadius: "100px",
            p: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            maxWidth: "600px",
            mx: "auto",
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: 3,
              zIndex: -1,
            },
          }}
        >
          <Box sx={{ textAlign: "center", flex: 1 }}>
            <Typography
              variant="body2"
              sx={{ color: colorPalette.text.secondary, opacity: 0.8, mb: 1 }}
            >
              APR *
            </Typography>
            <Typography
              variant="h3"
              sx={{ color: colorPalette.text.primary, fontWeight: "bold" }}
            >
              9.49%
            </Typography>
          </Box>

          <Box
            sx={{
              width: "0.1rem",
              height: 100,
              background: colors.glass.dark.border,
            }}
          />

          <Box sx={{ textAlign: "center", flex: 1 }}>
            <Typography
              variant="body2"
              sx={{ color: colorPalette.text.secondary, opacity: 0.8, mb: 1 }}
            >
              CURRENT SUPPLY
            </Typography>
            <Typography
              variant="h3"
              sx={{ color: colorPalette.text.primary, fontWeight: "bold" }}
            >
              35.0M
            </Typography>
          </Box>
        </Paper> */}
      </Container>
    </Box>
  );
};

export default Onboarding;
