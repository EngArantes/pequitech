import React, { useState } from 'react';
import { Editor, EditorState, RichUtils, Modifier, convertToRaw, AtomicBlockUtils } from 'draft-js';
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
  const [videoLink, setVideoLink] = useState(""); // Mantido para vídeo ao final
  const [source, setSource] = useState("");
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [fontSize, setFontSize] = useState(16);
  const { addNews } = useNews();
  const [imagePreview, setImagePreview] = useState(null);

  const onEditorChange = (state) => {
    setEditorState(state);
    setContent(state.getCurrentContent().getPlainText());

    const currentStyle = state.getCurrentInlineStyle();
    const fontSizeMatch = [...currentStyle].find(style => style.startsWith('FONT_SIZE_'));
    setFontSize(fontSizeMatch ? Number(fontSizeMatch.replace('FONT_SIZE_', '')) : 16);
  };

  const handleFormatChange = (style) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, style));
  };

  const toggleHighlight = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, 'HIGHLIGHT'));
  };

  const changeFontSize = (size) => {
    const selection = editorState.getSelection();
    let contentState = editorState.getCurrentContent();

    [12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32].forEach(s => {
      contentState = Modifier.removeInlineStyle(contentState, selection, `FONT_SIZE_${s}`);
    });

    contentState = Modifier.applyInlineStyle(contentState, selection, `FONT_SIZE_${size}`);
    const newEditorState = EditorState.push(editorState, contentState, 'change-inline-style');
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

  // Função para adicionar vídeo como bloco atômico no editor
  const addVideoToEditor = (url) => {
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity('VIDEO', 'IMMUTABLE', { src: url });
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, ' ');
    setEditorState(newEditorState);
  };

  // Detectar URL de vídeo ao pressionar Enter ou espaço
  const handleKeyCommand = (command, editorState) => {
    if (command === 'split-block') {
      const selection = editorState.getSelection();
      const contentState = editorState.getCurrentContent();
      const block = contentState.getBlockForKey(selection.getStartKey());
      const text = block.getText();
      const urlRegex = /(https?:\/\/(?:www\.)?(youtube\.com|youtu\.be)\/[^\s]+)/;
      const match = text.match(urlRegex);

      if (match) {
        const url = match[0];
        addVideoToEditor(url);
        return 'handled';
      }
    }
    return 'not-handled';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await addNews({
      category,
      title,
      image,
      summary,
      content: JSON.stringify(convertToRaw(editorState.getCurrentContent())), // Inclui entidades de vídeo
      imageCaption,
      videoLink, // Mantido como string para vídeo ao final
      source,
    });

    // Resetar formulário
    setTitle('');
    setCategory('');
    setSummary('');
    setContent('');
    setImage(null);
    setImageCaption('');
    setVideoLink('');
    setSource('');
    setEditorState(EditorState.createEmpty());
    setImagePreview(null);
    alert("Notícia adicionada com sucesso!");
  };

  // Renderizar blocos atômicos (vídeos) no editor
  const blockRendererFn = (contentBlock) => {
    if (contentBlock.getType() === 'atomic') {
      const contentState = editorState.getCurrentContent();
      const entityKey = contentBlock.getEntityAt(0);
      if (entityKey) {
        const entity = contentState.getEntity(entityKey);
        if (entity.getType() === 'VIDEO') {
          const { src } = entity.getData();
          return {
            component: VideoComponent,
            editable: false,
            props: { src },
          };
        }
      }
    }
    return null;
  };

  return (
    <div className="add-news-container">
      <h3>Adicionar Nova Notícia</h3>
      <form onSubmit={handleSubmit}>
        <select value={category} onChange={(e) => setCategory(e.target.value)} required>
          <option value="">Selecione a Categoria</option>
          <option value="inteligencia-artificial">INTELIGÊNCIA ARTIFICIAL</option>
          <option value="veiculos-e-tecnologias">VEÍCULOS E TECNOLOGIAS</option>
          <option value="games">GAMES</option>
          <option value="impressao-3d">IMPRESSÃO 3D</option>
          <option value="ciencia-e-espaco">CIÊNCIA E ESPAÇO</option>
          <option value="cinema-e-streaming">CINEMA E STREAMING</option>
          <option value="internet">INTERNET</option>
          <option value="redes-sociais">REDES SOCIAIS</option>
          <option value="produtos-e-reviews">PRODUTOS E REVIEWS</option>
          <option value="saude">SAÚDE</option>
          <option value="agronegocios">AGRONEGÓCIOS</option>
          <option value="educacao-e-cursos">EDUCAÇÃO E CURSOS</option>
          <option value="seguranca-digital">SEGURANÇA DIGITAL</option>
          <option value="so-e-softwares">SISTEMAS E SOFTWARES</option>
          <option value="natureza">NATUREZA</option>
          <option value="blockchain-e-criptomoedas">BLOCKCHAIN E CRIPTOMOEDAS</option>
          <option value="fatos">FATOS</option>
        </select>

        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título da Notícia" required />
        <input type="text" value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Resumo da Notícia" required />
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {imagePreview && <img src={imagePreview} alt="Preview" className="imagePreview" />}
        <input type="text" value={imageCaption} onChange={(e) => setImageCaption(e.target.value)} placeholder="Legenda da Imagem" />

        <div className="toolbar">
          <div className="toolbarAIU">
            <button type="button" onClick={() => handleFormatChange('BOLD')}>B</button>
            <button type="button" onClick={() => handleFormatChange('ITALIC')}>I</button>
            <button type="button" onClick={() => handleFormatChange('UNDERLINE')}>U</button>
          </div>
          <button className="buttonDestacar" type="button" onClick={toggleHighlight}>Destacar</button>
          <select onChange={(e) => changeFontSize(Number(e.target.value))} value={fontSize}>
            {[12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32].map(size => (
              <option key={size} value={size}>{size}px</option>
            ))}
          </select>
        </div>

        <div className="editor-container">
          <Editor
            editorState={editorState}
            onChange={onEditorChange}
            handleKeyCommand={handleKeyCommand}
            placeholder="Conteúdo da Notícia (digite um link de vídeo e pressione Enter para incorporá-lo)"
            customStyleMap={styleMap}
            blockRendererFn={blockRendererFn}
          />
        </div>

        <input type="url" value={videoLink} onChange={(e) => setVideoLink(e.target.value)} placeholder="Link do Vídeo (opcional, aparece ao final)" />
        <input type="text" value={source} onChange={(e) => setSource(e.target.value)} placeholder="Fonte" />
        <button type="submit">Adicionar</button>
      </form>
    </div>
  );
};

// Componente para renderizar vídeos no editor
const VideoComponent = ({ blockProps }) => {
  const { src } = blockProps;
  const videoId = src.match(/(?:youtube\.com\/(?:.*v=|.*\/)|youtu\.be\/)([^&?/]+)/)?.[1];
  if (!videoId) return <p>URL de vídeo inválida</p>;

  return (
    <iframe
      width="100%"
      height="315"
      src={`https://www.youtube.com/embed/${videoId}`}
      title="YouTube Video"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  );
};

const styleMap = {
  HIGHLIGHT: { backgroundColor: '#ccc', color: 'black', padding: '5px' },
};

[12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32].forEach(size => {
  styleMap[`FONT_SIZE_${size}`] = { fontSize: `${size}px` };
});

export default AddNews;