import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Para acessar o parâmetro da URL
import { db } from '../firebaseConfig'; // Importe o Firestore
import { doc, getDoc } from 'firebase/firestore';
import './CSS/NewsDetail.css';
import PrincipalBanner from '../components/RenderPrincipalBanner';

const NewsDetail = () => {
    const { id } = useParams(); // Pega o ID da notícia na URL
    const [news, setNews] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Função para buscar a notícia detalhada
    const fetchNewsDetail = async () => {
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
                setNews({
                    categoria: data.category,
                    title: data.title,
                    description: data.summary,
                    legenda: data.imageCaption,
                    content: data.content,
                    date: data.createdAt.toDate().toLocaleString(), // Formata data e hora
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
    };

    useEffect(() => {
        setError(''); // Limpa o erro caso a URL seja alterada
        setNews(null); // Limpa os dados da notícia antes de uma nova requisição
        fetchNewsDetail();
    }, [id]); // Dependência para refazer a requisição quando o id mudar

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
                {/* Coluna esquerda (pode ficar vazia ou com conteúdo secundário) */}
                <div className="coluna-esquerda-detail">
                    <p>Coluna Esquerda (Conteúdo secundário)</p>
                </div>

                {/* Coluna central (onde ficará a notícia detalhada) */}
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
                            <p className="news-content-text-detail">{news.content}</p>
                            <p className="news-fonte-text-detail"><strong>Fonte:</strong> {news.fonte}</p>
                        </div>
                    ) : (
                        <p>Nenhuma notícia encontrada.</p>
                    )}
                </div>

                {/* Coluna direita (pode ficar vazia ou com conteúdo secundário) */}
                <div className="coluna-direita-detail">
                    <p>Coluna Direita (Conteúdo secundário)</p>
                </div>
            </div>
        </div>
    );
};

export default NewsDetail;
