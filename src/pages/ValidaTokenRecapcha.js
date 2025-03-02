const functions = require('firebase-functions');
const axios = require('axios');
const admin = require('firebase-admin');

admin.initializeApp();

exports.enviarMensagem = functions.https.onRequest(async (req, res) => {
  const { nome, titulo, email, mensagem, captchaToken } = req.body;

  // Validar o token do reCAPTCHA v3
  try {
    const response = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      null,
      {
        params: {
          secret: '6LcpV-cqAAAAAOd6Z3gmnZAemWPypo2Xy4nR-j7a', // Sua chave secreta
          response: captchaToken,
        },
      }
    );

    const { success, score } = response.data;

    if (!success || score < 0.5) { // Ajuste o limite de score conforme necessário (0.0 a 1.0)
      return res.status(400).send("Falha na verificação do reCAPTCHA.");
    }

    // Salvar no Firestore
    const db = admin.firestore();
    await db.collection('Mensagens-recebidas').add({
      nome,
      titulo,
      email,
      mensagem,
      captchaToken,
      data: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).send("Mensagem enviada com sucesso!");
  } catch (error) {
    console.error("Erro:", error);
    res.status(500).send("Erro ao processar a mensagem.");
  }
});