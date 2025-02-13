// src/components/BannerLeft.jsx
import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig"; // Importando o Firestore
import { collection, getDocs } from "firebase/firestore";
import "./CSS/RenderRightBanner.css"; // Estilos do componente

const BannerLeft = () => {
  const [banner, setBanner] = useState(null); // Estado para armazenar o banner
  const [loading, setLoading] = useState(true); // Estado de carregamento

  useEffect(() => {
    // Função para buscar o banner da esquerda do Firestore
    const fetchBanner = async () => {
      const bannersCollection = collection(db, "banners-laterais");
      const bannersSnapshot = await getDocs(bannersCollection);
      const bannersData = bannersSnapshot.docs.map((doc) => doc.data());

      // Filtra o banner específico da esquerda
      const leftBanner = bannersData.find((banner) => banner.side === "left");
      setBanner(leftBanner);
      setLoading(false);
    };

    fetchBanner();
  }, []); // A função é chamada apenas uma vez, ao montar o componente

  if (loading) {
    return <p>Carregando banner...</p>;
  }

  if (!banner) {
    return <p>Não há banner da esquerda disponível.</p>;
  }

  return (
    <div className="banner-left">
      <a href={banner.link || "#"} target="_blank" rel="noopener noreferrer">
        <img src={banner.imageUrl} alt="Banner Esquerdo" className="banner-left-img" />
      </a>
    </div>
  );
};

export default BannerLeft;
