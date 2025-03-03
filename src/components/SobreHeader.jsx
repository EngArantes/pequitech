import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './CSS/SobreHeader.css';

const SobreHeader = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const links = [
    { to: "/termos-de-uso-e-privacidade", text: "Termos de Uso e Privacidade" },
    { to: "/sobre-nos", text: "Sobre Nós" },
    { to: "/contato", text: "Contato" },
  ];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? links.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === links.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="sobre-header-container">
      <div className="carousel-wrapper">
        <button className="carousel-btn prev" onClick={handlePrev}>
          <span className="arrow-icon">←</span>
        </button>
        <div className="carousel-content">
          <Link to={links[currentIndex].to} className="link-items">
            <p className="text_link">{links[currentIndex].text}</p>
          </Link>
        </div>
        <button className="carousel-btn next" onClick={handleNext}>
          <span className="arrow-icon">→</span>
        </button>
      </div>

      {/* Links exibidos lado a lado em desktop e tablets no modo paisagem */}
      <div className="desktop-links">
        {links.map((link, index) => (
          <Link key={index} to={link.to} className="link-items">
            <span className="text_link">{link.text}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SobreHeader;