"use client";

import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useTheme } from "../../context/ThemeContext";
import { colors } from "../../theme/colors";

const HubCard = ({
  title,
  permission,
  apy,
  maxLtv,
  availableLiquidity,
  collateral,
  borrow,
  healthFactor,
  healthColor = "green",
}) => {
  const { colors: colorPalette } = useTheme();

  const getHealthColor = (factor) => {
    if (factor >= 1.8) return colorPalette.success; // Green
    if (factor >= 1.4) return colorPalette.waiting; // Yellow
    if (factor >= 1) return colorPalette.warning; // Yellow
    return colorPalette.danger; // Red
  };

  const getHealthWidth = (factor) => {
    // Health factor değerini yüzde olarak döndür (max 100%)
    const percentage = Math.min(factor * 50, 100); // 2.0 = 100%, 1.0 = 50%
    return `${percentage}%`;
  };

  return (
    <Box
      sx={{
        width: "350px",
        height: "100%",
        background: colors.glass.dark.background,
        backdropFilter: "blur(20px)",
        border: `1px solid ${colors.glass.dark.border}`,
        borderRadius: "30px",
        p: 3,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        boxShadow: `0 8px 32px ${colors.glass.dark.shadow}`,
        position: "relative",
        minHeight: 400,
        // "&::before": {
        //   content: '""',
        //   position: "absolute",
        //   top: 0,
        //   left: 0,
        //   right: 0,
        //   bottom: 0,
        //   borderRadius: 4,
        //   background: `linear-gradient(135deg, ${colorPalette.primary[500]}10 0%, ${colorPalette.primary[300]}05 100%)`,
        //   zIndex: -1,
        // },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: colorPalette.text.primary,
            fontWeight: 700,
            fontSize: "1.5rem",
            width: "50%",
          }}
        >
          {title}
        </Typography>
        <Box
          sx={{
            background: colorPalette.secondary[500],
            color: colorPalette.text.inverse,
            px: 2,
            py: 0.5,
            borderRadius: 3,
            fontSize: "0.75rem",
            fontWeight: 500,
          }}
        >
          {permission}
        </Box>
      </Box>

      {/* Metrics */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          py: 2,
        }}
      >
        <Box sx={{ textAlign: "center", flex: 1 }}>
          <Typography
            variant="body2"
            sx={{
              color: colorPalette.text.secondary,
              fontSize: "0.8rem",
            }}
          >
            APY
          </Typography>
          <Typography
            variant="h4"
            sx={{
              color: colorPalette.text.primary,
              fontWeight: 700,
              fontSize: "2rem",
              mb: 0.5,
            }}
          >
            {apy}
          </Typography>
        </Box>

        <Box sx={{ textAlign: "center", flex: 1 }}>
          <Typography
            variant="body2"
            sx={{
              color: colorPalette.text.secondary,
              fontSize: "0.8rem",
            }}
          >
            Max LTV
          </Typography>
          <Typography
            variant="h4"
            sx={{
              color: colorPalette.text.primary,
              fontWeight: 700,
              fontSize: "2rem",
              mb: 0.5,
            }}
          >
            {maxLtv}
          </Typography>
        </Box>

        <Box sx={{ textAlign: "center", flex: 1 }}>
          <Typography
            variant="body2"
            sx={{
              width: "120px",
              color: colorPalette.text.secondary,
              fontSize: "0.8rem",
            }}
          >
            Available Liquidity
          </Typography>
          <Typography
            variant="h4"
            sx={{
              color: colorPalette.text.primary,
              fontWeight: 700,
              fontSize: "2rem",
              mb: 0.5,
            }}
          >
            {availableLiquidity}
          </Typography>
        </Box>
      </Box>

      {/* Details */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, py: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            variant="body2"
            sx={{ color: colorPalette.text.secondary }}
          >
            Collateral:
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: colorPalette.text.primary, fontWeight: 500 }}
          >
            {collateral}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            variant="body2"
            sx={{ color: colorPalette.text.secondary }}
          >
            Borrow:
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: colorPalette.text.primary, fontWeight: 500 }}
          >
            {borrow}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "column",
            width: "100%",
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 1,
              width: "100%",
            }}
          >
            <Typography
              variant="body2"
              sx={{ color: colorPalette.text.secondary }}
            >
              Health Factor:
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: colorPalette.text.primary, fontWeight: 700 }}
            >
              {healthFactor}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              width: "100%",
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: 6,
                background: colors.glass.dark.background,
                borderRadius: 3,
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  width: getHealthWidth(healthFactor),
                  height: "100%",
                  background: getHealthColor(healthFactor),
                  borderRadius: 3,
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Action Buttons */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 1.5,
          mt: "auto",
        }}
      >
        <Button
          variant="outlined"
          sx={{
            borderColor: colors.glass.dark.border,
            color: colorPalette.text.primary,
            borderRadius: 2,
            py: 1,
            textTransform: "none",
            fontWeight: 500,
            "&:hover": {
              borderColor: colorPalette.primary[900],
              background: colorPalette.primary[900] + "10",
            },
          }}
        >
          Supply
        </Button>

        <Button
          variant="outlined"
          sx={{
            borderColor: colors.glass.dark.border,
            color: colorPalette.text.primary,
            borderRadius: 2,
            py: 1,
            textTransform: "none",
            fontWeight: 500,
            "&:hover": {
              borderColor: colorPalette.primary[900],
              background: colorPalette.primary[900] + "10",
            },
          }}
        >
          Withdraw
        </Button>

        <Button
          variant="outlined"
          sx={{
            borderColor: colors.glass.dark.border,
            color: colorPalette.text.primary,
            borderRadius: 2,
            py: 1,
            textTransform: "none",
            fontWeight: 500,
            "&:hover": {
              borderColor: colorPalette.primary[900],
              background: colorPalette.primary[900] + "10",
            },
          }}
        >
          Borrow
        </Button>

        <Button
          variant="outlined"
          sx={{
            borderColor: colors.glass.dark.border,
            color: colorPalette.danger,
            borderRadius: 2,
            py: 1,
            textTransform: "none",
            fontWeight: 500,
            "&:hover": {
              borderColor: colorPalette.danger,
              background: colorPalette.danger + "10",
            },
          }}
        >
          Repay
        </Button>
      </Box>
    </Box>
  );
};

export default HubCard;
