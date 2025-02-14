import React, { useState, useEffect } from 'react';
import NewsCard from '../components/NewsCard';
import { db } from '../firebaseConfig';
import { collection, getDocs, query, orderBy, limit, startAfter, where } from 'firebase/firestore';
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

  // Função para buscar notícias
  const fetchNews = async () => {
    const newsCollection = collection(db, 'news');
    const newsQuery = lastVisible
      ? query(newsCollection, where('createdAt', '!=', null), orderBy('createdAt', 'desc'), startAfter(lastVisible), limit(8))
      : query(newsCollection, where('createdAt', '!=', null), orderBy('createdAt', 'desc'), limit(8));
  
    try {
      const newsSnapshot = await getDocs(newsQuery);
      const newsList = newsSnapshot.docs.map((doc) => {
        const data = doc.data();
        let formattedDate = "Data não disponível"; // Valor padrão
  
        // Verifica se createdAt é um Timestamp e formata
        if (data.createdAt && data.createdAt.seconds) {
          const dateObject = new Date(data.createdAt.seconds * 1000); // Converte de segundos para milissegundos
          formattedDate = dateObject.toLocaleString("pt-BR", { 
            dateStyle: "short", 
            timeStyle: "short" 
          });
        }
  
        return {
          id: doc.id,
          title: data.title,
          summary: data.summary,
          date: formattedDate, // Passando a string formatada
          imageUrl: data.imageUrl || '',
        };
      });
  
      // Evitar duplicação no estado
      setNews((prevNews) => {
        const uniqueNews = newsList.filter((newsItem) =>
          !prevNews.some((prevItem) => prevItem.id === newsItem.id)
        );
        return [...prevNews, ...uniqueNews];
      });
  
      // Atualizando o último documento para carregar mais na próxima consulta
      const lastVisibleDoc = newsSnapshot.docs[newsSnapshot.docs.length - 1];
      setLastVisible(lastVisibleDoc);
  
      // Se não houver mais documentos, define hasMore como false
      if (newsSnapshot.empty) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Erro ao buscar as notícias:', error);
      setHasMore(false); // Não há mais notícias para carregar se der erro
    } finally {
      setLoading(false);
    }
  };
  
  
  

  useEffect(() => {
    fetchNews(); // Chama a função de busca quando o componente é montado
  }, []); // Adicionando dependência vazia para chamar apenas uma vez

  return (
    <div className="home">
      <div><PrincipalBanner /></div>
      <h2>Últimas Notícias</h2>
      <main className="news-grid">
        <div className="coluna-esquerda"><BannerEsquerda /></div>
        <div className="coluna-central">
          {loading ? (
            <div className="spinner"></div>
          ) : (
            <InfiniteScroll
              dataLength={news.length}
              next={fetchNews}
              hasMore={hasMore}
              loader={<div className="spinner"></div>}
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
        <div className="coluna-direita"><BannerDireita /></div>
      </main>
    </div>
  );
};

export default Home;
