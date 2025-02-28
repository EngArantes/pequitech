// NewsCard.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNews } from "../context/NewsContext";
import "./CSS/NewsCard.css";

const NewsCard = ({ id, title, summary, imageUrl, date }) => {
  const { currentUser } = useAuth();
  const { deleteNews } = useNews();
  const navigate = useNavigate();
  const [showFullSummary, setShowFullSummary] = useState(false);

  const maxSummaryLength = 50;
  const truncatedSummary = summary.length > maxSummaryLength 
    ? summary.substring(0, maxSummaryLength) + '...' 
    : summary;

  const handleDelete = (e) => {
    e.preventDefault(); // Impede o comportamento padrão do botão
    e.stopPropagation(); // Impede a propagação do evento para o Link
    if (window.confirm("Tem certeza que deseja excluir esta notícia?")) {
      deleteNews(id, imageUrl);
    }
  };

  const handleEdit = (e) => {
    e.preventDefault(); // Impede o comportamento padrão do botão
    e.stopPropagation(); // Impede a propagação do evento para o Link
    navigate(`/edit-news/${id}`);
  };

  return (
    <div className="card">
      <Link to={`/news/${id}`} className="card-link">
        <img src={imageUrl} alt={title} className="card-image" />
        <div className="card-body">
          <h2 className="card-title">{title}</h2>
          <p className="card-summary">
            {showFullSummary ? summary : truncatedSummary} 
            <strong className="leiaMais">Veja mais.</strong>
          </p>
          <span className="card-date">
            <i className="fas fa-clock"></i>
            {date}
          </span>
        </div>
      </Link>
      {/* Movendo os botões para fora do Link */}
      {currentUser && (
        <div className="card-actions">
          <button onClick={handleDelete} className="delete-button">
            Deletar
          </button>
          <button onClick={handleEdit} className="edit-button">
            Editar
          </button>
        </div>
      )}
    </div>
  );
};

export default NewsCard;