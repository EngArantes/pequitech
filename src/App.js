import React, { useState } from 'react'; // Adiciona o useState
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Adiciona o Routes e Route
import Home from './pages/Home';
import './App.css';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import NewsDetail from './pages/NewsDetail'; // Importa a página de detalhes da notícia
import { AuthProvider } from './context/AuthContext';

const App = () => {
  const [currentStreamUrl, setCurrentStreamUrl] = useState(null); // Armazena a URL do stream da estação

  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          {/* Rota para a página inicial (Home) */}
          <Route 
            path="/" 
            element={<Home onPlay={setCurrentStreamUrl} />} // Passa a função para a Home
          />

          {/* Rota para o painel do Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Rota para a página de detalhes da notícia */}
          <Route path="/news/:id" element={<NewsDetail />} /> {/* Página de detalhes da notícia */}
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
