import React from "react";
import "../components/CSS/Footer.css";
import { Link } from "react-router-dom";
import { FaInstagram, FaYoutube } from "react-icons/fa"; // Corrigido FaYoutubeSquare para FaYoutube

const Footer = () => {
  return (
    <div className="footer-container">
      <footer className="footer-footer">
        <div className="footer-section links-termos-sobre">
          <Link to="/termos-de-uso-e-privacidade" className="nav-items">
            Termos de Uso e Privacidade
          </Link>
          <Link to="/sobre-nos" className="nav-items">
            Sobre Nós
          </Link>
        </div>
        <div className="footer-section copyright">
          <p>
            © 2025 PequiTech. Todos os direitos reservados - Site feito por{" "}
            <strong>PublishUp!</strong>.
          </p>
        </div>
        <div className="footer-section social">
          <p>Siga-nos nas redes sociais:</p>
          <div className="social-linkss">
            <a
              href="https://www.instagram.com/pequi_tech/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-linkk"
            >
              <FaInstagram size={30} color="#fff" />
            </a>
            <a
              href="https://www.youtube.com/@PequiTech"
              target="_blank"
              rel="noopener noreferrer"
              className="social-linkk"
            >
              <FaYoutube size={30} color="#fff" /> {/* Corrigido para FaYoutube */}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;