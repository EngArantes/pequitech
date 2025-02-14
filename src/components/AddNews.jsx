import React, { useState } from 'react';
import { Editor, EditorState, RichUtils, Modifier } from 'draft-js';
import 'draft-js/dist/Draft.css';
import { useNews } from '../context/NewsContext';
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
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [fontSize, setFontSize] = useState(16);
  const { addNews } = useNews();
  const [imagePreview, setImagePreview] = useState(null);

  const onEditorChange = (state) => {
    setEditorState(state);
    setContent(state.getCurrentContent().getPlainText());

    // Detectar o tamanho da fonte no texto selecionado
    const currentStyle = state.getCurrentInlineStyle();

    const fontSizeMatch = [...currentStyle].find(style => style.startsWith('FONT_SIZE_'));
    if (fontSizeMatch) {
      setFontSize(Number(fontSizeMatch.replace('FONT_SIZE_', '')));
    } else {
      setFontSize(16); // Padrão se nenhum tamanho for encontrado
    }
  };

  const handleFormatChange = (style) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, style));
  };

  const toggleHighlight = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, 'HIGHLIGHT'));
  };

  const changeFontSize = (size) => {
    const selection = editorState.getSelection();
    const contentState = editorState.getCurrentContent();

    // Remove qualquer outro tamanho de fonte aplicado
    let newContentState = contentState;
    [12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32].forEach(s => {
      newContentState = Modifier.removeInlineStyle(newContentState, selection, `FONT_SIZE_${s}`);
    });

    // Aplica o novo tamanho de fonte
    newContentState = Modifier.applyInlineStyle(newContentState, selection, `FONT_SIZE_${size}`);

    const newEditorState = EditorState.push(editorState, newContentState, 'change-inline-style');
    setEditorState(newEditorState);
    setFontSize(size);
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await addNews({
      category,
      title,   
      image,   
      summary,
      content: editorState,  // Passando diretamente o EditorState aqui
      imageCaption,
      videoLink,
      source,
    });
    

    setTitle('');
    setCategory('');
    setSummary('');
    setContent('');
    setImage(null);
    setImageCaption('');
    setVideoLink('');
    setSource('');
    setEditorState(EditorState.createEmpty());
    alert("Notícia adicionada com sucesso!");
  };

  return (
    <div className="add-news-container">
      <h3>Adicionar Nova Notícia</h3>
      <form onSubmit={handleSubmit}>
        <select value={category} onChange={(e) => setCategory(e.target.value)} required>
          <option value="">Selecione a Categoria</option>
          <option value="inteligencia-artificial">INTELIGÊNCIA ARTIFICIAL</option>
          <option value="veiculos-e-tecnologias">VEÍCULOS E TECNOLOGIAS</option>
          <option value="jogos">JOGOS</option>
          <option value="ciencia-e-espaco">CIÊNCIA E ESPAÇO</option>
          <option value="cinema">CINEMA</option>
          <option value="internet">INTERNET</option>
          <option value="redes-sociais">REDES SOCIAIS</option>
          <option value="produtos-e-reviews">PRODUTOS E REVIEWS</option>
          <option value="saude">SAÚDE</option>
          <option value="educacao-e-cursos">EDUCAÇÃO E CURSOS</option>
          <option value="sustentabilidade">SUSTENTABILIDADE</option>
          <option value="seguranca-digital">SEGURANÇA DIGITAL</option>
          <option value="negocios-e-financas">NEGÓCIOS E FINANÇAS</option>
          <option value="natureza">NATUREZA</option>
          <option value="blockchain-e-criptomoedas">BLOCKCHAIN E CRIPTOMOEDAS</option>
        </select>

        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título da Notícia" required />

        <input type="text" value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Resumo da Notícia" required />

        <input type="file" accept="image/*" onChange={handleImageChange} />
        {imagePreview && <img src={imagePreview} alt="Preview" className='imagePreview' />}

        <input type="text" value={imageCaption} onChange={(e) => setImageCaption(e.target.value)} placeholder="Legenda da Imagem" />

        <div className="toolbar">
          <button type="button" onClick={() => handleFormatChange('BOLD')}>B</button>
          <button type="button" onClick={() => handleFormatChange('ITALIC')}>I</button>
          <button type="button" onClick={() => handleFormatChange('UNDERLINE')}>U</button>
          <button type="button" onClick={toggleHighlight}>Destacar</button>

          <select
            onChange={(e) => changeFontSize(Number(e.target.value))}
            value={fontSize}
          >
            {[12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32].map(size => (
              <option key={size} value={size}>
                {size}px
              </option>
            ))}
          </select>
        </div>

        <div className="editor-container">
          <Editor
            editorState={editorState}
            onChange={onEditorChange}
            placeholder="Conteúdo da Notícia"
            customStyleMap={styleMap}
          />
        </div>

        <input type="url" value={videoLink} onChange={(e) => setVideoLink(e.target.value)} placeholder="Link do Vídeo" />

        <input type="text" value={source} onChange={(e) => setSource(e.target.value)} placeholder="Fonte" />

        <button type="submit">Adicionar</button>
      </form>
    </div>
  );
};

// 🔹 Define os estilos personalizados
const styleMap = {
  HIGHLIGHT: {
    backgroundColor: '#ccc',
    color: 'black',
    padding: '5px',
  },
};

[12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32].forEach(size => {
  styleMap[`FONT_SIZE_${size}`] = { fontSize: `${size}px` };
});

export default AddNews;
