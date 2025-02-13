import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NewsCard from "../components/NewsCard";
import BannerDireita from "../components/RenderRightBanner";
import BannerEsquerda from "../components/RenderLeftBanner";
import { useNews } from "../context/NewsContext";
import InfiniteScroll from "react-infinite-scroll-component";
import "./CSS/Home.css";

const CategoryPage = () => {
  const { categoria } = useParams();
  const { loading, filterNewsByCategory } = useNews();
  const [news, setNews] = useState([]); // Estado inicial como array vazio
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        if (!categoria) return;

        setHasMore(true); // Resetando paginação
        setPage(1); // Reinicia a contagem de páginas

        const filtered = await filterNewsByCategory(categoria, 1);
        console.log("Notícias filtradas:", filtered); // Verificação no console

        if (Array.isArray(filtered)) {
          setNews(filtered);
          setHasMore(filtered.length > 0);
        } else {
          setNews([]); // Evita que `news` seja undefined
          setHasMore(false);
        }
      } catch (error) {
        console.error("Erro ao buscar notícias:", error);
      }
    };

    fetchNews();
  }, [categoria]);

  const fetchMoreNews = async () => {
    try {
      const newPage = page + 1;
      const newNews = await filterNewsByCategory(categoria, newPage);

      if (Array.isArray(newNews) && newNews.length > 0) {
        setNews((prevNews) => [...prevNews, ...newNews]); // Adiciona novas notícias
        setPage(newPage);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Erro ao buscar mais notícias:", error);
      setHasMore(false);
    }
  };

  return (
    <div className="home">
      <main className="news-grid">
        <div className="coluna-esquerda">
          <BannerEsquerda />
        </div>
        <div className="coluna-central">
          <InfiniteScroll
            dataLength={news.length}
            next={fetchMoreNews}
            hasMore={hasMore}
            loader={loading ? <div className="spinner"></div> : null}
            endMessage={<p style={{ textAlign: "center" }}>Você chegou ao final!</p>}
          >
            <div className="news-container">
              {news.length > 0 ? (
                news.map((item) => (
                  <NewsCard
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    summary={item.summary}
                    imageUrl={item.imageUrl}
                    date={new Date(item.createdAt.seconds * 1000).toLocaleString("pt-BR", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  />
                ))
              ) : (
                <p style={{ textAlign: "center" }}>Nenhuma notícia encontrada.</p>
              )}
            </div>
          </InfiniteScroll>
        </div>
        <div className="coluna-direita">
          <BannerDireita />
        </div>
      </main>
    </div>
  );
};

export default CategoryPage;
