import React, { useState, useEffect } from 'react';
import { db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import './CSS/Contato.css';

const Contato = () => {
  const [nome, setNome] = useState('');
  const [titulo, setTitulo] = useState('');
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [captchaToken, setCaptchaToken] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Carregar o script do reCAPTCHA v3
  useEffect(() => {
    const loadScript = () => {
      if (!document.querySelector('script[src*="recaptcha"]')) {
        const script = document.createElement('script');
        script.src = 'https://www.google.com/recaptcha/api.js?render=6LcpV-cqAAAAAOicZJtBYRm6g-XtS0CtthP6QjSf';
        script.async = true;
        script.onload = () => console.log("reCAPTCHA script carregado com sucesso");
        script.onerror = () => console.error("Erro ao carregar o script do reCAPTCHA");
        document.body.appendChild(script);
      }
    };
    loadScript();
  }, []);

  // Função para gerar o token do reCAPTCHA v3
  const gerarTokenRecaptchaV3 = () => {
    return new Promise((resolve, reject) => {
      if (!window.grecaptcha) {
        console.error("reCAPTCHA não está disponível. Script não carregado?");
        reject(new Error("reCAPTCHA não carregado."));
        return;
      }

      console.log("Tentando gerar token do reCAPTCHA...");
      window.grecaptcha.ready(() => {
        window.grecaptcha
          .execute('6LcpV-cqAAAAAOicZJtBYRm6g-XtS0CtthP6QjSf', { action: 'submit' })
          .then((token) => {
            console.log("Token gerado com sucesso:", token);
            setCaptchaToken(token);
            resolve(token);
          })
          .catch((error) => {
            console.error("Erro ao gerar token do reCAPTCHA:", error);
            reject(error);
          });
      });
    });
  };

  const enviarMensagem = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validação dos campos
    if (!nome || !titulo || !email || !mensagem) {
      setError("Por favor, preencha todos os campos.");
      setIsLoading(false);
      return;
    }
    if (!isValidEmail(email)) {
      setError("Por favor, insira um email válido.");
      setIsLoading(false);
      return;
    }

    try {
      // Gerar o token do reCAPTCHA v3
      console.log("Iniciando geração do token...");
      const token = await gerarTokenRecaptchaV3();
      if (!token) {
        setError("Falha ao verificar o reCAPTCHA.");
        setIsLoading(false);
        return;
      }

      console.log("Enviando mensagem ao Firestore...");
      // Salvar no Firestore
      const mensagensRef = collection(db, "Mensagens-recebidas");
      await addDoc(mensagensRef, {
        nome,
        titulo,
        email,
        mensagem,
        captchaToken: token,
        data: new Date(),
      });

      // Resetar o formulário
      setNome('');
      setTitulo('');
      setEmail('');
      setMensagem('');
      setCaptchaToken(null);
      alert("Mensagem enviada com sucesso!");
    } catch (error) {
      console.error("Erro detalhado ao enviar a mensagem:", error.message || error);
      setError(`Ocorreu um erro ao enviar a mensagem: ${error.message || 'Erro desconhecido'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMensagemChange = (e) => {
    const novaMensagem = e.target.value;
    if (novaMensagem.length <= 500) setMensagem(novaMensagem);
  };

  return (
    <div className="form-message">
      <h2>Entre em contato conosco</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={enviarMensagem}>
        <div className="form-group">
          <label htmlFor="name">Nome:</label>
          <input
            type="text"
            id="name"
            value={nome}
            onChange={(e) => e.target.value.length <= 20 && setNome(e.target.value)}
            maxLength={20}
            placeholder="Máximo de 20 caracteres"
          />
        </div>
        <div className="form-group">
          <label htmlFor="title">Título:</label>
          <input
            type="text"
            id="title"
            value={titulo}
            onChange={(e) => e.target.value.length <= 100 && setTitulo(e.target.value)}
            maxLength={100}
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
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Enviando..." : "Enviar Mensagem"}
        </button>
      </form>
    </div>
  );
};

export default Contato;