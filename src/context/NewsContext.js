import React, { createContext, useState, useContext, useEffect } from 'react';
import { db, storage } from '../firebaseConfig';
import { collection, addDoc, getDocs, query, where, Timestamp, deleteDoc, doc, limit, startAfter, orderBy, updateDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';

export const NewsContext = createContext();

export const NewsProvider = ({ children }) => {
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [lastVisibleDoc, setLastVisibleDoc] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')  // Remove caracteres especiais
      .replace(/\s+/g, '-')      // Substitui espaços por "-"
      .trim();
  };
  
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
      const slug = generateSlug(title); // Gerar slug baseado no título
  
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
  
      const rawContent = content; // Já vem como JSON.stringify(convertToRaw) do AddNews
      await addDoc(collection(db, 'news'), {
        category: category.toLowerCase(),
        title,
        slug,  // Adicionando o slug ao Firestore
        summary,
        content: rawContent,
        imageUrl,
        imageCaption,
        videoLink: videoLink || '',
        source,
        createdAt: Timestamp.fromDate(new Date()),
      });
  
      console.log("Notícia adicionada com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar notícia: ", error);
      throw error;
    }
  };
  

  const fetchAllNews = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'news'));
      const now = new Date();
      const oneMonthInMs = 30 * 24 * 60 * 60 * 1000;

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

  const filterNewsByCategory = async (categoria, page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const decodedCategory = decodeURIComponent(categoria).toLowerCase();
      console.log("Categoria filtrada:", decodedCategory);

      const newsRef = collection(db, "news");
      let q = query(newsRef, where("category", "==", decodedCategory), orderBy("createdAt", "desc"), limit(pageSize));

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

  //////Edita noticia
  const updateNews = async (newsId, updatedData) => {
    try {
      let imageUrl = updatedData.imageUrl;

      // Se uma nova imagem foi enviada
      if (updatedData.image instanceof File) {
        const storageRef = ref(storage, `news_images/${updatedData.image.name}`);
        const uploadTask = uploadBytesResumable(storageRef, updatedData.image);

        imageUrl = await new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log(`Progresso do upload: ${progress}%`); // Depuração
            },
            (error) => reject(error),
            async () => {
              const url = await getDownloadURL(uploadTask.snapshot.ref);
              if (updatedData.oldImageUrl) {
                try {
                  const oldImageRef = ref(storage, updatedData.oldImageUrl);
                  await deleteObject(oldImageRef);
                  console.log("Imagem antiga deletada com sucesso:", updatedData.oldImageUrl);
                } catch (deleteError) {
                  if (deleteError.code === 'storage/object-not-found') {
                    console.log("Imagem antiga não encontrada, prosseguindo:", updatedData.oldImageUrl);
                  } else {
                    console.error("Erro ao deletar imagem antiga:", deleteError);
                  }
                  // Não rejeita a Promise, apenas continua
                }
              }
              resolve(url);
            }
          );
        });
      }

      const newsRef = doc(db, 'news', newsId);
      await updateDoc(newsRef, {
        category: updatedData.category.toLowerCase(),
        title: updatedData.title,
        summary: updatedData.summary,
        content: updatedData.content,
        imageUrl: imageUrl,
        imageCaption: updatedData.imageCaption,
        videoLink: updatedData.videoLink || '',
        source: updatedData.source,
      });

      // Atualizar o estado local
      setNews(prevNews => prevNews.map(item =>
        item.id === newsId ? { ...item, ...updatedData, imageUrl } : item
      ));

      console.log("Notícia atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar notícia:", error);
      throw error;
    }
  };


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
    fetchAllNews();
    const interval = setInterval(() => {
      fetchAllNews();
    }, 2592000000);

    return () => clearInterval(interval);
  }, []);

  return (
    <NewsContext.Provider value={{
      news,
      loading,
      fetchAllNews,
      filterNewsByCategory,
      addNews,
      deleteNews,
      updateNews
    }}>
      {children}
    </NewsContext.Provider>
  );
};

export const useNews = () => useContext(NewsContext);