"use client";

import React from "react";
import { Box } from "@mui/material";
import { keyframes } from "@mui/system";

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const RotatingLogos = () => {
  const logos = [
    { name: "Bitcoin", symbol: "₿", color: "#F7931A" },
    { name: "Ethereum", symbol: "Ξ", color: "#627EEA" },
    { name: "USDC", symbol: "$", color: "#2775CA" },
    { name: "USDT", symbol: "₮", color: "#26A17B" },
    { name: "Chainlink", symbol: "◈", color: "#2A5ADA" },
    { name: "Polygon", symbol: "⬟", color: "#8247E5" },
    { name: "Avalanche", symbol: "▲", color: "#E84142" },
    { name: "Solana", symbol: "◎", color: "#9945FF" },
  ];

  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      {/* Ana dönen halka */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "800px",
          height: "800px",
          transform: "translate(-50%, -50%)",
          animation: `${rotate} 60s linear infinite`,
        }}
      >
        {logos.map((logo, index) => {
          const angle = (index * 360) / logos.length;
          const radius = 350;
          const x = Math.cos((angle * Math.PI) / 180) * radius;
          const y = Math.sin((angle * Math.PI) / 180) * radius;

          return (
            <Box
              key={index}
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "60px",
                height: "60px",
                transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                borderRadius: "50%",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
                animation: `${rotate} 60s linear infinite reverse`,
              }}
            >
              <Box
                sx={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: logo.color,
                  textShadow: "0 0 10px rgba(255, 255, 255, 0.5)",
                }}
              >
                {logo.symbol}
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* İç halka - daha hızlı dönen */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "400px",
          height: "400px",
          transform: "translate(-50%, -50%)",
          animation: `${rotate} 30s linear infinite reverse`,
        }}
      >
        {logos.slice(0, 4).map((logo, index) => {
          const angle = (index * 360) / 4;
          const radius = 150;
          const x = Math.cos((angle * Math.PI) / 180) * radius;
          const y = Math.sin((angle * Math.PI) / 180) * radius;

          return (
            <Box
              key={`inner-${index}`}
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "40px",
                height: "40px",
                transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(5px)",
                borderRadius: "50%",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                animation: `${rotate} 30s linear infinite`,
              }}
            >
              <Box
                sx={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  color: logo.color,
                  opacity: 0.7,
                }}
              >
                {logo.symbol}
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* Dış halka - daha yavaş dönen */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "1000px",
          height: "1000px",
          transform: "translate(-50%, -50%)",
          animation: `${rotate} 120s linear infinite`,
        }}
      >
        {logos.slice(4).map((logo, index) => {
          const angle = (index * 360) / 4;
          const radius = 450;
          const x = Math.cos((angle * Math.PI) / 180) * radius;
          const y = Math.sin((angle * Math.PI) / 180) * radius;

          return (
            <Box
              key={`outer-${index}`}
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "50px",
                height: "50px",
                transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(8px)",
                borderRadius: "50%",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                boxShadow: "0 2px 15px rgba(0, 0, 0, 0.2)",
                animation: `${rotate} 120s linear infinite reverse`,
              }}
            >
              <Box
                sx={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: logo.color,
                  opacity: 0.8,
                }}
              >
                {logo.symbol}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default RotatingLogos;
