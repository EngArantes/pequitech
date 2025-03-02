import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import './CSS/ListagemDeMensagens.css'

const ListagemDeMensagens = () => {
  const [mensagens, setMensagens] = useState([]);
  const [mensagemAberta, setMensagemAberta] = useState(null);

  // Função para buscar mensagens do banco de dados
  useEffect(() => {
    const buscarMensagens = async () => {
      try {
        const colecaoRef = collection(db, "Mensagens-recebidas");
        const snapshot = await getDocs(colecaoRef);
        const mensagensList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMensagens(mensagensList);
      } catch (error) {
        console.error("Erro ao buscar mensagens:", error);
      }
    };
    buscarMensagens();
  }, []);

  // Função para excluir mensagem

  const confirmarExclusao = (mensagemId) => {
    const confirmacao = window.confirm("Tem certeza que deseja excluir esta mensagem?");
    if (confirmacao) {
      excluirMensagem(mensagemId); // Chama sua função de exclusão se o usuário confirmar
    }
  };
  
  const excluirMensagem = async (id) => {
    try {
      await deleteDoc(doc(db, "Mensagens-recebidas", id));
      setMensagens(mensagens.filter((mensagem) => mensagem.id !== id));
    } catch (error) {
      console.error("Erro ao excluir mensagem:", error);
    }
  };

  // Função para abrir a mensagem no modal
  const abrirMensagem = (mensagem) => {
    setMensagemAberta(mensagem);
  };

  // Função para fechar o modal
  const fecharModal = () => {
    setMensagemAberta(null);
  };

  return (
    <div className="lista-mensagens">
      <div className="containerMensagens">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Título</th>
              <th>Abrir</th>
              <th>Deletar</th>
            </tr>
          </thead>
          <tbody>
            {mensagens.slice(0, 6).map((mensagem) => (
              <tr key={mensagem.id}>
                <td>{mensagem.nome}</td>
                <td>{mensagem.titulo}</td>
                <td>
                  <button onClick={() => abrirMensagem(mensagem)}>Abrir</button>                
                </td>
                <td>
                  <button onClick={() => confirmarExclusao(mensagem.id)}>Deletar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {mensagens.length > 6 && (
        <div className="scroll-message">
          <p>Existem mais mensagens. Role para ver todas.</p>
        </div>
      )}

      {mensagemAberta && (
        <div className="modal">
          <div className="modal-content">
            <h3>{mensagemAberta.titulo}</h3>
            <p><strong>Nome:</strong> {mensagemAberta.nome}</p>
            <p><strong>Mensagem:</strong> {mensagemAberta.mensagem}</p>
            <button onClick={fecharModal}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListagemDeMensagens;
