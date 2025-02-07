import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaSignOutAlt } from 'react-icons/fa'; // Importe o ícone de logout
import './CSS/Header.css';
import Logo from '../img/logomarca.webp';
import Modal from './ModalLoginRegistro';
import { useAuth } from '../context/AuthContext'; // Importe o contexto de autenticação

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { currentUser, logout } = useAuth(); // Use o contexto de autenticação

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleLogout = () => {
    logout(); // Função de logout do contexto
  };

  return (
    <header className="header-container">
      <nav className="nav-links">
        <Link to="/">
        <img className="logomarcaHeader" src={Logo} alt="Logomarca" />
        </Link>
        {/* Mega Menu */}
        <div className="mega-menu">
          <Link to="/" className="nav-item">Tecnologia ▼</Link>
          <div className="mega-menu-content">
            <div className="mega-menu-column">
              <h3>Inovações</h3>
              <Link to="/" className="sub-item">Gadgets</Link>
              <Link to="/" className="sub-item">IA e Robótica</Link>
              <Link to="/" className="sub-item">Computação Quântica</Link>
            </div>
            <div className="mega-menu-column">
              <h3>Startups</h3>
              <Link to="/" className="sub-item">Empreendedorismo</Link>
              <Link to="/" className="sub-item">5G e Conectividade</Link>
            </div>
          </div>
        </div>

        <div className="mega-menu">
          <Link to="/" className="nav-item">Mercado ▼</Link>
          <div className="mega-menu-content">
            <div className="mega-menu-column">
              <h3>Empresarial</h3>
              <Link to="/" className="sub-item">Eventos</Link>
              <Link to="/" className="sub-item">Opinião</Link>
            </div>
          </div>
        </div>

        <div className="mega-menu">
          <Link to="/" className="nav-item">Entretenimento ▼</Link>
          <div className="mega-menu-content">
            <div className="mega-menu-column">
              <h3>Vídeos</h3>
              <Link to="/" className="sub-item">Reviews</Link>
              <Link to="/" className="sub-item">Jogos e E-Sports</Link>
            </div>
          </div>
        </div>

        <div className="mega-menu">
          <Link to="/" className="nav-item">Mais ▼</Link>
          <div className="mega-menu-content">
            <div className="mega-menu-column">
              <h3>Segurança</h3>
              <Link to="/" className="sub-item">Outros</Link>
            </div>
          </div>
        </div>

        {currentUser ? (
          <Link to="/dashboard" className="nav-item">Dashboard</Link>
        ) : null}
        {currentUser ? (
          <button className="nav-item icon-button" onClick={handleLogout}>
            <FaSignOutAlt size={20} />
          </button>
        ) : (
          <button className="nav-item icon-button" onClick={toggleModal}>
            <FaUser size={20} />
          </button>
        )}
      </nav>
      {isModalOpen && <Modal onClose={toggleModal} />}
    </header>
  );
};

export default Header;
