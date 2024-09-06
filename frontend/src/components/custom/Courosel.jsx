import React, { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    "Card 1",
    "Psychotherapy and counseling",
    "Card 3",
    "Card 4",
    "Card 5",
  ];

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % (slides.length - 2));
  };

  const previousSlide = () => {
    setCurrentSlide(
      (prevSlide) => (prevSlide - 1 + slides.length - 2) % (slides.length - 2)
    );
  };

  return (
    <Box
      sx={{ position: "relative", width: "100%", overflow: "hidden" }}
      padding={10}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          position: "relative",
        }}
      >
        <IconButton
          sx={{
            position: "absolute",
            left: 16,
            zIndex: 1,
            backgroundColor: "#2C6975",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#1e5c6c",
            },
          }}
          onClick={previousSlide}
        >
          <ChevronLeft />
        </IconButton>
        <Box
          sx={{
            display: "flex",
            transition: "transform 0.5s ease",
            transform: `translateX(-${currentSlide * (100 / 3)}%)`,
            width: `${(slides.length * 100) / 3}%`,
          }}
        >
          {slides.map((slide, index) => (
            <Box
              key={index}
              sx={{
                flexShrink: 0,
                width: "33.3333%",
                boxSizing: "border-box",
                p: 4,
                textAlign: "center",
                bgcolor:
                  index >= currentSlide && index < currentSlide + 3
                    ? index === currentSlide + 1
                      ? "#2C6975"
                      : "#e0f2f1"
                    : "transparent",
                color:
                  index >= currentSlide && index < currentSlide + 3
                    ? index === currentSlide + 1
                      ? "#fff"
                      : "#333"
                    : "transparent",
                borderRadius: 2,
                boxShadow:
                  index >= currentSlide && index < currentSlide + 3
                    ? index === currentSlide + 1
                      ? 3
                      : 1
                    : 0,
                transition: "background-color 0.3s ease",
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                {slide}
              </Typography>
            </Box>
          ))}
        </Box>
        <IconButton
          sx={{
            position: "absolute",
            right: 16,
            zIndex: 1,
            backgroundColor: "#2C6975",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#1e5c6c",
            },
          }}
          onClick={nextSlide}
        >
          <ChevronRight />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Carousel;
