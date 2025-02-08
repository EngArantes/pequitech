import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { collection, getDocs, query, orderBy, limit, startAfter, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import InfiniteScroll from 'react-infinite-scroll-component';
import NewsCard from '../components/NewsCard';
import BannerDireita from '../components/RenderRightBanner';
import BannerEsquerda from '../components/RenderLeftBanner';
import './CSS/Home.css';

const CategoryPage = () => {
  const { categoria } = useParams();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [lastVisible, setLastVisible] = useState(null);

  // Função fetchNews com useCallback
  const fetchNews = useCallback(async () => {
    if (loading) return; // Impede que a função seja chamada se já estiver carregando

    setLoading(true); // Marca como carregando
    const newsCollection = collection(db, 'news');
    const formattedCategory = decodeURIComponent(categoria).replace(/\s/g, '-').toLowerCase();

    console.log('Consultando notícias para a categoria:', formattedCategory); // Log de depuração para ver qual categoria está sendo consultada

    const newsQuery = lastVisible
      ? query(
          newsCollection,
          where('category', '==', formattedCategory),
          orderBy('createdAt', 'desc'),
          startAfter(lastVisible),
          limit(8)
        )
      : query(
          newsCollection,
          where('category', '==', formattedCategory),
          orderBy('createdAt', 'desc'),
          limit(8)
        );

    try {
      const newsSnapshot = await getDocs(newsQuery);

      // Verificando o que está vindo do Firebase
      console.log('newsSnapshot:', newsSnapshot);
      console.log('Quantidade de documentos retornados:', newsSnapshot.docs.length);

      if (newsSnapshot.empty) {
        console.log('Nenhuma notícia encontrada.');
      }

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

      // Garantir que os dados são únicos e adicionar ao estado
      setNews((prevNews) => {
        const uniqueNews = newsList.filter((newsItem) =>
          !prevNews.some((prevItem) => prevItem.id === newsItem.id)
        );
        return [...prevNews, ...uniqueNews];
      });

      const lastVisibleDoc = newsSnapshot.docs[newsSnapshot.docs.length - 1];
      setLastVisible(lastVisibleDoc);

      // Atualizando o estado de "hasMore" com base no que veio do Firestore
      setHasMore(newsSnapshot.docs.length > 0);

    } catch (error) {
      console.error('Erro ao buscar as notícias:', error);
      setHasMore(false);  // Caso haja erro, parar de carregar mais notícias
    } finally {
      console.log('Finalizando carregamento de notícias');
      setLoading(false); // Marcar como não carregando
    }
  }, [categoria, lastVisible, loading]); // Ajustado para incluir o loading como dependência

  // Executa sempre que a categoria mudar
  useEffect(() => {
    console.log('Mudando a categoria, reiniciando dados...');
    setNews([]);
    setLastVisible(null);
    setHasMore(true);
    fetchNews();
  }, [categoria, fetchNews]); // Certifique-se de que fetchNews é estável

  return (
    <div className="home">
      <h2 className='nomeCategoria'>{decodeURIComponent(categoria)}</h2>
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

export default CategoryPage;
