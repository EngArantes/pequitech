import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage'; // Importando o Firebase Storage

const firebaseConfig = {
  apiKey: "AIzaSyBOP3Q1vHIK8Y9b_Jtm0YHS67B4m0B4V2k",
  authDomain: "pequitech-db413.firebaseapp.com",
  projectId: "pequitech-db413",
  storageBucket: "pequitech-db413.firebasestorage.app",
  messagingSenderId: "254447273654",
  appId: "1:254447273654:web:d724b262d09523b9a28817",
  measurementId: "G-5ZXM545JJK"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Habilita persistência offline para Firestore
/* enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.error('Persistência offline falhou devido a múltiplas abas abertas.');
  } else if (err.code === 'unimplemented') {
    console.error('Persistência offline não é suportada no navegador.');
  }
}); */

