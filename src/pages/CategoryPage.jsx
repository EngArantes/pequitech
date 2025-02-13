import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NewsCard from '../components/NewsCard';
import BannerDireita from '../components/RenderRightBanner';
import BannerEsquerda from '../components/RenderLeftBanner';
import { useNews } from '../context/NewsContext';
import InfiniteScroll from 'react-infinite-scroll-component';

import './CSS/Home.css';

const CategoryPage = () => {
  const { categoria } = useParams();
  const { news = [], loading, filterNewsByCategory } = useNews();
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (categoria) {
      setPage(1); // Reinicia a página ao mudar de categoria
      filterNewsByCategory(categoria, 1).then((initialNews) => {
        setHasMore(initialNews?.length > 0);
      });
    }
  }, [categoria]);

  const fetchMoreNews = async () => {
    const newPage = page + 1;
    const newNews = await filterNewsByCategory(categoria, newPage);

    if (!newNews || newNews.length === 0) {
      setHasMore(false); // Não há mais notícias para carregar
    } else {
      setPage(newPage);
    }
  };

  const formatDate = (createdAt) => {
    if (createdAt instanceof Object && "toDate" in createdAt) {
      return createdAt.toDate().toLocaleString("pt-BR", {
        dateStyle: "short",
        timeStyle: "short", // Adiciona o horário e formata a data
      });
    }
    return "Data não disponível";
  };

  return (
    <div className="home">
      <main className="news-grid">
        <div className="coluna-esquerda"><BannerEsquerda /></div>
        <div className="coluna-central">
          {loading && page === 1 ? (
            <div className="spinner"></div>
          ) : (
            <InfiniteScroll
              dataLength={news.length || 0} // Garante que seja um número válido
              next={fetchMoreNews}
              hasMore={hasMore}
              loader={<div className="spinner"></div>}
              endMessage={<p style={{ textAlign: 'center' }}>Você chegou ao final!</p>}
            >
              <div className="news-container">
                {news.map((newsItem) => (
                  <NewsCard
                    key={newsItem.id}
                    id={newsItem.id}
                    title={newsItem.title}
                    summary={newsItem.summary}
                    imageUrl={newsItem.imageUrl}
                    date={formatDate(newsItem.createdAt)} // Formata a data conforme necessário
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
