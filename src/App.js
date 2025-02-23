import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import GaleriaDeVideos from './pages/VideoGallery';
import './App.css';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import NewsDetail from './pages/NewsDetail';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NewsProvider } from './context/NewsContext';
import Footer from './components/Footer';
import CategoryPage from './pages/CategoryPage';
import TermosDeUsoPrivacidade from './pages/TermosDeUsoPrivacidade';
import SobreNos from './pages/SobreNos';
import ErrorBoundary from "./context/ErrorBoundary";



const App = () => {
  return (
    <AuthProvider>
      <NewsProvider>
        <Router>
          {/* Passando o setCategoriaSelecionada para o Header */}
          <Header />
          <ErrorBoundary>
            <Routes>
              {/* Home */}
              <Route path="/" element={<Home />} />
              <Route path="/galeria-de-videos" element={<GaleriaDeVideos />} />
              <Route path="/termos-de-uso-e-privacidade" element={<TermosDeUsoPrivacidade />} />
              <Route path="/sobre-nos" element={<SobreNos />} />

              {/* Rota para a página de categoria */}
              <Route path="/categoria/:categoria" element={<CategoryPage />} />

              <Route path="/dashboard" element={<Dashboard />}  />
              <Route path="/news/:id" element={<NewsDetail />} />
            </Routes>
          </ErrorBoundary>
          <Footer />
        </Router>

      </NewsProvider>
    </AuthProvider>
  );
};

export default App;
