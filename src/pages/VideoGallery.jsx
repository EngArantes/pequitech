import React, { useState, useEffect } from "react";
import { collection, getDocs, updateDoc, doc, deleteDoc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useAuth } from "../context/AuthContext";
import './CSS/VideoGallery.css';
import Search from '../components/Search';

const VideoGallery = () => {
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]); // Para armazenar vídeos filtrados
  const [showModal, setShowModal] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState(null);
  const { currentUser } = useAuth(); // Usuário logado
  const [featuredCount, setFeaturedCount] = useState(0); // Contador de vídeos destacados

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const videosCollection = collection(db, "videos");
        const videoSnapshot = await getDocs(videosCollection);
        const videoList = videoSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const featuredVideos = videoList.filter((video) => video.featured === true);
        setFeaturedCount(featuredVideos.length); // Atualiza a quantidade de vídeos destacados
        setVideos(videoList);
        setFilteredVideos(videoList); // Inicializa com todos os vídeos
      } catch (error) {
        console.error("Erro ao buscar os vídeos:", error);
      }
    };

    fetchVideos();
  }, []);

  const handleSearch = (results) => {
    setFilteredVideos(results); // Atualiza os vídeos exibidos com base na pesquisa
  };

  const handleDelete = async () => {
    try {
      if (videoToDelete) {
        // Remove o vídeo da coleção "videos"
        const videoDoc = doc(db, "videos", videoToDelete);
        await deleteDoc(videoDoc);

        // Remove o vídeo da coleção "VideosDestaque" se existir
        const featuredDoc = doc(db, "VideosDestaque", videoToDelete);
        await deleteDoc(featuredDoc);

        // Atualiza o estado local
        setVideos(videos.filter((video) => video.id !== videoToDelete));
        setFilteredVideos(filteredVideos.filter((video) => video.id !== videoToDelete));

        setShowModal(false); // Fecha a modal após a exclusão
      }
    } catch (error) {
      console.error("Erro ao excluir o vídeo:", error);
    }
  };

  const handleCancel = () => {
    setShowModal(false); // Fecha a modal se o usuário cancelar
    setVideoToDelete(null); // Reseta o ID do vídeo a ser excluído
  };

  const openModal = (id) => {
    setVideoToDelete(id); // Define qual vídeo será excluído
    setShowModal(true); // Exibe a modal
  };

  

  return (
    <div className="video-gallery">
      <Search videos={videos} onSearch={handleSearch} />
      <h1>Galeria de Vídeos</h1>
      <div className="video-grid">
        {filteredVideos.map((video) => (
          <div key={video.id} className="video-card">
            <iframe
              src={video.link.replace("watch?v=", "embed/")}
              title={`Video ${video.id}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <p className="video-title">{video.title || "Sem título"}</p>{" "}
            {/* Exibe o título do vídeo */}
            {currentUser && (
              <>
                <div className="checkbox-container">
                  
                </div>
                <button
                  className="delete-buttons"
                  onClick={() => openModal(video.id)}
                >
                  Excluir
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Tem certeza que deseja excluir este vídeo?</h2>
            <div className="modal-actions">
              <button onClick={handleDelete}>Sim</button>
              <button onClick={handleCancel}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoGallery;
