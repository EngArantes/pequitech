import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import './CSS/Header.css';
import Logo from '../img/logomarca.webp';
import Modal from './ModalLoginRegistro';
import { useAuth } from '../context/AuthContext';
import { useNews } from '../context/NewsContext';

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const { news, filterNewsByCategory } = useNews();

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleLogout = () => {
    logout();
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleCategoryClick = (categoria) => {
    toggleMenu();
    if (news.length === 0 || news[0].category !== categoria) {
      filterNewsByCategory(categoria.toLowerCase());
    }
  };
  

  const closeMegaMenu = (e) => {
    if (!e.target.closest('.mega-menu')) {
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="header-container" onClick={closeMegaMenu}>
      <nav className="nav-links">
        <Link to="/" className="logo-container">
          <img className="logomarcaHeader" src={Logo} alt="Logomarca" />
        </Link>

        <button className="menu-toggle" onClick={toggleMenu} aria-label="Abrir menu">
          {isMenuOpen ? <FaTimes size={25} /> : <FaBars size={25} />}
        </button>

        <div className={`menu-items ${isMenuOpen ? 'open' : ''}`}>
          <Link to="/" className="nav-item" onClick={toggleMenu}>HOME</Link>

          <div className="mega-menu">
            <span className="nav-item">TECNOLOGIAS ▼</span>
            <div className="mega-menu-content">
              <div className="mega-menu-column">
                <Link 
                  to="/categoria/inteligencia-artificial" 
                  className="sub-item" 
                  onClick={() => handleCategoryClick('inteligencia-artificial')}
                >
                  INTELIGÊNCIA ARTIFICIAL
                </Link>
                <Link 
                  to="/categoria/veiculos-e-tecnologias" 
                  className="sub-item" 
                  onClick={() => handleCategoryClick('veiculos-e-tecnologias')}
                >
                  VEÍCULOS E TECNOLOGIAS
                </Link>
                <Link 
                  to="/categoria/jogos" 
                  className="sub-item" 
                  onClick={() => handleCategoryClick('jogos')}
                >
                  JOGOS
                </Link>
                <Link 
                  to="/categoria/ciencia-e-espaco" 
                  className="sub-item" 
                  onClick={() => handleCategoryClick('ciencia-e-espaco')}
                >
                  CIÊNCIA E ESPAÇO
                </Link>
              </div>
            </div>
          </div>

          <div className="mega-menu">
            <span className="nav-item">ENTRETENIMENTO ▼</span>
            <div className="mega-menu-content">
              <div className="mega-menu-column">
                <Link 
                  to="/categoria/cinema" 
                  className="sub-item" 
                  onClick={() => handleCategoryClick('cinema')}
                >
                  CINEMA
                </Link>
                <Link 
                  to="/categoria/internet" 
                  className="sub-item" 
                  onClick={() => handleCategoryClick('internet')}
                >
                  INTERNET
                </Link>
                <Link 
                  to="/categoria/redes-sociais" 
                  className="sub-item" 
                  onClick={() => handleCategoryClick('redes-sociais')}
                >
                  REDES SOCIAIS
                </Link>
              </div>
            </div>
          </div>

          <div className="mega-menu">
            <span className="nav-item">MAIS ▼</span>
            <div className="mega-menu-content">
              <div className="mega-menu-column">
                <Link 
                  to="/categoria/produtos-e-reviews" 
                  className="sub-item" 
                  onClick={() => handleCategoryClick('produtos-e-reviews')}
                >
                  PRODUTOS E REVIEWS
                </Link>
                <Link 
                  to="/categoria/saude" 
                  className="sub-item" 
                  onClick={() => handleCategoryClick('saude')}
                >
                  SAÚDE
                </Link>
                <Link 
                  to="/categoria/educacao-e-cursos" 
                  className="sub-item" 
                  onClick={() => handleCategoryClick('educacao-e-cursos')}
                >
                  EDUCAÇÃO E CURSOS
                </Link>
                <Link 
                  to="/categoria/sustentabilidade" 
                  className="sub-item" 
                  onClick={() => handleCategoryClick('sustentabilidade')}
                >
                  SUSTENTABILIDADE
                </Link>
                <Link 
                  to="/categoria/carreira-e-empregos" 
                  className="sub-item" 
                  onClick={() => handleCategoryClick('carreira-e-empregos')}
                >
                  CARREIRA E EMPREGOS
                </Link>
                <Link 
                  to="/categoria/estilo-de-vida" 
                  className="sub-item" 
                  onClick={() => handleCategoryClick('estilo-de-vida')}
                >
                  ESTILO DE VIDA
                </Link>
                <Link 
                  to="/categoria/seguranca-digital" 
                  className="sub-item" 
                  onClick={() => handleCategoryClick('seguranca-digital')}
                >
                  SEGURANÇA DIGITAL
                </Link>
                <Link 
                  to="/categoria/negocios-e-financas" 
                  className="sub-item" 
                  onClick={() => handleCategoryClick('negocios-e-financas')}
                >
                  NEGÓCIOS E FINANÇAS
                </Link>
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