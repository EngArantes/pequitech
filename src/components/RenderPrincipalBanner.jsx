import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import "./CSS/RenderPrincipalBanner.css";

const RenderPrincipalBanner = () => {
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanner = async () => {
      setLoading(true);
      try {
        const bannersCollection = collection(db, "banners");
        const bannersSnapshot = await getDocs(bannersCollection);
        const bannersList = bannersSnapshot.docs.map((doc) => doc.data());

        if (bannersList.length > 0) {
          setBanner(bannersList[0]); // Obtém o primeiro banner (caso tenha mais de um)
        }
      } catch (error) {
        console.error("Erro ao buscar o banner:", error);
      }
      setLoading(false);
    };

    fetchBanner();
  }, []);

  if (loading) {
    return <div className="spinner"></div>; // Exibe um spinner enquanto carrega
  }

  if (!banner) {
    return <p>Nenhum banner disponível.</p>;
  }

  return (
    <div className="banner-container">
      {banner.link ? (
        <a href={banner.link} target="_blank" rel="noopener noreferrer">
          <img src={banner.imageUrl} alt="Banner Principal" className="banner-image" />
        </a>
      ) : (
        <img src={banner.imageUrl} alt="Banner Principal" className="banner-image" />
      )}
    </div>
  );
};

export default RenderPrincipalBanner;
