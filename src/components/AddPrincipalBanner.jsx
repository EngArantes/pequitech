import React, { useState } from "react";
import { db, storage } from "../firebaseConfig"; // Importe o Firestore e Storage do Firebase
import { collection, addDoc, getDocs, doc, deleteDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./CSS/AddPrincipalBanner.css"; // Estilos do componente

const AddPrincipalBanner = () => {
  const [image, setImage] = useState(null); // Estado para armazenar a imagem
  const [link, setLink] = useState(""); // Estado para armazenar o link
  const [loading, setLoading] = useState(false); // Estado para indicar carregamento
  const [error, setError] = useState(""); // Estado para mensagens de erro

  // Função para lidar com o upload da imagem
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  // Função para excluir o banner anterior
  const deletePreviousBanner = async () => {
    const bannersCollection = collection(db, "banners");
    const bannersSnapshot = await getDocs(bannersCollection);

    bannersSnapshot.forEach(async (bannerDoc) => {
      await deleteDoc(doc(db, "banners", bannerDoc.id)); // Exclui cada banner existente
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
      // Exclui o banner anterior
      await deletePreviousBanner();

      // Faz o upload da nova imagem para o Firebase Storage
      const storageRef = ref(storage, `banners/${image.name}`);
      await uploadBytes(storageRef, image);

      // Obtém a URL da nova imagem
      const imageUrl = await getDownloadURL(storageRef);

      // Salva os dados do novo banner no Firestore
      await addDoc(collection(db, "banners"), {
        imageUrl,
        link,
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
      <h2>Adicionar Banner Principal</h2>

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

export default AddPrincipalBanner;