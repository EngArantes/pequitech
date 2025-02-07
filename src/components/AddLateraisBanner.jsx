import React, { useState } from "react";
import { db, storage } from "../firebaseConfig"; // Importe o Firestore e Storage do Firebase
import { collection, addDoc, getDocs, doc, deleteDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./CSS/AddPrincipalBanner.css"; // Estilos do componente

const AddLateraisBanner = () => {
  const [image, setImage] = useState(null); // Estado para armazenar a imagem
  const [link, setLink] = useState(""); // Estado para armazenar o link
  const [loading, setLoading] = useState(false); // Estado para indicar carregamento
  const [error, setError] = useState(""); // Estado para mensagens de erro
  const [side, setSide] = useState("left"); // Estado para saber qual banner está sendo adicionado (esquerda ou direita)

  // Função para lidar com o upload da imagem
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  // Função para excluir o banner anterior da esquerda ou direita
  const deletePreviousBanner = async (side) => {
    const bannersCollection = collection(db, "banners-laterais");
    const bannersSnapshot = await getDocs(bannersCollection);

    bannersSnapshot.forEach(async (bannerDoc) => {
      const bannerData = bannerDoc.data();
      if (bannerData.side === side) {
        await deleteDoc(doc(db, "banners-laterais", bannerDoc.id)); // Exclui o banner específico
      }
    });
  };

  // Função para salvar o banner
  const saveBanner = async () => {
    if (!image) {
      setError("Por favor, selecione uma imagem.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Exclui o banner anterior (da esquerda ou direita)
      await deletePreviousBanner(side);

      // Faz o upload da nova imagem para o Firebase Storage
      const storageRef = ref(storage, `banners/${image.name}`);
      await uploadBytes(storageRef, image);

      // Obtém a URL da nova imagem
      const imageUrl = await getDownloadURL(storageRef);

      // Salva os dados do novo banner no Firestore
      await addDoc(collection(db, "banners-laterais"), {
        imageUrl,
        link,
        side, // Define se o banner é da esquerda ou direita
        createdAt: new Date(),
      });

      alert("Banner salvo com sucesso!");
      setImage(null);
      setLink("");
    } catch (err) {
      console.error("Erro ao salvar o banner:", err);
      setError("Erro ao salvar o banner. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-banner-container">
      <h2>Adicionar Banner Laterais</h2>

      {/* Seleção de Lado do Banner */}
      <div className="form-group">
        <label>Selecione o lado do banner:</label>
        <select onChange={(e) => setSide(e.target.value)} value={side}>
          <option value="left">Esquerda</option>
          <option value="right">Direita</option>
        </select>
      </div>

      {/* Campo para upload da imagem */}
      <div className="form-group">
        <label htmlFor="banner-image">Imagem do Banner:</label>
        <input
          type="file"
          id="banner-image"
          accept="image/*"
          onChange={handleImageUpload}
        />
        {image && (
          <div className="image-preview">
            <img src={URL.createObjectURL(image)} alt="Preview do Banner" />
          </div>
        )}
      </div>

      {/* Campo para o link */}
      <div className="form-group">
        <label htmlFor="banner-link">Link (opcional):</label>
        <input
          type="text"
          id="banner-link"
          placeholder="Digite o link para redirecionamento"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
      </div>

      {/* Mensagem de erro */}
      {error && <p className="error-message">{error}</p>}

      {/* Botão para salvar */}
      <button onClick={saveBanner} disabled={loading}>
        {loading ? "Salvando..." : "Salvar Banner"}
      </button>
    </div>
  );
};

export default AddLateraisBanner;
