import React, { createContext, useState, useContext } from 'react';
import { db, storage } from '../firebaseConfig'; 
import { collection, addDoc, Timestamp } from 'firebase/firestore'; 
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

export const NewsContext = createContext();

export const NewsProvider = ({ children }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

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

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            // Monitorando o progresso do upload
            const prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Progresso: ${prog}%`);
          },
          (error) => {
            console.error("Erro ao fazer upload da imagem: ", error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              imageUrl = downloadURL;
              // Adiciona a notícia ao Firestore
              addDoc(collection(db, 'news'), {
                category,
                title,
                summary,
                content,
                imageUrl,
                imageCaption,
                videoLink,
                source,
                createdAt: Timestamp.fromDate(new Date()), 
              }).then(() => {
                console.log("Notícia adicionada com sucesso!");
              });
            });
          }
        );
      } else {
        await addDoc(collection(db, 'news'), {
          category,
          title,
          summary,
          content,
          imageUrl: '',
          imageCaption,
          videoLink,
          source,
          createdAt: Timestamp.fromDate(new Date()),
        });
        console.log("Notícia adicionada sem imagem.");
      }
    } catch (error) {
      console.error("Erro ao adicionar notícia: ", error);
    }
  };

  return (
    <NewsContext.Provider value={{ news, loading, addNews }}>
      {children}
    </NewsContext.Provider>
  );
};

// Hook para acessar o contexto em outros componentes
export const useNews = () => useContext(NewsContext);
