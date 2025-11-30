import React from "react";
import { Box, Typography, Button } from "@mui/material";
import Image from "next/image";

const Card = ({
  imageSrc,
  imageAlt = "",
  title,
  description,
  onLearnMore,
  stepText,
  cardWidth,
}) => {
  return (
    <Box
      sx={{
        flexDirection: "column",
        width: cardWidth ? cardWidth : 500,
        maxHeight: 430,
        color: "white",
        px: 2,
        py: 2,
        fontSize: "1.25rem",
        fontWeight: 500,
        borderRadius: "64px",
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
      {stepText ? (
        <>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "flex-start",
              fontSize: "1rem",
              position: "absolute",
              top: 0,
              left: 40,
            }}
          >
            {stepText}
          </Box>
        </>
      ) : null}

      {/* Image */}
      <Box
        sx={{
          width: "100%",
          height: 200,
          backgroundColor: "#58585848",
          borderRadius: "54px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "1rem",
          fontSize: "1.5rem",
        }}
      >
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={600}
            height={200}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "54px",
            }}
          />
        ) : null}
      </Box>

      {/* Title */}
      <Typography
        variant="h6"
        sx={{
          fontWeight: "bold",
          color: "white",
          marginBottom: "0.75rem",
          fontSize: "1.1rem",
        }}
      >
        {title}
      </Typography>

      {/* Description */}
      <Typography
        variant="body2"
        sx={{
          color: "#a0a0a0",
          lineHeight: "1.5",
          marginBottom: "1.5rem",
          flex: 1,
          fontSize: "0.9rem",
          px: 1,
          textAlign: "center",
        }}
      >
        {description}
      </Typography>
    </Box>
  );
};

export default Card;
