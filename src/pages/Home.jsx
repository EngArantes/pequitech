import React, { useState, useEffect } from 'react';
import NewsCard from '../components/NewsCard';
import { db } from '../firebaseConfig';
import { collection, getDocs, query, orderBy, limit, startAfter } from 'firebase/firestore';
import './CSS/Home.css';
import PrincipalBanner from '../components/RenderPrincipalBanner';
import InfiniteScroll from 'react-infinite-scroll-component';
import BannerDireita from '../components/RenderRightBanner';
import BannerEsquerda from '../components/RenderLeftBanner';

const Home = () => {
  const [news, setNews] = useState([]); // Para armazenar as notícias
  const [loading, setLoading] = useState(true); // Para controlar o estado de carregamento
  const [hasMore, setHasMore] = useState(true); // Para verificar se ainda há mais notícias
  const [lastVisible, setLastVisible] = useState(null); // Para controlar a última notícia visível

  const fetchNews = async () => {
    const newsCollection = collection(db, 'news');
    const newsQuery = lastVisible 
      ? query(newsCollection, orderBy('createdAt', 'desc'), startAfter(lastVisible), limit(8))  // Limite aumentado para 8
      : query(newsCollection, orderBy('createdAt', 'desc'), limit(8));  // Limite aumentado para 8

    try {
      const newsSnapshot = await getDocs(newsQuery);
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

      setNews((prevNews) => [...prevNews, ...newsList]);
      setLoading(false);

      // Atualizando o último documento para carregar mais na próxima consulta
      const lastVisibleDoc = newsSnapshot.docs[newsSnapshot.docs.length - 1];
      setLastVisible(lastVisibleDoc);

      // Se não houver mais documentos, define hasMore como false
      if (newsSnapshot.empty) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Erro ao buscar as notícias:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(); // Chama a função de busca quando o componente é montado
  }, []); // Executa apenas uma vez ao montar o componente

  return (
    <div className="home">
      <div><PrincipalBanner /></div>
      <main className="news-grid">
        <div className="coluna-esquerda"><BannerEsquerda/></div>
        <div className="coluna-central">
          {loading ? (
            <div className="spinner">Carregando...</div>
          ) : (
            <InfiniteScroll
              dataLength={news.length}
              next={fetchNews}
              hasMore={hasMore}
              loader={<div className="spinner">Carregando mais notícias...</div>}
              endMessage={<p style={{ textAlign: 'center' }}>Você chegou ao final!</p>}
            >
              <div className="news-container">
                {news.map((item) => (
                  <NewsCard
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    summary={item.summary}
                    imageUrl={item.imageUrl}
                    date={item.date}
                  />
                ))}
              </div>
            </InfiniteScroll>
          )}
        </div>
        <div className="coluna-direita"><BannerDireita/></div>
      </main>
    </div>
  );
};

export default Home;
