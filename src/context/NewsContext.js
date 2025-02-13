import React, { createContext, useState, useContext, useEffect } from 'react';
import { db, storage } from '../firebaseConfig';
import { collection, addDoc, getDocs, query, where, Timestamp, deleteDoc, doc, limit, startAfter, orderBy } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { convertToRaw } from 'draft-js';

export const NewsContext = createContext();

export const NewsProvider = ({ children }) => {
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [lastVisibleDoc, setLastVisibleDoc] = useState(null); // Armazena o último documento visível
  const [loading, setLoading] = useState(false);



  // Função para adicionar notícias
  const addNews = async ({
    title,
    category,
    summary,
    content,
    image,
    imageCaption,
    videoLink,
    source,
  }) => {
    try {
      let imageUrl = "";

      if (image) {
        const storageRef = ref(storage, `news_images/${image.name}`);
        const uploadTask = uploadBytesResumable(storageRef, image);

        await new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log(`Progresso: ${progress}%`);
            },
            (error) => {
              console.error("Erro ao fazer upload da imagem: ", error);
              reject(error);
            },
            async () => {
              imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
              resolve();
            }
          );
        });
      }

      const rawContent = JSON.stringify(convertToRaw(content.getCurrentContent()));
      await addDoc(collection(db, 'news'), {
        category: category.toLowerCase(),
        title,
        summary,
        content: rawContent,
        imageUrl,
        imageCaption,
        videoLink,
        source,
        createdAt: Timestamp.fromDate(new Date()),
      });

      console.log("Notícia adicionada com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar notícia: ", error);
    }
  };

  // Função para buscar todas as notícias
  const fetchAllNews = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'news'));
      const now = new Date();
      const oneMonthInMs = 30 * 24 * 60 * 60 * 1000; // 30 dias em ms

      const newsArray = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      newsArray.forEach((item) => {
        if (item.createdAt && item.createdAt.toDate) {
          const createdAt = item.createdAt.toDate();

          if (now - createdAt >= oneMonthInMs) {
            console.log(`Excluindo notícia: ${item.id}, pois passou de 1 mês`);
            deleteNews(item.id, item.imageUrl);
          }
        }
      });

      setNews(newsArray.filter(item => {
        const createdAt = item.createdAt?.toDate?.();
        return createdAt && (now - createdAt) < oneMonthInMs;
      }));

    } catch (error) {
      console.error("Erro ao carregar notícias:", error);
    } finally {
      setLoading(false);
    }
  };

  // Função para filtrar notícias por categoria

  const filterNewsByCategory = async (categoria, page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const decodedCategory = decodeURIComponent(categoria).toLowerCase();
      console.log("Categoria filtrada:", decodedCategory);

  
      const newsRef = collection(db, "news");
      let q = query(newsRef, where("category", "==", decodedCategory), orderBy("createdAt", "desc"), limit(pageSize));
  
      // Se for uma nova página, paginamos a partir do último documento visível
      if (page > 1 && lastVisibleDoc) {
        q = query(newsRef, where("category", "==", decodedCategory), orderBy("createdAt", "desc"), startAfter(lastVisibleDoc), limit(pageSize));
      }
  
      const querySnapshot = await getDocs(q);
      const newFilteredNews = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      console.log("Notícias filtradas:", newFilteredNews);
  
      setFilteredNews((prevNews) => (page === 1 ? newFilteredNews : [...prevNews, ...newFilteredNews]));
  
      // Atualiza o último documento visível para a próxima página
      if (querySnapshot.docs.length > 0) {
        setLastVisibleDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
      }
  
      return newFilteredNews;
    } catch (error) {
      console.error("Erro ao buscar notícias:", error);
      return [];
    } finally {
      setLoading(false);
    }
  };
  




  // Função para deletar notícias
  const deleteNews = async (newsId, imageUrl) => {
    try {
      if (imageUrl) {
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);
        console.log("Imagem deletada com sucesso!");
      }

      const newsRef = doc(db, 'news', newsId);
      await deleteDoc(newsRef);
      console.log("Notícia deletada com sucesso!");

      setNews(prevNews => prevNews.filter(news => news.id !== newsId));
    } catch (error) {
      console.error("Erro ao excluir a notícia:", error);
    }
  };

  useEffect(() => {
    fetchAllNews(); // Executa imediatamente ao montar o componente
    const interval = setInterval(() => {
      fetchAllNews();
    }, 2592000000); // 1 mês em milissegundos (30 dias)

    return () => clearInterval(interval);
  }, []);

  return (
    <NewsContext.Provider value={{
      news,
      loading,
      fetchAllNews,
      filterNewsByCategory,
      addNews,
      deleteNews
    }}>
      {children}
    </NewsContext.Provider>
  );
};

export const useNews = () => useContext(NewsContext);