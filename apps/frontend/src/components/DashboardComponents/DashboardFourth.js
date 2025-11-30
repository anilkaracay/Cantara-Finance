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
import Image from "next/image";
import Card from "../cards/Card";
import { useTheme } from "../../context/ThemeContext";
import { colors } from "../../theme/colors";
import SignalCellularAltIcon from "@mui/icons-material/SignalCellularAlt";
import { differencePartDatas } from "@/utils/data";

const DashboardFourth = () => {
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

          padding: "4rem 0",
        }}
      >
        <Container maxWidth="lg">
          {/* Hero Section */}
          <Box
            sx={{
              textAlign: "center",
              marginBottom: "4rem",
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
                marginBottom: "1.5rem",
                fontSize: { xs: "2.5rem", md: "3.5rem" },
              }}
            >
              Difference
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
              Cantara bridges the gap between TradFi needs and DeFi efficiency.
            </Typography>
          </Box>

          {/* Responsive Comparison Table */}
          {isMobile ? (
            // Mobile Card Layout
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {differencePartDatas.slice(1).map((row, index) => (
                <Box
                  key={row.id}
                  sx={{
                    background: "rgba(68, 72, 84, 0.163)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: "16px",
                    boxShadow:
                      "inset 0 0 10px rgba(255, 255, 255, 0.08), 0 8px 2px rgba(0, 0, 0, 0.45)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    p: 3,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Feature Title */}
                  <Typography
                    variant="h6"
                    sx={{
                      color: colorPalette.text.primary,
                      fontWeight: 700,
                      fontSize: "1.1rem",
                      mb: 3,
                      textAlign: "center",
                    }}
                  >
                    {row.title}
                  </Typography>

                  {/* Comparison Cards */}
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 3 }}
                  >
                    {/* CANTARA Card */}
                    <Box
                      sx={{
                        background: "rgba(255, 255, 255, 0.05)",
                        borderRadius: "12px",
                        p: 2.5,
                        border: `1px solid ${colorPalette.primary[50]}20`,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          mb: 2,
                        }}
                      >
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            background: colorPalette.primary[50],
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <Typography
                            sx={{
                              color: "white",
                              fontSize: "14px",
                              fontWeight: "bold",
                            }}
                          >
                            ✓
                          </Typography>
                        </Box>
                        <Typography
                          variant="h6"
                          sx={{
                            color: colorPalette.text.primary,
                            fontWeight: 700,
                            fontSize: "1rem",
                          }}
                        >
                          CANTARA
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: colorPalette.text.primary,
                          fontSize: "0.9rem",
                          lineHeight: 1.5,
                        }}
                      >
                        {row.mainDescription}
                      </Typography>
                    </Box>

                    {/* Money Markets Card */}
                    <Box
                      sx={{
                        background: "rgba(255, 255, 255, 0.03)",
                        borderRadius: "12px",
                        p: 2.5,
                        border: `1px solid ${colorPalette.text.secondary}20`,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          mb: 2,
                        }}
                      >
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            background: colorPalette.secondary[400],
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <Typography
                            sx={{
                              color: "white",
                              fontSize: "14px",
                              fontWeight: "bold",
                            }}
                          >
                            ✗
                          </Typography>
                        </Box>
                        <Typography
                          variant="h6"
                          sx={{
                            color: colorPalette.text.secondary,
                            fontWeight: 700,
                            fontSize: "1rem",
                          }}
                        >
                          Money Markets
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: colorPalette.text.secondary,
                          fontSize: "0.9rem",
                          lineHeight: 1.5,
                        }}
                      >
                        {row.otherDescription}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          ) : (
            // Desktop/Tablet Table Layout
            <Box
              sx={{
                background: "rgba(68, 72, 84, 0.163)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: "16px",
                boxShadow:
                  "inset 0 0 10px rgba(255, 255, 255, 0.08), 0 8px 2px rgba(0, 0, 0, 0.45)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Header Row */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: isTablet ? "1fr 1fr 1fr" : "1fr 1fr 1fr",
                  borderBottom: `1px solid ${colors.glass.dark.border}`,
                }}
              >
                <Box
                  sx={{
                    p: { xs: 2, md: 3 },
                    textAlign: "left",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      color: colorPalette.text.primary,
                      fontWeight: 700,
                      fontSize: { xs: "1rem", md: "1.1rem" },
                    }}
                  >
                    Feature
                  </Typography>
                </Box>

                <Box sx={{ p: { xs: 2, md: 3 }, textAlign: "center" }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: { xs: 40, md: 50 },
                        height: { xs: 40, md: 50 },
                        background: colorPalette.secondary[400],
                        borderRadius: 3,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                     <Image src="/images/IconForCantara.png" alt="IconForCantara" width={30} height={30} />
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        color: colorPalette.text.primary,
                        fontWeight: 700,
                        fontSize: { xs: "1rem", md: "1.1rem" },
                      }}
                    >
                      CANTARA
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: colorPalette.primary[50],
                      fontSize: { xs: "0.7rem", md: "0.8rem" },
                    }}
                  >
                   Institutional Hybrid Credit Protocol
                  </Typography>
                </Box>

                <Box sx={{ p: { xs: 2, md: 3 }, textAlign: "center" }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: { xs: 40, md: 50 },
                        height: { xs: 40, md: 50 },
                        background: colorPalette.secondary[400],
                        borderRadius: 3,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "white",
                          fontSize: { xs: "10px", md: "12px" },
                        }}
                      >
                        <SignalCellularAltIcon
                          sx={{ fontSize: { xs: "16px", md: "20px" } }}
                        />
                      </Typography>
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        color: colorPalette.text.primary,
                        fontWeight: 700,
                        fontSize: { xs: "1rem", md: "1.1rem" },
                      }}
                    >
                      Money Markets
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: colorPalette.text.secondary,
                      fontSize: { xs: "0.7rem", md: "0.8rem" },
                    }}
                  >
                    Retail-Focused DeFi Platforms
                  </Typography>
                </Box>
              </Box>

              {/* Feature Rows */}
              {differencePartDatas.slice(1).map((row, index) => (
                <Box
                  key={row.id}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: isTablet
                      ? "1fr 1fr 1fr"
                      : "1fr 1fr 1fr",
                    borderBottom:
                      index < differencePartDatas.length - 2
                        ? `1px solid ${colors.glass.dark.border}`
                        : "none",
                    "&:hover": {
                      background: "rgba(255, 255, 255, 0.02)",
                    },
                  }}
                >
                  {/* Feature Name */}
                  <Box
                    sx={{
                      p: { xs: 2, md: 3 },
                      textAlign: "left",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        color: colorPalette.text.primary,
                        fontWeight: 500,
                        fontSize: { xs: "0.9rem", md: "1rem" },
                      }}
                    >
                      {row.title}
                    </Typography>
                  </Box>

                  {/* CANTARA Column */}
                  <Box sx={{ p: { xs: 2, md: 3 }, textAlign: "left" }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        flexDirection: "column",
                      }}
                    >
                      <Box
                        sx={{
                          width: { xs: 25, md: 30 },
                          height: { xs: 25, md: 30 },
                          background: colorPalette.primary[50],
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          mt: 0.5,
                        }}
                      >
                        <Typography
                          sx={{
                            color: "white",
                            fontSize: { xs: "10px", md: "12px" },
                            fontWeight: "bold",
                          }}
                        >
                          ✓
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: colorPalette.text.primary,
                          fontSize: { xs: "0.8rem", md: "0.9rem" },
                          lineHeight: 1.4,
                        }}
                      >
                        {row.mainDescription}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Money Markets Column */}
                  <Box sx={{ p: { xs: 2, md: 3 }, textAlign: "left" }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        flexDirection: "column",
                      }}
                    >
                      <Box
                        sx={{
                          width: { xs: 25, md: 30 },
                          height: { xs: 25, md: 30 },
                          background: colorPalette.secondary[400],
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          mt: 0.5,
                        }}
                      >
                        <Typography
                          sx={{
                            color: "white",
                            fontSize: { xs: "10px", md: "12px" },
                            fontWeight: "bold",
                          }}
                        >
                          ✗
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: colorPalette.text.secondary,
                          fontSize: { xs: "0.8rem", md: "0.9rem" },
                          lineHeight: 1.4,
                        }}
                      >
                        {row.otherDescription}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default DashboardFourth;
