import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import "./CSS/NewsList.css";

const NewsList = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "news"));
        const newsList = querySnapshot.docs.map(doc => {
          const data = doc.data();
          const createdAt = data.createdAt ? data.createdAt.toDate() : null; // Verifica se createdAt existe

          return {
            title: data.title,
            content: data.content,
            createdAt: createdAt // A data será um objeto Date ou null
          };
        });
        setNews(newsList);
      } catch (error) {
        console.error("Erro ao buscar notícias: ", error);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="news-list-container">
      <h3>Lista de Notícias</h3>
      {news.length === 0 ? (
        <p>Nenhuma notícia disponível.</p>
      ) : (
        <ul>
          {news.map((newsItem, index) => (
            <li key={index}>
              <h4>{newsItem.title}</h4>
              <p>{newsItem.content}</p>
              {newsItem.createdAt ? (
                <p><strong>Data de Criação:</strong> {newsItem.createdAt.toLocaleDateString()}</p>
              ) : (
                <p><strong>Data de Criação:</strong> Não disponível</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NewsList;
