// src/pages/NewsDetail.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Para acessar o parâmetro da URL
import { db } from '../firebaseConfig'; // Importe o Firestore
import { doc, getDoc } from 'firebase/firestore';
import './CSS/NewsDetail.css';

const NewsDetail = () => {
  const { id } = useParams(); // Pega o ID da notícia na URL
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true); // Estado para indicar carregamento
  const [error, setError] = useState(""); // Estado para mensagens de erro

  // Função para buscar a notícia detalhada
  const fetchNewsDetail = async () => {
    try {
      const newsDoc = doc(db, 'news', id); // Acessa o documento da coleção 'news' com o ID fornecido
      const newsSnapshot = await getDoc(newsDoc);

      if (newsSnapshot.exists()) {
        const data = newsSnapshot.data();
        setNews({
          title: data.title,
          description: data.description,
          content: data.content, // O conteúdo completo da notícia
          date: data.date.toDate().toLocaleDateString(), // Formatação da data
          imageUrl: data.imageUrl || '',
        });
      } else {
        setError("Notícia não encontrada.");
      }
    } catch (err) {
      console.error("Erro ao buscar a notícia:", err);
      setError("Erro ao carregar a notícia. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewsDetail();
  }, [id]);

  if (loading) {
    return <p>Carregando detalhes...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="news-detail">
      {news ? (
        <div className="news-content">
          <h1>{news.title}</h1>
          {news.imageUrl && (
            <img src={news.imageUrl} alt={news.title} className="news-image" />
          )}
          <p className="news-date">{news.date}</p>
          <p className="news-description">{news.description}</p>
          <p className="news-content-text">{news.content}</p>
        </div>
      ) : (
        <p>Nenhuma notícia encontrada.</p>
      )}
    </div>
  );
};

export default NewsDetail;