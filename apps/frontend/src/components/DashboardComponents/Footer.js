"use client";

import React from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  IconButton,
  useMediaQuery,
  useTheme as useMuiTheme,
} from "@mui/material";
import { useTheme } from "../../context/ThemeContext";
import { colors } from "../../theme/colors";
import TwitterIcon from "@/components/svgs/TwitterIcon";
import LinkedinIcon from "@/components/svgs/LinkedinIcon";
import GithubIcon from "@/components/svgs/GithubIcon";
import { useSocialMediaIconStyles } from "@/styles/generalStyles";
import DiscordLogo from "@/components/svgs/DiscordLogo";

const Footer = () => {
  const { colors: colorPalette } = useTheme();
  const muiTheme = useMuiTheme();
  const socialMediaIconStyles = useSocialMediaIconStyles();

  const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"));
  const isTablet = useMediaQuery(muiTheme.breakpoints.between("md", "lg"));
  const isDesktop = useMediaQuery(muiTheme.breakpoints.up("lg"));

  const socialLinks = {
    twitter: "https://x.com/",
    linkedin: "https://tr.linkedin.com/",
    github: "https://github.com/",
    discord: "https://discord.com/",
  };

  return (
    <Box
      sx={{
        background: "rgba(68, 72, 84, 0.163)", // #ffffff14
        border: "1px solid rgba(255, 255, 255, 0.12)", // ince beyaz kenar
        boxShadow:
          "inset 0 0 10px rgba(255, 255, 255, 0.08), 0 8px 2px rgba(0, 0, 0, 0.45)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        position: "relative",
        overflow: "hidden",
        borderRadius: { xs: "16px", md: "24px" },
        py: { xs: 4, md: 6 },
        px: { xs: 2, md: 4 },
        mt: { xs: 4, md: 8 },
        mx: { xs: 2, md: 0 },
      }}
    >
      <Box
        sx={{
          maxWidth: { xs: "100%", md: "90%" },
          mx: "auto",
          background: "#262a3082",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          boxShadow:
            "inset 0 0 10px rgba(255, 255, 255, 0.08), 0 8px 2px rgba(0, 0, 0, 0.45)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderRadius: { xs: "16px", md: "24px" },
          p: { xs: 3, md: 6 },
        }}
      >
        {/* Social Media Icons - Prominent */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: { xs: 4, sm: 6, md: 8, lg: 10 },
            mb: { xs: 4, md: 6 },
            flexWrap: "wrap",
            width: "100%",
          }}
        >
          <IconButton
            component="a"
            href={socialLinks.twitter}
            target="_blank"
            rel="noopener noreferrer"
            sx={socialMediaIconStyles}
          >
            <TwitterIcon sx={{ fontSize: { xs: 20, md: 24 } }} />
          </IconButton>

          <IconButton
            component="a"
            href={socialLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            sx={socialMediaIconStyles}
          >
            <LinkedinIcon sx={{ fontSize: { xs: 20, md: 24 } }} />
          </IconButton>

          <IconButton
            component="a"
            href={socialLinks.github}
            target="_blank"
            rel="noopener noreferrer"
            sx={socialMediaIconStyles}
          >
            <GithubIcon sx={{ fontSize: { xs: 20, md: 24 } }} />
          </IconButton>

          <IconButton
            component="a"
            href={socialLinks.discord}
            target="_blank"
            rel="noopener noreferrer"
            sx={socialMediaIconStyles}
          >
            <DiscordLogo sx={{ fontSize: { xs: 20, md: 24 } }} />
          </IconButton>
        </Box>

        <Grid container spacing={{ xs: 4, md: 6 }} alignItems="flex-start">
          {/* Left Section - CTA */}
          <Grid item xs={12} md={6}>
            <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
              {/* CTA Heading */}
              <Typography
                variant="h3"
                sx={{
                  color: colorPalette.primary[50],
                  fontWeight: 700,
                  fontSize: { xs: "1.5rem", sm: "1.8rem", md: "2.5rem" },
                  mb: { xs: 1.5, md: 2 },
                }}
              >
                Build on Cantara
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  color: colorPalette.text.secondary,
                  fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
                  mb: { xs: 3, md: 4 },
                  lineHeight: 1.4,
                }}
              >
                Hybrid credit markets for crypto and real-world assets.
              </Typography>

              {/* CTA Button */}
              <Button
                sx={{
                  background: colorPalette.text.primary,
                  color: colorPalette.text.inverse,
                  px: { xs: 3, md: 4 },
                  py: { xs: 1.2, md: 1.5 },
                  borderRadius: 2,
                  textTransform: "uppercase",
                  fontWeight: 600,
                  fontSize: { xs: "0.8rem", md: "0.9rem" },
                  mb: { xs: 3, md: 4 },
                  "&:hover": {
                    background: colorPalette.primary[50],
                    transform: "translateY(-2px)",
                    boxShadow: `0 8px 25px ${colorPalette.primary[500]}40`,
                  },
                  transition: "all 0.3s ease",
                }}
                component="a"
                href="#onboarding"
              >
                Get Started
              </Button>

              {/* Legal Disclaimer */}
              <Typography
                variant="body2"
                sx={{
                  color: colorPalette.text.tertiary,
                  fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.8rem" },
                  lineHeight: 1.5,
                  maxWidth: { xs: "100%", md: "400px" },
                  textAlign: { xs: "center", md: "left" },
                }}
              >
                Content on this site is for informational purposes only and is
                not a public offer. For business or partnership inquiries, email
                us at{" "}
                <Box
                  component="a"
                  href="mailto:contact@cantara.finance"
                 // target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: colorPalette.text.primary,
                    fontWeight: 600,
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  contact@cantara.finance
                </Box>
              </Typography>
            </Box>
          </Grid>

          {/* Right Section - Navigation Links */}
          <Grid item xs={12} md={6}>
            <Grid container spacing={{ xs: 3, md: 4 }}>
              {/* Resources Column */}
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="h6"
                  sx={{
                    color: colorPalette.text.primary,
                    fontWeight: 700,
                    fontSize: { xs: "0.8rem", md: "0.9rem" },
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    mb: { xs: 2, md: 3 },
                    textAlign: { xs: "center", sm: "left" },
                  }}
                >
                  Resources
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: { xs: 1.5, md: 2 },
                    alignItems: { xs: "center", sm: "flex-start" },
                  }}
                >
                  {[
                    "Documentation",
                    "Audits",
                    "Terms of Use",
                    "Privacy Policy",
                    "Legal Notice",
                    "Disclaimers",
                  ].map((link) => (
                    <Typography
                      key={link}
                      variant="body2"
                      sx={{
                        color: colorPalette.text.secondary,
                        fontSize: { xs: "0.8rem", md: "0.9rem" },
                        cursor: "pointer",
                        "&:hover": {
                          color: colorPalette.text.primary,
                        },
                        transition: "color 0.3s ease",
                        textAlign: { xs: "center", sm: "left" },
                      }}
                    >
                      {link}
                    </Typography>
                  ))}
                </Box>
              </Grid>

              {/* Data & Analytics Column */}
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="h6"
                  sx={{
                    color: colorPalette.text.primary,
                    fontWeight: 700,
                    fontSize: { xs: "0.8rem", md: "0.9rem" },
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    mb: { xs: 2, md: 3 },
                    textAlign: { xs: "center", sm: "left" },
                  }}
                >
                  Data & Analytics
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: { xs: 1.5, md: 2 },
                    alignItems: { xs: "center", sm: "flex-start" },
                  }}
                >
                  {["Dune", "Token Terminal", "DeFi Llama"].map((link) => (
                    <Typography
                      key={link}
                      variant="body2"
                      sx={{
                        color: colorPalette.text.secondary,
                        fontSize: { xs: "0.8rem", md: "0.9rem" },
                        cursor: "pointer",
                        "&:hover": {
                          color: colorPalette.text.primary,
                        },
                        transition: "color 0.3s ease",
                        textAlign: { xs: "center", sm: "left" },
                      }}
                    >
                      {link}
                    </Typography>
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Bottom Copyright */}
        <Box
          sx={{
            display: "flex",
            justifyContent: { xs: "center", md: "flex-end" },
            mt: { xs: 4, md: 6 },
            pt: { xs: 3, md: 4 },
            borderTop: `1px solid ${colors.glass.dark.border}`,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: colorPalette.text.tertiary,
              fontSize: { xs: "0.7rem", md: "0.8rem" },
              textAlign: "center",
            }}
          >
            © Cantara Finance, 2025
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
