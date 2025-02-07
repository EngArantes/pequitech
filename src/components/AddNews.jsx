import React, { useState } from "react";
import { db, storage } from "../firebaseConfig"; // Certifique-se de importar o Firebase Storage
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Timestamp } from "firebase/firestore"; // Importe o Timestamp do Firebase
import "./CSS/AddNews.css";

const AddNews = () => {
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [summary, setSummary] = useState(""); // Resumo
    const [content, setContent] = useState(""); // Descrição da notícia
    const [image, setImage] = useState(null); // Imagem
    const [imageCaption, setImageCaption] = useState(""); // Legenda da imagem
    const [videoLink, setVideoLink] = useState(""); // Link do vídeo
    const [source, setSource] = useState(""); // Fonte da notícia
    const [progress, setProgress] = useState(0); // Progresso do upload da imagem

    // Função para tratar o upload da imagem
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
        }
    };

    // Função para enviar a notícia
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Fazendo upload da imagem, se houver
            let imageUrl = "";
            if (image) {
                const storageRef = ref(storage, `news_images/${image.name}`);
                const uploadTask = uploadBytesResumable(storageRef, image);

                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        // Monitorando o progresso do upload
                        const prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        setProgress(prog);
                    },
                    (error) => {
                        console.error("Erro ao fazer upload da imagem: ", error);
                        alert("Erro ao fazer upload da imagem");
                    },
                    () => {
                        // Quando o upload for concluído, obtém a URL da imagem
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            imageUrl = downloadURL;
                            // Agora, adiciona a notícia no Firestore com os dados
                            addDoc(collection(db, "news"), {
                                category,
                                title,                                
                                summary,
                                content,
                                imageUrl,
                                imageCaption,
                                videoLink,
                                source,
                                createdAt: Timestamp.fromDate(new Date()), // Agora armazenando como Timestamp
                            })
                                .then(() => {
                                    setCategory("");
                                    setTitle("");                                    
                                    setSummary("");
                                    setContent("");
                                    setImage(null);
                                    setImageCaption("");
                                    setVideoLink("");
                                    setSource("");
                                    setProgress(0);
                                    alert("Notícia adicionada com sucesso!");
                                })
                                .catch((error) => {
                                    console.error("Erro ao adicionar notícia: ", error);
                                    alert("Erro ao adicionar notícia");
                                });
                        });
                    }
                );
            } else {
                // Se não houver imagem, apenas adiciona a notícia sem a imagem
                await addDoc(collection(db, "news"), {
                    category,
                    title,
                    summary,
                    content,
                    imageUrl: "",
                    imageCaption,
                    videoLink,
                    source,
                    createdAt: Timestamp.fromDate(new Date()), // Agora armazenando como Timestamp
                });
                setCategory("");
                setTitle("");
                setSummary("");
                setContent("");
                setImage(null);
                setImageCaption("");
                setVideoLink("");
                setSource("");
                alert("Notícia adicionada com sucesso!");
            }
        } catch (error) {
            console.error("Erro ao adicionar notícia: ", error);
        }
    };

    return (
        <div className="add-news-container">
            <h3>Adicionar Nova Notícia</h3>
            <form onSubmit={handleSubmit}>
                {/* Categoria da notícia */}
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                >
                    <option value="">Selecione a Categoria</option>
                    <option value="Tecnologia">Tecnologia</option>
                    <option value="Saúde">Saúde</option>
                    <option value="Esportes">Esportes</option>
                    <option value="Entretenimento">Entretenimento</option>
                    <option value="Nacional">Nacional</option>
                    <option value="Política">Política</option>
                    {/* Adicione mais opções conforme necessário */}
                </select>

                {/* Título da notícia */}
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Título da Notícia"
                    required
                />

                {/* Resumo da notícia */}
                <input
                    type="text"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="Resumo da Notícia"
                    required
                />

                {/* Upload de imagem */}
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                />
                {/* Legenda da imagem */}
                <input
                    type="text"
                    value={imageCaption}
                    onChange={(e) => setImageCaption(e.target.value)}
                    placeholder="Legenda da Imagem"
                />

                {/* Descrição completa da notícia */}
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Conteúdo da Notícia"
                    required
                />


                {/* Link do vídeo */}
                <input
                    type="url"
                    value={videoLink}
                    onChange={(e) => setVideoLink(e.target.value)}
                    placeholder="Link do Vídeo"
                />

                {/* Fonte da notícia */}
                <input
                    type="text"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    placeholder="Fonte"
                />

                {/* Progresso do upload da imagem */}
                {progress > 0 && <p>Progresso do upload: {Math.round(progress)}%</p>}

                <button type="submit">Adicionar</button>
            </form>
        </div>
    );
};

export default AddNews;
