import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import AddNews from "../components/AddNews"; // Componente para adicionar notícias
import NewsList from "../components/NewsList"; // Componente para exibir notícias
import ManageUsers from "../components/ManageUsers"; // Componente para gerenciar usuários
import Settings from "../components/Settings"; // Componente para configurações
import AddBanners from '../components/AddPrincipalBanner';
import AddBannersLaterais from '../components/AddLateraisBanner';
import AddBannerMeioCard from '../components/AddBannerMeioCards';

import "./CSS/Dashboard.css";

const Dashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState('news'); // Seção ativa (padrão 'news')
  const [news, setNews] = useState([]);

  // Redireciona se o usuário não estiver autenticado
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  // Carregar as notícias do Firestore
  useEffect(() => {
    const fetchNews = async () => {
      // Exemplo de chamada para buscar notícias (pode ser adaptado conforme necessário)
      const newsData = [
        { title: 'Notícia 1', content: 'Conteúdo da notícia 1' },
        { title: 'Notícia 2', content: 'Conteúdo da notícia 2' }
      ];
      setNews(newsData);
    };
    fetchNews();
  }, []);

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
          Usuários
        </button>
        <button
          onClick={() => setActiveSection('settings')}
          className={`sidebar-item ${activeSection === 'settings' ? 'active' : ''}`}
        >
          Configurações
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
            <ManageUsers /> {/* Componente para gerenciar usuários */}
          </div>
        )}

        {activeSection === 'settings' && (
          <div className="section">
            <Settings /> {/* Componente para configurações */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
