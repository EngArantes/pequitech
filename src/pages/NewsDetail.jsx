import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { convertFromRaw } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton } from 'react-share';
import { FacebookIcon, TwitterIcon, WhatsappIcon } from 'react-share';
import './CSS/NewsDetail.css';
import '../components/CSS/RenderRightBanner.css';
import PrincipalBanner from '../components/RenderPrincipalBanner';
import BannerDireita from '../components/RenderRightBanner';
import BannerEsquerda from '../components/RenderLeftBanner';

const NewsDetail = () => {
    const { id } = useParams();
    const [news, setNews] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const currentUrl = window.location.href;


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
                    content: formattedContent,
                    date: data.createdAt.toDate().toLocaleString(),
                    imageUrl: data.imageUrl || '',
                    videoUrl: data.videoLink || '',
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
    }, [id]);

    useEffect(() => {
        setError('');
        setNews(null);
        fetchNewsDetail();
    }, [id, fetchNewsDetail]);

    if (loading) {
        return <p>Carregando detalhes...</p>;
    }

    if (error) {
        return <p className="error-message-detail">{error}</p>;
    }

    const getYouTubeVideoId = (url) => {
        const match = url.match(/(?:youtube\.com\/(?:.*v=|.*\/)|youtu\.be\/)([^&?/]+)/);
        return match ? match[1] : '';
    };

    const shareUrl = window.location.href; // Obtém a URL atual da notícia

    return (
        <div className="news-detail">
            <div><PrincipalBanner /></div>
            <div className="news-grid-detail">
                <div className="coluna-esquerda-detail">
                    <div className="coluna-esquerda"><BannerEsquerda /></div>
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

                            <div
                                className="news-content-text-detail"
                                dangerouslySetInnerHTML={{ __html: news.content }}
                            />

                            {news.videoUrl && (
                                <div className="news-video-container">
                                    <iframe
                                        width="100%"
                                        src={`https://www.youtube.com/embed/${getYouTubeVideoId(news.videoUrl)}`}
                                        title="YouTube Video"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            )}

                            <p className="news-fonte-text-detail"><strong>Fonte:</strong> {news.fonte}</p>

                            {/* Botões de Compartilhamento */}
                            <div className="share-buttons">
                                <p>Compartilhe nas redes sociais:</p>
                                <FacebookShareButton url={currentUrl} quote={news.title}>
                                    <FacebookIcon size={32} round />
                                </FacebookShareButton>

                                <TwitterShareButton url={currentUrl} title={news.title}>
                                    <TwitterIcon size={32} round />
                                </TwitterShareButton>

                                <WhatsappShareButton url={currentUrl} title={news.title} separator=" - ">
                                    <WhatsappIcon size={32} round />
                                </WhatsappShareButton>
                            </div>

                        </div>
                    ) : (
                        <p>Nenhuma notícia encontrada.</p>
                    )}
                </div>

                <div className="coluna-direita-detail">
                    <div className="coluna-esquerda"><BannerDireita /></div>
                </div>
            </div>
        </div>
    );
};

export default NewsDetail;
