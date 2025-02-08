import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import './App.css';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import NewsDetail from './pages/NewsDetail';
import { AuthProvider } from './context/AuthContext';
import { NewsProvider } from './context/NewsContext';
import Footer from './components/Footer';
import CategoryPage from './pages/CategoryPage';

const App = () => {
  return (
    <AuthProvider>
      <NewsProvider>
        <Router>
          {/* Passando o setCategoriaSelecionada para o Header */}
          <Header />

          <Routes>
            {/* Home */}
            <Route path="/" element={<Home />} />
            
            {/* Rota para a página de categoria */}
            <Route path="/categoria/:categoria" element={<CategoryPage />} /> 

            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/news/:id" element={<NewsDetail />} />
          </Routes>

          <Footer />
        </Router>
      </NewsProvider>
    </AuthProvider>
  );
};

export default App;
