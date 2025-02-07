import React, { useState, useEffect } from 'react';
import NewsCard from '../components/NewsCard';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import './CSS/Home.css';
import PrincipalBanner from '../components/RenderPrincipalBanner';

const Home = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNews = async () => {
    const newsCollection = collection(db, 'news');
    const newsSnapshot = await getDocs(newsCollection);
    const newsList = newsSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        summary: data.summary,
        date: data.createdAt ? data.createdAt.toDate().toLocaleDateString() : 'Data não disponível',
        imageUrl: data.imageUrl || '',
      };
    });
    setNews(newsList);
    setLoading(false);
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div className="home">
      <div><PrincipalBanner/></div>
      <main className="news-grid">
        <div className="coluna-esquerda">Coluna esquerda</div>
        <div className="coluna-central">
          {loading ? (
            <div className="spinner"></div>
          ) : news.length > 0 ? (
            <div className="news-container">
              {news.map((item) => (
                <NewsCard
                  key={item.id}
                  title={item.title}
                  summary={item.summary}
                  imageUrl={item.imageUrl}
                  date={item.date}
                />
              ))}
            </div>
          ) : (
            <p>Sem notícias para exibir.</p>
          )}
        </div>
        <div className="coluna-direita">Coluna direita</div>
      </main>
    </div>
  );
};

export default Home;