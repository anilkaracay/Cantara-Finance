"use client";

import { Box } from "@mui/material";
import React from "react";
import { useTheme } from "../context/ThemeContext";
import Header from "../components/DashboardComponents/Header";
import DashboardSecond from "@/components/DashboardComponents/DashboardSecond";
import DashboardThird from "@/components/DashboardComponents/DashboardThird";
import DashboardFourth from "@/components/DashboardComponents/DashboardFourth";
import DashboardFive from "@/components/DashboardComponents/DashboardFive";
import DashboardSix from "@/components/DashboardComponents/DashboardSix";
import FAQs from "@/components/DashboardComponents/FAQs";
import Footer from "@/components/DashboardComponents/Footer";
import Onboarding from "@/components/DashboardComponents/Onboarding";

const Home = () => {
  const { colors: colorPalette } = useTheme();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: colorPalette.background.primary,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Abstract Background Effects */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 20%, rgba(0, 0, 0, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(0, 0, 0, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 60%, rgba(50, 68, 78, 0.2) 0%, transparent 50%)
          `,
          zIndex: 0,
        }}
      />

      {/* Header */}
      <Header />

      <div id="onboarding">
        <Onboarding />
      </div>
      <DashboardSecond />
      <div id="dashboardThird">
        <DashboardThird />
      </div>
      <div id="dashboardFourth">
        <DashboardFourth />
      </div>
      <div id="dashboardFive">
        <DashboardFive />
      </div>
      <div id="dashboardSix">
        <DashboardSix />
      </div>
      <div id="faqs">
        <FAQs />
      </div>
      <Footer />
    </Box>
  );
};

export default Home;
