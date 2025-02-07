import React from "react";
import { Link } from "react-router-dom"; // Importar Link para navegação
import "./CSS/NewsCard.css";

const NewsCard = ({ id, title, summary, imageUrl, date }) => {
  const formattedDate = date ? new Date(date).toLocaleDateString() : "Data não disponível"; // Garantir que a data seja formatada corretamente

  return (
    <div className="card">
      <Link to={`/news/${id}`} className="card-link"> {/* Link para a página de detalhes */}
        <img src={imageUrl} alt={title} className="card-image" />
        <div className="card-body">
          <h2 className="card-title">{title}</h2>
          <p className="card-summary">{summary}</p> {/* Exibe o resumo no lugar da descrição */}
          <span className="card-date">{formattedDate}</span> {/* Exibe a data formatada */}
        </div>
      </Link>
    </div>
  );
};

export default NewsCard;