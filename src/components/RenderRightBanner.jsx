// src/components/BannerRight.jsx
import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig"; // Importando o Firestore
import { collection, getDocs } from "firebase/firestore";
import "./CSS/RenderRightBanner.css"; // Estilos do componente

const BannerRight = () => {
  const [banner, setBanner] = useState(null); // Estado para armazenar o banner
  const [loading, setLoading] = useState(true); // Estado de carregamento

  useEffect(() => {
    // Função para buscar o banner da direita do Firestore
    const fetchBanner = async () => {
      const bannersCollection = collection(db, "banners-laterais");
      const bannersSnapshot = await getDocs(bannersCollection);
      const bannersData = bannersSnapshot.docs.map((doc) => doc.data());

      // Filtra o banner específico da direita
      const rightBanner = bannersData.find((banner) => banner.side === "right");
      setBanner(rightBanner);
      setLoading(false);
    };

    fetchBanner();
  }, []); // A função é chamada apenas uma vez, ao montar o componente

  if (loading) {
    return <p>Carregando banner...</p>;
  }

  if (!banner) {
    return <p>Não há banner da direita disponível.</p>;
  }

  return (
    <div className="banner-right">
      <a href={banner.link || "#"} target="_blank" rel="noopener noreferrer">
        <img src={banner.imageUrl} alt="Banner Direito" className="banner-right img" />
      </a>
    </div>
  );
};

export default BannerRight;
