import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import "./CSS/RenderMidBanner.css"; // Corrigi o nome do arquivo CSS para "RenderMidBanner.css"

const BannerMidCards = () => {
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const bannersCollection = collection(db, "banner-meio-cards");
        const bannersQuery = query(bannersCollection, orderBy("createdAt", "desc"), limit(1));
        const bannersSnapshot = await getDocs(bannersQuery);

        if (!bannersSnapshot.empty) {
          setBanner(bannersSnapshot.docs[0].data());
        } else {
          setBanner(null); // Nenhum banner encontrado
        }
      } catch (err) {
        console.error("Erro ao carregar o banner:", err);
        setError("Erro ao carregar o banner.");
      } finally {
        setLoading(false);
      }
    };

    fetchBanner();
  }, []);

  if (loading) {
    return <p>Carregando banner...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!banner) {
    return <p>Não há banner disponível.</p>;
  }

  return (
    <div className="banner-mid">
      <a href={banner.link || "#"} target="_blank" rel="noopener noreferrer">
        <img src={banner.imageUrl} alt="Banner Meio Cards" className="banner-mid-img" />
      </a>
    </div>
  );
};

export default BannerMidCards;
