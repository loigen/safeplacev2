import React, { useState } from "react";
import "../../styles/courosel.css";

const Courosel = () => {
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
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
  };

  const previousSlide = () => {
    setCurrentSlide(
      (prevSlide) => (prevSlide - 1 + slides.length) % slides.length
    );
  };

  return (
    <div className="carousel">
      <div>
        <button className="carousel-button prev" onClick={previousSlide}>
          &#8592; Previous
        </button>
        <button className="carousel-button next" onClick={nextSlide}>
          Next &#8594;
        </button>
      </div>
      <div className="carousel-slides">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`carousel-slide ${
              index === currentSlide
                ? "active"
                : index ===
                    (currentSlide - 1 + slides.length) % slides.length ||
                  index === (currentSlide + 1) % slides.length
                ? "side"
                : "inactive"
            }`}
            onClick={() => goToSlide(index)}
          >
            <div className="carousel-content">{slide}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courosel;
