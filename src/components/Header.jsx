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
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const toggleDropdown = (menu) => {
    setOpenDropdown((prevMenu) => (prevMenu === menu ? null : menu));
  };
  
  

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleLogout = () => {
    logout();
  };

  const closeMegaMenu = (e) => {
    if (!e.target.closest('.header-container')) {
      setIsMenuOpen(false);
    }
  };

  const handleCategoryClick = (categoria) => {
    setTimeout(() => setIsMenuOpen(false), 100); // Pequeno atraso para evitar glitches visuais
    filterNewsByCategory(categoria.toLowerCase());
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
            <span className="nav-item" onClick={() => toggleDropdown('tecnologias')}>Tecnologias ▼</span>
            <div className={`mega-menu-content ${openDropdown === 'tecnologias' ? 'show' : ''}`}>
              
                <Link
                  to="/categoria/inteligencia-artificial"
                  className="sub-item"
                  onClick={() => handleCategoryClick('inteligencia-artificial')}
                >
                  Inteligência Artificial
                </Link>
                <Link
                  to="/categoria/blockchain-e-criptomoedas"
                  className="sub-item"
                  onClick={() => handleCategoryClick('blockchain-e-criptomoedas')}
                >
                  Blockchain e Criptomoedas
                </Link>
                <Link
                  to="/categoria/so-e-softwares"
                  className="sub-item"
                  onClick={() => handleCategoryClick('so-e-softwares')}
                >
                  Sistemas e Softwares
                </Link>
                <Link
                  to="/categoria/veiculos-e-tecnologias"
                  className="sub-item"
                  onClick={() => handleCategoryClick('veiculos-e-tecnologias')}
                >
                  Veículos e Tecnologias
                </Link>
                <Link
                  to="/categoria/jogos"
                  className="sub-item"
                  onClick={() => handleCategoryClick('jogos')}
                >
                  Jogos
                </Link>
                <Link
                  to="/categoria/ciencia-e-espaco"
                  className="sub-item"
                  onClick={() => handleCategoryClick('ciencia-e-espaco')}
                >
                  Ciência e Espaço
                </Link>
              
            </div>
          </div>

          <div className="mega-menu">
          <span className="nav-item" onClick={() => toggleDropdown('entretenimento')}>Entretenimento ▼</span>
          <div className={`mega-menu-content ${openDropdown === 'entretenimento' ? 'show' : ''}`}>
              
                <Link
                  to="/categoria/cinema"
                  className="sub-item"
                  onClick={() => handleCategoryClick('cinema')}
                >
                  Cinema
                </Link>
                <Link
                  to="/categoria/internet"
                  className="sub-item"
                  onClick={() => handleCategoryClick('internet')}
                >
                  Internet
                </Link>
                <Link
                  to="/categoria/redes-sociais"
                  className="sub-item"
                  onClick={() => handleCategoryClick('redes-sociais')}
                >
                  Redes Sociais
                </Link>
              
            </div>
          </div>

          <div className="mega-menu">
            <span className="nav-item" onClick={() => toggleDropdown('mais')}>Outras Categorias ▼</span>
            <div className={`mega-menu-content ${openDropdown === 'mais' ? 'show' : ''}`}>
              
                <Link
                  to="/categoria/agronegocios"
                  className="sub-item"
                  onClick={() => handleCategoryClick('agronegocios')}
                >
                  Agronegócios
                </Link>
                <Link
                  to="/categoria/produtos-e-reviews"
                  className="sub-item"
                  onClick={() => handleCategoryClick('produtos-e-reviews')}
                >
                  Produtos e Reviews
                </Link>
                <Link
                  to="/categoria/saude"
                  className="sub-item"
                  onClick={() => handleCategoryClick('saude')}
                >
                  Saúde
                </Link>
                <Link
                  to="/categoria/educacao-e-cursos"
                  className="sub-item"
                  onClick={() => handleCategoryClick('educacao-e-cursos')}
                >
                  Educação e Cursos
                </Link>
                <Link
                  to="/categoria/sustentabilidade"
                  className="sub-item"
                  onClick={() => handleCategoryClick('sustentabilidade')}
                >
                  Sustentabilidade
                </Link>
                <Link
                  to="/categoria/carreira-e-empregos"
                  className="sub-item"
                  onClick={() => handleCategoryClick('carreira-e-empregos')}
                >
                  Carreira e Empregos
                </Link>
                <Link
                  to="/categoria/estilo-de-vida"
                  className="sub-item"
                  onClick={() => handleCategoryClick('estilo-de-vida')}
                >
                  Estilo de Vida
                </Link>
                <Link
                  to="/categoria/seguranca-digital"
                  className="sub-item"
                  onClick={() => handleCategoryClick('seguranca-digital')}
                >
                  Segurança Digital
                </Link>
                <Link
                  to="/categoria/negocios-e-financas"
                  className="sub-item"
                  onClick={() => handleCategoryClick('negocios-e-financas')}
                >
                  Negócios e Finanças
                </Link>
                <Link
                  to="/categoria/natureza"
                  className="sub-item"
                  onClick={() => handleCategoryClick('natureza')}
                >
                  Natureza
                </Link>
                <Link
                  to="/categoria/fatos"
                  className="sub-item"
                  onClick={() => handleCategoryClick('fatos')}
                >
                  Fatos
                </Link>
              
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