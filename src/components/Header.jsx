import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import './CSS/Header.css';
import Logo from '../img/logomarca.webp';
import Modal from './ModalLoginRegistro';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado do menu móvel
  const { currentUser, logout } = useAuth();

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleLogout = () => {
    logout();
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Fechar o Mega Menu ao clicar fora dele
  const closeMegaMenu = (e) => {
    if (!e.target.closest('.mega-menu')) {
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="header-container" onClick={closeMegaMenu}>
      <nav className="nav-links">
        {/* Logomarca redireciona para Home */}
        <Link to="/" className="logo-container">
          <img className="logomarcaHeader" src={Logo} alt="Logomarca" />
        </Link>

        {/* Botão do menu responsivo */}
        <button className="menu-toggle" onClick={toggleMenu} aria-label="Abrir menu">
          {isMenuOpen ? <FaTimes size={25} /> : <FaBars size={25} />}
        </button>

        {/* Menu principal */}
        <div className={`menu-items ${isMenuOpen ? 'open' : ''}`}>
          <Link to="/" className="nav-item" onClick={toggleMenu}>HOME</Link>

          {/* Mega Menu TECNOLOGIAS */}
          <div className="mega-menu">
            <span className="nav-item">TECNOLOGIAS ▼</span>
            <div className="mega-menu-content">
              <div className="mega-menu-column">
                <Link to="/categoria/INTELIGÊNCIA%20ARTIFICIAL" className="sub-item" onClick={toggleMenu}>INTELIGÊNCIA ARTIFICIAL</Link>
                <Link to="/categoria/VEÍCULOS%20E%20TECNOLOGIAS" className="sub-item" onClick={toggleMenu}>VEÍCULOS E TECNOLOGIAS</Link>
                <Link to="/categoria/JOGOS" className="sub-item" onClick={toggleMenu}>JOGOS</Link>
                <Link to="/categoria/CIÊNCIA%20E%20ESPAÇO" className="sub-item" onClick={toggleMenu}>CIÊNCIA E ESPAÇO</Link>
              </div>
            </div>
          </div>

          {/* Mega Menu ENTRETERIMENTO */}
          <div className="mega-menu">
            <span className="nav-item">ENTRETENIMENTO ▼</span>
            <div className="mega-menu-content">
              <div className="mega-menu-column">
                <Link to="/categoria/CINEMA" className="sub-item" onClick={toggleMenu}>CINEMA</Link>
                <Link to="/categoria/INTERNET" className="sub-item" onClick={toggleMenu}>INTERNET</Link>
                <Link to="/categoria/REDES-SOCIAIS" className="sub-item" onClick={toggleMenu}>REDES SOCIAIS</Link>
              </div>
            </div>
          </div>

          {/* Mega Menu MAIS */}
          <div className="mega-menu">
            <span className="nav-item">MAIS ▼</span>
            <div className="mega-menu-content">
              <div className="mega-menu-column">
                <Link to="/categoria/PRODUTOS-E-20REVIEWS" className="sub-item" onClick={toggleMenu}>PRODUTOS E REVIEWS</Link>
                <Link to="/categoria/SAÚDE" className="sub-item" onClick={toggleMenu}>SAÚDE</Link>
                <Link to="/categoria/EDUCAÇÃO-E-CURSOS" className="sub-item" onClick={toggleMenu}>EDUCAÇÃO E CURSOS</Link>
                <Link to="/categoria/SUSTENTABILIDADE" className="sub-item" onClick={toggleMenu}>SUSTENTABILIDADE</Link>
                <Link to="/categoria/CARREIRA-E-EMPREGOS" className="sub-item" onClick={toggleMenu}>CARREIRA E EMPREGOS</Link>
                <Link to="/categoria/ESTILO-DE-VIDA" className="sub-item" onClick={toggleMenu}>ESTILO DE VIDA</Link>
                <Link to="/categoria/SEGURANÇA-DIGITAL" className="sub-item" onClick={toggleMenu}>SEGURANÇA DIGITAL</Link>
                <Link to="/categoria/NEGÓCIOS-E-FINANÇAS" className="sub-item" onClick={toggleMenu}>NEGÓCIOS E FINANÇAS</Link>
              </div>
            </div>
          </div>

          {currentUser ? (
            <>
              <Link to="/dashboard" className="nav-item" onClick={toggleMenu}>DASHBOARD</Link>
              <button className="nav-item icon-button" onClick={handleLogout} aria-label="Sair">
                <FaSignOutAlt size={20} />
              </button>
            </>
          ) : (
            <button className="nav-item icon-button" onClick={toggleModal} aria-label="Login">
              <FaUser size={20} />
            </button>
          )}
        </div>
      </nav>
      {isModalOpen && <Modal onClose={toggleModal} />}
    </header>
  );
};

export default Header;