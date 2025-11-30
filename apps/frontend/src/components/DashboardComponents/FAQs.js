"use client";

import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  IconButton,
  Collapse,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { useTheme } from "../../context/ThemeContext";
import { colors } from "../../theme/colors";
import { faqDatas } from "@/utils/data";

const FAQs = () => {
  const { colors: colorPalette } = useTheme();
  const [expandedIndex, setExpandedIndex] = useState(0);

  const handleToggle = (index) => {
    setExpandedIndex(expandedIndex === index ? -1 : index);
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
              Everything you need to know about{" "}
              <Typography
                variant="span"
                sx={{ color: colorPalette.primary[50] }}
              >
                Cantara&apos;s hybrid credit markets
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
              From how it works to why it&apos;s different.
            </Typography>
          </Box>

          {/* FAQ Accordion */}
          <Box sx={{ maxWidth: "800px", mx: "auto" }}>
            {faqDatas.map((faq, index) => (
              <Box
                key={index}
                sx={{
                  background: "rgba(68, 72, 84, 0.163)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: "64px",
                  boxShadow:
                    "inset 0 0 10px rgba(255, 255, 255, 0.08), 0 8px 2px rgba(0, 0, 0, 0.45)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  position: "relative",
                  overflow: "hidden",
                  mb: 2,
                  "&:hover": {
                    background: "rgba(228, 239, 254, 0.1)",
                    boxShadow:
                      "inset 0 0 10px rgba(255, 255, 255, 0.08), 0 8px 32px rgba(0, 0, 0, 0.45)",
                  },
                }}
              >
                {/* Question */}
                <Box
                  onClick={() => handleToggle(index)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 3,
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      color: colorPalette.text.primary,
                      fontWeight: 600,
                      fontSize: "1.1rem",
                      flex: 1,
                      pr: 2,
                      pl: 2,
                    }}
                  >
                    {faq.question}
                  </Typography>

                  <IconButton
                    sx={{
                      color: colorPalette.text.primary,
                      background: "rgba(255, 255, 255, 0.1)",
                      width: 40,
                      height: 40,
                      "&:hover": {
                        background: "rgba(255, 255, 255, 0.2)",
                      },
                    }}
                  >
                    {expandedIndex === index ? <Remove /> : <Add />}
                  </IconButton>
                </Box>

                {/* Answer */}
                <Collapse in={expandedIndex === index}>
                  <Box sx={{ px: 4, pb: 5 }}>
                    <Typography
                      variant="body1"
                      sx={{
                        color: colorPalette.text.secondary,
                        lineHeight: 1.6,
                        fontSize: "1rem",
                      }}
                    >
                      {faq.answer}
                    </Typography>
                  </Box>
                </Collapse>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default FAQs;
