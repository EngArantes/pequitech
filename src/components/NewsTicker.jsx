import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { FaInstagram, FaYoutube } from 'react-icons/fa';
import './CSS/NewsTicker.css';

const NewsTicker = () => {
  const [latestNews, setLatestNews] = useState([]);

  useEffect(() => {
    const fetchLatestNews = async () => {
      try {
        const newsRef = collection(db, 'news');
        const q = query(newsRef, orderBy('createdAt', 'desc'), limit(10));
        const querySnapshot = await getDocs(q);
        const newsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          title: doc.data().title,
          slug: doc.data().slug || doc.id,
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
      <div className="ticker-wrapper">
        <div className="ticker-content">
          {latestNews.map(news => (
            <Link key={news.id} to={`/news/${news.slug}`} className="news-ticker-item">
              {news.title}
            </Link>
          ))}
          {/* Duplicar os itens para loop contínuo */}
          {latestNews.map(news => (
            <Link key={`${news.id}-duplicate`} to={`/news/${news.slug}`} className="news-ticker-item">
              {news.title}
            </Link>
          ))}
        </div>
      </div>
      <div className="social-links">
        <a
          href="https://www.instagram.com/pequi_tech/"
          target="_blank"
          rel="noopener noreferrer"
          className="social-link"
        >
          <FaInstagram size={24} color="#fff" />
        </a>
        <a
          href="https://www.youtube.com/@PequiTech"
          target="_blank"
          rel="noopener noreferrer"
          className="social-link"
        >
          <FaYoutube size={24} color="#fff" />
        </a>
      </div>
    </div>
  );
};

export default NewsTicker;