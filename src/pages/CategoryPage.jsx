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
  const { news, loading, filterNewsByCategory } = useNews();
  const [hasMore, setHasMore] = useState(true); // Para verificar se ainda há mais notícias

  useEffect(() => {
    if (categoria) {
      filterNewsByCategory(categoria).then(() => {
        // Quando a categoria for filtrada, verificar se ainda há mais notícias
        setHasMore(news.length > 0);
      });
    }
  }, [categoria, news.length]);

  const categoriaDecoded = decodeURIComponent(categoria).toUpperCase();

  return (
    <div className="home">
      <main className="news-grid">
        <div className="coluna-esquerda"><BannerEsquerda /></div>
        <div className="coluna-central">
          {loading ? (
            <div className="spinner"></div>
          ) : (
            <InfiniteScroll
              dataLength={news.length}
              next={categoriaDecoded}
              hasMore={hasMore}  // O hasMore vai ser atualizado aqui
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
