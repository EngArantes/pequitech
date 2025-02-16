import React from "react";
import "../components/CSS/Footer.css";
import { Link } from "react-router-dom";
import { FaInstagram, FaYoutube, FaYoutubeSquare } from "react-icons/fa"; // Importando o ícone do Instagram

const Footer = () => {
  return (
    <div className="footer-container">
      {/* Footer */}
      <footer className="footer-footer">
        <div>
          <Link to="/termos-de-uso-e-privacidade" className="nav-items">
            Termos de Uso e Privacidade
          </Link>
          <Link to="/sobre-nos" className="nav-items">
            Sobre Nós
          </Link>
        </div>
        <div className="copyright">
          <p>&copy; 2025 PequiTech. Todos os direitos reservados - Site feito por <strong>PublishUp!</strong>.</p>
        </div>
        <div>
          <p>Siga-nos nas redes Sociais:</p>
          <a href="https://www.instagram.com/PequiTech" target="_blank" rel="noopener noreferrer" className="social-link">
            <FaInstagram size={30} color="#fff" /> 
          </a>
          <a href="https://www.youtube.com/@PequiTech" target="_blank" rel="noopener noreferrer" className="social-link">
            <FaYoutubeSquare size={30} color="#fff" /> 
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
