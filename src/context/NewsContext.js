import React, { createContext, useState, useContext, useEffect } from 'react';
import { db, storage } from '../firebaseConfig';
import { collection, addDoc, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

export const NewsContext = createContext();

export const NewsProvider = ({ children }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

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

        // Aguarda o upload da imagem antes de continuar
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

      // Adiciona a notícia ao Firestore
      await addDoc(collection(db, 'news'), {
        category: category.toLowerCase(), // Garante que a categoria sempre será salva em minúsculas
        title,
        summary,
        content,
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

  // Função para buscar notícias por categoria
  const getNewsByCategory = async (categoria) => {
    setLoading(true);
    try {
      const q = query(collection(db, 'news'), where('category', '==', categoria.toLowerCase()));
      const querySnapshot = await getDocs(q);
      const newsArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNews(newsArray);
    } catch (error) {
      console.error("Erro ao buscar notícias por categoria: ", error);
    } finally {
      setLoading(false);
    }
  };

  // Carregar todas as notícias ao inicializar o contexto
  useEffect(() => {
    const fetchAllNews = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, 'news'));
        const newsArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setNews(newsArray);
      } catch (error) {
        console.error("Erro ao carregar notícias: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllNews();
  }, []);

  return (
    <NewsContext.Provider value={{ news, loading, addNews, getNewsByCategory }}>
      {children}
    </NewsContext.Provider>
  );
};

// Hook para acessar o contexto em outros componentes
export const useNews = () => useContext(NewsContext);
