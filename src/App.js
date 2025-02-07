import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import './App.css';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import NewsDetail from './pages/NewsDetail'; // Importa a página de detalhes da notícia
import { AuthProvider } from './context/AuthContext';
import { NewsProvider } from './context/NewsContext'; // Importa o NewsProvider

const App = () => {

  return (
    <AuthProvider>
      {/* Agora envolvemos o NewsProvider aqui */}
      <NewsProvider>
        <Router>
          <Header />
          <Routes>
            {/* Rota para a página inicial (Home) */}
            <Route 
              path="/" 
              element={<Home />} // Passa a função para a Home
            />

            {/* Rota para o painel do Dashboard */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Rota para a página de detalhes da notícia */}
            <Route path="/news/:id" element={<NewsDetail />} /> {/* Página de detalhes da notícia */}
          </Routes>
        </Router>
      </NewsProvider>
    </AuthProvider>
  );
};

export default App;
