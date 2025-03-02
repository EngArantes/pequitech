import React, { useState, useRef } from 'react';
import { db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import ReCAPTCHA from 'react-google-recaptcha'; // Importa o componente reCAPTCHA
import './CSS/Contato.css';

const Contato = () => {
  const [nome, setNome] = useState('');
  const [titulo, setTitulo] = useState('');
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [isVerified, setIsVerified] = useState(false); // Estado para verificar se o CAPTCHA foi passado
  const captchaRef = useRef(null); // Referência para o reCAPTCHA

  // Função para enviar a mensagem
  const enviarMensagem = async (e) => {
    e.preventDefault();

    // Verificando se os campos estão preenchidos e se o CAPTCHA foi verificado
    if (!nome || !titulo || !email || !mensagem) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    if (!isVerified) {
      alert("Por favor, confirme que você não é um robô.");
      return;
    }

    try {
      // Adicionando o documento à coleção "Mensagens-recebidas"
      const mensagensRef = collection(db, "Mensagens-recebidas");
      await addDoc(mensagensRef, {
        nome,
        titulo,
        email,
        mensagem,
        data: new Date(),
      });

      // Limpa os campos após o envio
      setNome('');
      setTitulo('');
      setEmail('');
      setMensagem('');
      setIsVerified(false); // Reseta o CAPTCHA
      if (captchaRef.current) {
        captchaRef.current.reset(); // Reseta o reCAPTCHA
      }
      alert("Mensagem enviada com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar a mensagem:", error);
      alert("Ocorreu um erro ao enviar a mensagem.");
    }
  };

  // Função para controlar o número de caracteres da mensagem
  const handleMensagemChange = (e) => {
    const novaMensagem = e.target.value;
    if (novaMensagem.length <= 500) {
      setMensagem(novaMensagem);
    }
  };

  // Função chamada quando o reCAPTCHA é verificado
  const onCaptchaChange = (value) => {
    setIsVerified(!!value); // Define como verdadeiro se o valor do CAPTCHA for válido
  };

  return (
    <div className="form-message">
      <h2>Entre em contato conosco</h2>

      <form onSubmit={enviarMensagem}>
        <div className="form-group">
          <label htmlFor="name">Nome:</label>
          <input
            type="text"
            id="name"
            value={nome}
            onChange={(e) => {
              if (e.target.value.length <= 20) {
                setNome(e.target.value);
              }
            }}
            maxLength={20} // Limita diretamente no input
            placeholder="Máximo de 20 caracteres"
          />
        </div>

        <div className="form-group">
          <label htmlFor="title">Título:</label>
          <input
            type="text"
            id="title"
            value={titulo}
            onChange={(e) => {
              if (e.target.value.length <= 100) {
                setTitulo(e.target.value);
              }
            }}
            maxLength={100} // Limita diretamente no input
            placeholder="Máximo de 100 caracteres"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="message">Mensagem:</label>
          <textarea
            id="message"
            value={mensagem}
            onChange={handleMensagemChange}
          />
          <div className="contador">
            <p>Máx: 500 caracteres</p>
            <p>{mensagem.length} / 500</p>
          </div>
        </div>

        {/* Adiciona o reCAPTCHA aqui com a Site Key */}
        <div className="captcha-container">
          <ReCAPTCHA
            ref={captchaRef}
            sitekey="6LcpV-cqAAAAAOd6Z3gmnZAemWPypo2Xy4nR-j7a" // Adicionada a Site Key
            onChange={onCaptchaChange}
          />
        </div>

        <button type="submit" disabled={!isVerified}>Enviar Mensagem</button>
      </form>
    </div>
  );
};

export default Contato;