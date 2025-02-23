import React, { useState } from "react";
import "./CSS/Search.css";

const Search = ({ videos, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    if (searchTerm.trim() === "") {
      onSearch(videos); // Mostra todos os vídeos se o campo estiver vazio
    } else {
      const filteredVideos = videos.filter((video) =>
        video.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      onSearch(filteredVideos);
    }
  };

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Busque por título..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      <button onClick={handleSearch} className="search-button">
        Buscar
      </button>
    </div>
  );
};

export default Search;
