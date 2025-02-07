import React, { useState } from "react";
import { Link } from "react-router-dom"; // Importar Link para navegação
import "./CSS/NewsCard.css";

const NewsCard = ({ id, title, summary, imageUrl, date }) => {
  console.log('ID da notícia no card:', id);  // Verifique o valor de 'id'

  const [showFullSummary, setShowFullSummary] = useState(false); // Controle de visibilidade do resumo completo

  const formattedDate = date ? new Date(date).toLocaleDateString() : "Data não disponível";

  // Limitar o número de caracteres do resumo
  const maxSummaryLength = 50;
  const truncatedSummary = summary.length > maxSummaryLength ? summary.substring(0, maxSummaryLength) + '...' : summary;

  const handleToggleSummary = () => {
    setShowFullSummary(!showFullSummary);
  };

  return (
    <div className="card">
      <Link to={`/news/${id}`} className="card-link">
        <img src={imageUrl} alt={title} className="card-image" />
        <div className="card-body">
          <h2 className="card-title">{title}</h2>
          <p className="card-summary">
            {showFullSummary ? summary : truncatedSummary}
          </p>
          <button onClick={handleToggleSummary} className="show-more-button">
            {showFullSummary ? "Ver Menos" : "Veja Mais"}
          </button>
          <span className="card-date">{formattedDate}</span>
        </div>
      </Link>
    </div>
  );
};

export default NewsCard;
