"use client";

import {
  Box,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  useTheme as useMuiTheme,
} from "@mui/material";
import React, { useState } from "react";
import Link from "next/link";
import { useTheme } from "../../context/ThemeContext";
import { colors } from "../../theme/colors";
import { Brightness4, Brightness7, Menu } from "@mui/icons-material";
import { keyframes } from "@mui/system";
import EdgeLightButton from "../buttons/EdgeLightButton";
import CantaraWhiteLogo from "@/components/svgs/CantaraWhiteLogo";
const Header = () => {
  const { colors: colorPalette, isDark, toggleTheme } = useTheme();
  const muiTheme = useMuiTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"));
  const isTablet = useMediaQuery(muiTheme.breakpoints.between("md", "lg"));
  const isDesktop = useMediaQuery(muiTheme.breakpoints.up("lg"));

  const rotateLight = keyframes`
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

  const navigationItems = [
    { name: "How it works", target: "dashboardThird" },
    { name: "Difference", target: "dashboardFourth" },
    { name: "Core Values", target: "dashboardFive" },
    { name: "Why Cantara", target: "dashboardSix" },
    { name: "FAQs", target: "faqs" },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (target) => {
    const element = document.getElementById(target);
    if (element) {
      const headerHeight = isMobile ? 60 : 50;
      const elementPosition = element.offsetTop - headerHeight;
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });
    }
    setMobileOpen(false);
  };

  const handleLogoClick = () => {
    const el = document.getElementById("onboarding");
    if (el) {
      const headerHeight = isMobile ? 60 : 70;
      const top = el.offsetTop - headerHeight;
      window.scrollTo({ top, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        width: "100%",
        py: { xs: 2, md: 3 },
        px: { xs: 2, sm: 4, md: 6 },
        display: "flex",
        alignItems: "center",
        justifyContent: { xs: "space-between", md: "center" },
        gap: { xs: 0, md: 10 },
        zIndex: 1200,
      }}
    >
      {/* Logo Section */}
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box
          onClick={handleLogoClick}
          sx={{
            cursor: "pointer",
            position: { xs: "static", md: "absolute" },
            top: { xs: 0, md: 5 },
            left: { xs: 0, md: 100 },
            "& svg": {
              width: { xs: 60, sm: 80, md: 100 },
              height: { xs: 60, sm: 80, md: 100 },
            },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CantaraWhiteLogo />
        </Box>
      </Box>

      {/* Desktop Navigation */}
      {isDesktop && (
        <>
          <Box sx={{ width: 40, height: 40 }} />
          <Box
            sx={{
              background: "rgba(255, 255, 255, 0.064)",
              backdropFilter: "blur(20px)",
              borderRadius: 4,
              px: 6,
              py: 1,
              display: "flex",
              gap: 8,
              alignItems: "center",
              boxShadow: `0 8px 32px ${colors.glass.dark.shadow}`,
            }}
          >
            {navigationItems.map((item) => (
              <Button
                key={item.name}
                onClick={() => handleNavigation(item.target)}
                sx={{
                  color: colorPalette.text.primary,
                  textTransform: "none",
                  fontWeight: 500,
                  fontSize: "0.9rem",
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  "&:hover": {
                    background: colors.glass.dark.background,
                    color: colorPalette.text.primary,
                  },
                }}
              >
                {item.name}
              </Button>
            ))}
          </Box>
        </>
      )}

      {/* Tablet Navigation */}
      {isTablet && (
        <>
          <Box sx={{ width: 20, height: 40 }} />
          <Box
            sx={{
              background: "rgba(255, 255, 255, 0.064)",
              backdropFilter: "blur(20px)",
              borderRadius: 4,
              px: 4,
              py: 1,
              display: "flex",
              gap: 4,
              alignItems: "center",
              boxShadow: `0 8px 32px ${colors.glass.dark.shadow}`,
            }}
          >
            {navigationItems.slice(0, 3).map((item) => (
              <Button
                key={item.name}
                onClick={() => handleNavigation(item.target)}
                sx={{
                  color: colorPalette.text.primary,
                  textTransform: "none",
                  fontWeight: 500,
                  fontSize: "0.8rem",
                  px: 1.5,
                  py: 1,
                  borderRadius: 2,
                  "&:hover": {
                    background: colors.glass.dark.background,
                    color: colorPalette.text.primary,
                  },
                }}
              >
                {item.name}
              </Button>
            ))}
          </Box>
        </>
      )}

      {/* Right Section */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              color: colorPalette.text.primary,
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(20px)",
              borderRadius: 2,
              "&:hover": {
                background: "rgba(255, 255, 255, 0.2)",
              },
            }}
          >
            <Menu />
          </IconButton>
        )}

        <Link href="/auth" style={{ textDecoration: "none" }}>
          <EdgeLightButton
            sx={{
              fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
              px: { xs: 2, sm: 3, md: 4 },
              py: { xs: 1, sm: 1.2, md: 1.5 },
            }}
          >
            Launch App
          </EdgeLightButton>
        </Link>
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 280,
            background: "rgba(0, 0, 0, 0.9)",
            backdropFilter: "blur(20px)",
            borderLeft: `1px solid ${colors.glass.dark.border}`,
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Box
              onClick={handleLogoClick}
              sx={{
                cursor: "pointer",
                "& svg": {
                  width: 50,
                  height: 50,
                },
              }}
            >
              <CantaraWhiteLogo />
            </Box>
          </Box>

          <List>
            {navigationItems.map((item) => (
              <ListItem key={item.name} disablePadding>
                <ListItemButton
                  onClick={() => handleNavigation(item.target)}
                  sx={{
                    color: colorPalette.text.primary,
                    borderRadius: 2,
                    mb: 1,
                    "&:hover": {
                      background: "rgba(255, 255, 255, 0.1)",
                    },
                  }}
                >
                  <ListItemText
                    primary={item.name}
                    primaryTypographyProps={{
                      fontSize: "1rem",
                      fontWeight: 500,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Header;
