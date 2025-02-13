import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";  // Correção aqui
import { useNews } from "../context/NewsContext";  // Certifique-se de que a função de exclusão está corretamente importada
import "./CSS/NewsCard.css";

const NewsCard = ({ id, title, summary, imageUrl, date }) => {
  const { currentUser } = useAuth();  // Correção aqui: use 'currentUser' em vez de 'user'
  const { deleteNews } = useNews();  // Certifique-se de que a função de exclusão está corretamente configurada

  const [showFullSummary, setShowFullSummary] = useState(false);
  const formattedDate = date;


  // Limitar o número de caracteres do resumo
  const maxSummaryLength = 50;
  const truncatedSummary = summary.length > maxSummaryLength ? summary.substring(0, maxSummaryLength) + '...' : summary;



  const handleDelete = () => {
    if (window.confirm("Tem certeza que deseja excluir esta notícia?")) {
      deleteNews(id, imageUrl);  // Exclui a notícia e a imagem associada
    }
  };

  return (
    <div className="card">
      <Link to={`/news/${id}`} className="card-link">
        <img src={imageUrl} alt={title} className="card-image" />
        <div className="card-body">
          <h2 className="card-title">{title}</h2>
          <p className="card-summary">
            {showFullSummary ? summary : truncatedSummary} <strong className="leiaMais">Leia mais...</strong>
          </p>
          <span className="card-date">
            <i className="fas fa-clock"></i>
            {formattedDate}
          </span>

          {/* Exibe o botão de deletar apenas se o usuário estiver logado */}
          {currentUser && (
            <button onClick={handleDelete} className="delete-button">
              Deletar
            </button>
          )}
        </div>
      </Link>
    </div>
  );
};

export default NewsCard;
