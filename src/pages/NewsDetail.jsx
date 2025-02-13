import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { convertFromRaw } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import './CSS/NewsDetail.css';
import PrincipalBanner from '../components/RenderPrincipalBanner';

const NewsDetail = () => {
    const { id } = useParams();
    const [news, setNews] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchNewsDetail = useCallback(async () => {
        if (!id) {
            setError('ID da notícia não encontrado');
            setLoading(false);
            return;
        }
    
        try {
            const newsDoc = doc(db, 'news', id);
            const newsSnapshot = await getDoc(newsDoc);
    
            if (newsSnapshot.exists()) {
                const data = newsSnapshot.data();
    
                // Converter o conteúdo do Draft.js para HTML
                let formattedContent = "";
                if (data.content) {
                    try {
                        const contentState = convertFromRaw(JSON.parse(data.content));
                        formattedContent = stateToHTML(contentState);
                    } catch (error) {
                        console.error("Erro ao converter conteúdo do Draft.js:", error);
                        formattedContent = "<p>Erro ao carregar o conteúdo formatado.</p>";
                    }
                }
    
                setNews({
                    categoria: data.category,
                    title: data.title,
                    description: data.summary,
                    legenda: data.imageCaption,
                    content: formattedContent, // Conteúdo formatado
                    date: data.createdAt.toDate().toLocaleString(),
                    imageUrl: data.imageUrl || '',
                    fonte: data.source,
                });
            } else {
                setError("Notícia não encontrada.");
            }
        } catch (err) {
            console.error('Erro ao buscar a notícia:', err);
            setError("Erro ao carregar a notícia. Tente novamente.");
        } finally {
            setLoading(false);
        }
    }, [id]);  // A função agora depende apenas de "id"
    
    useEffect(() => {
        setError('');
        setNews(null);
        fetchNewsDetail();
    }, [id, fetchNewsDetail]);  // Agora, sem problemas de dependências
    

    if (loading) {
        return <p>Carregando detalhes...</p>;
    }

    if (error) {
        return <p className="error-message-detail">{error}</p>;
    }

    return (
        <div className="news-detail">
            <div><PrincipalBanner /></div>
            <div className="news-grid-detail">
                <div className="coluna-esquerda-detail">
                    <p>Coluna Esquerda (Conteúdo secundário)</p>
                </div>

                <div className="coluna-central-detail">
                    {news ? (
                        <div className="news-content-detail">
                            <p className='news-category-detail'>{news.categoria}</p>
                            <h1>{news.title}</h1>
                            <p className="news-description-detail">{news.description}</p>
                            <p className="news-date-detail">
                                <i className="fas fa-clock"></i> {news.date}
                            </p>
                            {news.imageUrl && <img src={news.imageUrl} alt={news.title} />}
                            <p className="news-legenda-detail">{news.legenda}</p>                            

                            {/* Renderiza o conteúdo formatado corretamente */}
                            <div 
                                className="news-content-text-detail" 
                                dangerouslySetInnerHTML={{ __html: news.content }}
                            />

                            <p className="news-fonte-text-detail"><strong>Fonte:</strong> {news.fonte}</p>
                        </div>
                    ) : (
                        <p>Nenhuma notícia encontrada.</p>
                    )}
                </div>

                <div className="coluna-direita-detail">
                    <p>Coluna Direita (Conteúdo secundário)</p>
                </div>
            </div>
        </div>
    );
};

export default NewsDetail;
