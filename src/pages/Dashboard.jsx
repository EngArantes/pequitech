import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import AddNews from "../components/AddNews"; // Componente para adicionar notícias
import AddVideos from "../components/AddVideos"; // Componente para gerenciar usuários
import Mensagens from "../components/ListagemDeMensagens"; // Componente para configurações
import AddBanners from '../components/AddPrincipalBanner';
import AddBannersLaterais from '../components/AddLateraisBanner';
import AddBannerMeioCard from '../components/AddBannerMeioCards';

import "./CSS/Dashboard.css";

const Dashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState('news'); // Seção ativa (padrão 'news')

  // Redireciona se o usuário não estiver autenticado
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <h2>Dashboard</h2>
        <button
          onClick={() => setActiveSection('news')}
          className={`sidebar-item ${activeSection === 'news' ? 'active' : ''}`}
        >
          Notícias
        </button>
        <button
          onClick={() => setActiveSection('add-banners')}
          className={`sidebar-item ${activeSection === 'add-banners' ? 'active' : ''}`}
        >
          Banners
        </button>
        <button
          onClick={() => setActiveSection('users')}
          className={`sidebar-item ${activeSection === 'users' ? 'active' : ''}`}
        >
          Vídeos
        </button>
        <button
          onClick={() => setActiveSection('settings')}
          className={`sidebar-item ${activeSection === 'settings' ? 'active' : ''}`}
        >
          Mensagens
        </button>
      </div>

      {/* Navbar para dispositivos móveis */}
      <div className="navbar">
        <button onClick={() => setActiveSection('news')}>
          <i className="fas fa-newspaper"></i> Notícias
        </button>
        <button onClick={() => setActiveSection('add-banners')}>
          <i className="fas fa-image"></i> Banners
        </button>
        <button onClick={() => setActiveSection('users')}>
          <i className="fas fa-users"></i> Vídeos
        </button>
        <button onClick={() => setActiveSection('mensagens')}>
          <i className="fas fa-cog"></i> Mensagens
        </button>
      </div>


      <div className="dashboard-content">

        {activeSection === 'news' && (
          <div className="section">
            <AddNews /> {/* Componente para adicionar notícias */}
          </div>
        )}

        {activeSection === 'add-banners' && (
          <div className="section-banners">
            <AddBanners /> {/* Componente para gerenciar banners */}
            <AddBannersLaterais />
            <AddBannerMeioCard />
          </div>
         
        )}

        {activeSection === 'users' && (
          <div className="section">
            <AddVideos /> {/* Componente para gerenciar videos */}
          </div>
        )}

        {activeSection === 'settings' && (
          <div className="section">
            <Mensagens /> {/* Componente para configurações */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
