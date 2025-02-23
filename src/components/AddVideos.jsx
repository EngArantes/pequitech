import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import './CSS/AddVideos.css';

const VideoForm = () => {
  const [videoLink, setVideoLink] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!videoLink.trim() || !videoTitle.trim()) {
      setMessage("Por favor, preencha todos os campos.");
      return;
    }

    try {
      const videosCollection = collection(db, "videos");
      await addDoc(videosCollection, {
        link: videoLink,
        title: videoTitle,
      });

      setMessage("Vídeo adicionado com sucesso!");
      setVideoLink("");
      setVideoTitle("");
    } catch (error) {
      console.error("Erro ao salvar o vídeo:", error);
      setMessage("Erro ao salvar o vídeo. Tente novamente.");
    }
  };

  return (
    <div className="video-form">
      <h1>Adicionar Vídeo</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Digite o título do vídeo"
          value={videoTitle}
          onChange={(e) => setVideoTitle(e.target.value)}
          required
        />
        <input
          type="url"
          placeholder="Cole o link do vídeo aqui"
          value={videoLink}
          onChange={(e) => setVideoLink(e.target.value)}
          required
        />
        <button type="submit">Enviar</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default VideoForm;
