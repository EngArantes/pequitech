// EditNews.js
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Editor, EditorState, RichUtils, Modifier, convertToRaw, convertFromRaw } from 'draft-js';
import 'draft-js/dist/Draft.css';
import { useNews } from '../context/NewsContext';
import './CSS/AddNews.css';

const EditNews = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { news, updateNews } = useNews();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [summary, setSummary] = useState('');
  const [image, setImage] = useState(null);
  const [imageCaption, setImageCaption] = useState('');
  const [videoLink, setVideoLink] = useState('');
  const [source, setSource] = useState('');
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [fontSize, setFontSize] = useState(16);
  const [imagePreview, setImagePreview] = useState(null);
  const [oldImageUrl, setOldImageUrl] = useState('');
  const isMounted = useRef(false);

  useEffect(() => {
    if (isMounted.current || !news.length) return;

    const newsItem = news.find(item => item.id === id);
    if (newsItem) {
      setTitle(newsItem.title || '');
      setCategory(newsItem.category || '');
      setSummary(newsItem.summary || '');
      setImageCaption(newsItem.imageCaption || '');
      setVideoLink(newsItem.videoLink || '');
      setSource(newsItem.source || '');
      setImagePreview(newsItem.imageUrl || null);
      setOldImageUrl(newsItem.imageUrl || '');

      try {
        const rawContent = JSON.parse(newsItem.content);
        const contentState = convertFromRaw(rawContent);
        setEditorState(EditorState.createWithContent(contentState));
      } catch (error) {
        console.error("Erro ao carregar o conteúdo do editor:", error);
        setEditorState(EditorState.createEmpty());
      }
      isMounted.current = true;
    }
  }, [id, news]);

  const onEditorChange = (state) => {
    setEditorState(state);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Dados enviados para updateNews:", {
      category,
      title,
      image: image || null,
      summary,
      content: JSON.stringify(convertToRaw(editorState.getCurrentContent())),
      imageCaption,
      videoLink,
      source,
      oldImageUrl,
      imageUrl: imagePreview,
    }); // Depuração

    try {
      await updateNews(id, {
        category,
        title,
        image: image || null, // Envia o arquivo bruto
        summary,
        content: JSON.stringify(convertToRaw(editorState.getCurrentContent())),
        imageCaption,
        videoLink,
        source,
        oldImageUrl,
        imageUrl: imagePreview, // Mantém a preview local, mas será substituída pelo upload
      });
      alert("Notícia atualizada com sucesso!");
      navigate('/');
    } catch (error) {
      console.error("Erro ao salvar alterações:", error);
      alert("Ocorreu um erro ao salvar as alterações. Verifique o console para mais detalhes.");
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

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
      <h3>Editar Notícia</h3>
      <form onSubmit={handleSubmit}>
        <select 
          value={category} 
          onChange={(e) => setCategory(e.target.value)} 
          required
        >
          <option value="">Selecione a Categoria</option>
          <option value="inteligencia-artificial">INTELIGÊNCIA ARTIFICIAL</option>
          <option value="veiculos-e-tecnologias">VEÍCULOS E TECNOLOGIAS</option>
          <option value="jogos">JOGOS</option>
          <option value="impressao-3d">IMPRESSÃO 3D</option>
          <option value="ciencia-e-espaco">CIÊNCIA E ESPAÇO</option>
          <option value="cinema">CINEMA</option>
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
        {imagePreview && <img src={imagePreview} alt="Preview" className="imagePreview" />}
        <input 
          type="text" 
          value={imageCaption} 
          onChange={(e) => setImageCaption(e.target.value)} 
          placeholder="Legenda da Imagem" 
        />

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
            placeholder="Conteúdo da Notícia"
            customStyleMap={styleMap}
            blockRendererFn={blockRendererFn}
            readOnly={false}
          />
        </div>

        <input 
          type="url" 
          value={videoLink} 
          onChange={(e) => setVideoLink(e.target.value)} 
          placeholder="Link do Vídeo (opcional)" 
        />
        <input 
          type="text" 
          value={source} 
          onChange={(e) => setSource(e.target.value)} 
          placeholder="Fonte" 
        />
        <button type="submit">Salvar Alterações</button>
        <button type="button" onClick={handleCancel} className="cancel-button">Cancelar</button>
      </form>
    </div>
  );
};

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

export default EditNews;