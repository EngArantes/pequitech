import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/autoplay';
import { Autoplay } from 'swiper/modules';
import './CSS/NewsTicker.css';

const NewsTicker = () => {
  const [latestNews, setLatestNews] = useState([]);

  useEffect(() => {
    const fetchLatestNews = async () => {
      try {
        const newsRef = collection(db, 'news');
        const q = query(newsRef, orderBy('createdAt', 'desc'), limit(5));
        const querySnapshot = await getDocs(q);
        const newsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          title: doc.data().title,
          slug: doc.data().slug,
        }));
        setLatestNews(newsList);
      } catch (error) {
        console.error("Erro ao buscar as últimas notícias:", error);
      }
    };

    fetchLatestNews();
  }, []);

  return (
    <div className="news-ticker">
      <Swiper
        spaceBetween={10}
        slidesPerView={1}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        modules={[Autoplay]}
      >
        {latestNews.map(news => (
          <SwiperSlide key={news.id}>
            <Link to={`/noticia/${news.slug}`} className="news-ticker-item">
              {news.title}
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default NewsTicker;