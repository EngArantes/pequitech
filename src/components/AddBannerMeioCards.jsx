import React, { useState } from "react";
import { db, storage } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from "../context/AuthContext"; // Importa o contexto de autenticação
import "./CSS/AddPrincipalBanner.css"; // Estilos

const AddBannerMeiocards = () => {
  const [image, setImage] = useState(null);
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { currentUser } = useAuth(); // Obtém usuário autenticado

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  // Função para salvar o banner do meio
  const saveBanner = async () => {
    if (!image) {
      setError("Por favor, selecione uma imagem.");
      return;
    }
    if (!currentUser) {
      setError("Você precisa estar autenticado para salvar um banner.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Faz o upload da imagem para o Firebase Storage
      const storageRef = ref(storage, `banners/${image.name}`);
      await uploadBytes(storageRef, image);

      // Obtém a URL da imagem
      const imageUrl = await getDownloadURL(storageRef);

      // Salva o novo banner no Firestore
      await addDoc(collection(db, "banner-meio-cards"), {
        imageUrl,
        link,
        side: "mid", // Define como banner do meio
        createdAt: new Date(),
        userId: currentUser.uid, // Associa o banner ao usuário que fez o upload
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
      <h2>Adicionar Banner Meio</h2>

      <div className="form-group">
        <label>Imagem do Banner:</label>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        {image && (
          <div className="image-preview">
            <img src={URL.createObjectURL(image)} alt="Preview do Banner" />
          </div>
        )}
      </div>

      <div className="form-group">
        <label>Link (opcional):</label>
        <input
          type="text"
          placeholder="Digite o link para redirecionamento"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
      </div>

      {error && <p className="error-message">{error}</p>}

      <button onClick={saveBanner} disabled={loading}>
        {loading ? "Salvando..." : "Salvar Banner"}
      </button>
    </div>
  );
};

export default AddBannerMeiocards;
