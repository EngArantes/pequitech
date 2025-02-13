import React, { useEffect, useState } from "react";
import { useNews } from "../context/NewsContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import NewsCard from "./NewsCard"; // Importa o componente de Card

const NewsCarousel = () => {
  const { news, fetchAllNews } = useNews();
  const [latestNews, setLatestNews] = useState([]);

  useEffect(() => {
    fetchAllNews(); // Busca todas as notícias
  }, [fetchAllNews]);  // Adicionando fetchAllNews como dependência
  

  useEffect(() => {
    if (news.length > 0) {
      const sortedNews = [...news]
        .sort((a, b) => b.createdAt - a.createdAt) // Ordena por data
        .slice(0, 20); // Pega as últimas 20 notícias
      setLatestNews(sortedNews);
    }
  }, [news]);

  return (
    <div className="carousel-container">
      <h2>Últimas Notícias</h2>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={5} // Exibe 5 por vez
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000 }}
      >
        {latestNews.map((item) => (
          <SwiperSlide key={item.id}>
            <NewsCard
              id={item.id}
              title={item.title}
              summary={item.summary}
              imageUrl={item.imageUrl}
              date={item.createdAt}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default NewsCarousel;
