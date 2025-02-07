import React, { useState } from 'react';
import { useNews } from '../context/NewsContext'; // Importando o contexto
import './CSS/AddNews.css';

const AddNews = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imageCaption, setImageCaption] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [source, setSource] = useState("");
  const [progress, setProgress] = useState(0);

  const { addNews } = useNews(); // Usando a função de adicionar notícia do contexto

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Envia os dados da notícia ao contexto
    await addNews({
      title,
      category,
      summary,
      content,
      image,
      imageCaption,
      videoLink,
      source,
    });

    // Limpar os campos após o envio
    setTitle('');
    setCategory('');
    setSummary('');
    setContent('');
    setImage(null);
    setImageCaption('');
    setVideoLink('');
    setSource('');
    alert("Notícia adicionada com sucesso!");
  };

  return (
    <div className="add-news-container">
      <h3>Adicionar Nova Notícia</h3>
      <form onSubmit={handleSubmit}>
        <select value={category} onChange={(e) => setCategory(e.target.value)} required>
          <option value="">Selecione a Categoria</option>
          <option value="Tecnologia">Tecnologia</option>
          <option value="Saúde">Saúde</option>
          <option value="Esportes">Esportes</option>
          <option value="Entretenimento">Entretenimento</option>
          <option value="Nacional">Nacional</option>
          <option value="Política">Política</option>
        </select>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título da Notícia"
          required
        />

        <input
          type="text"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Resumo da Notícia"
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        <input
          type="text"
          value={imageCaption}
          onChange={(e) => setImageCaption(e.target.value)}
          placeholder="Legenda da Imagem"
        />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Conteúdo da Notícia"
          required
        />

        <input
          type="url"
          value={videoLink}
          onChange={(e) => setVideoLink(e.target.value)}
          placeholder="Link do Vídeo"
        />

        <input
          type="text"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          placeholder="Fonte"
        />

        {progress > 0 && <p>Progresso do upload: {Math.round(progress)}%</p>}

        <button type="submit">Adicionar</button>
      </form>
    </div>
  );
};

export default AddNews;
