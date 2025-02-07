import React, { useState } from "react";
import "./CSS/Settings.css";

const Settings = () => {
  const [siteTitle, setSiteTitle] = useState("Meu Site de Notícias");

  const handleTitleChange = (e) => {
    setSiteTitle(e.target.value);
  };

  return (
    <div className="settings-container">
      <h3>Configurações do Site</h3>
      <label>Alterar Título do Site:</label>
      <input
        type="text"
        value={siteTitle}
        onChange={handleTitleChange}
      />
      <button>Salvar</button>
    </div>
  );
};

export default Settings;
