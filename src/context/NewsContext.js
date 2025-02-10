import React, { createContext, useState, useContext } from 'react';
import { db, storage } from '../firebaseConfig';
import { collection, addDoc, getDocs, query, where, Timestamp, deleteDoc, doc} from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { convertToRaw } from 'draft-js';


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
      const rawContent = JSON.stringify(convertToRaw(content.getCurrentContent())); // Não há alteração aqui, já que 'content' agora é EditorState
      // Adiciona a notícia ao Firestore
      await addDoc(collection(db, 'news'), {
        category: category.toLowerCase(),
        title,
        summary,
        content: rawContent,  // Agora armazenamos o JSON corretamente
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
      const newsArray = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setNews(newsArray);
    } catch (error) {
      console.error("Erro ao carregar notícias:", error);
    } finally {
      setLoading(false);
    }
  };

  // Função para filtrar notícias por categoria
  const filterNewsByCategory = async (categoria) => {
    setLoading(true);
    try {
      const decodedCategory = decodeURIComponent(categoria).toLowerCase();
      const newsRef = collection(db, 'news');
      const q = query(newsRef, where('category', '==', decodedCategory));
      const querySnapshot = await getDocs(q);
      
      const filteredNews = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setNews(filteredNews);
    } catch (error) {
      console.error("Erro ao filtrar notícias:", error);
    } finally {
      setLoading(false);
    }
  };


  const deleteNews = async (newsId, imageUrl) => {
    try {
      // Primeiro, deletar a imagem do Firebase Storage, se houver
      if (imageUrl) {
        const imageRef = ref(storage, imageUrl); // Referência da imagem
        await deleteObject(imageRef); // Deleta a imagem
        console.log("Imagem deletada com sucesso!");
      }
  
      // Agora, excluir o documento da notícia do Firestore
      const newsRef = doc(db, 'news', newsId);
      await deleteDoc(newsRef);
      console.log("Notícia deletada com sucesso!");
      
      // Atualizar o estado local de notícias após a exclusão
      setNews(prevNews => prevNews.filter(news => news.id !== newsId));
    } catch (error) {
      console.error("Erro ao excluir a notícia:", error);
    }
  };

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