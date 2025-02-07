import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import "./CSS/ManageUsers.css";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      // Supondo que os usuários estejam em uma coleção chamada "users" no Firestore
      const usersSnapshot = await getDocs(collection(db, "users"));
      const usersList = usersSnapshot.docs.map(doc => doc.data());
      setUsers(usersList);
    };

    fetchUsers();
  }, []);

  return (
    <div className="manage-users-container">
      <h3>Gerenciar Usuários</h3>
      <ul>
        {users.map((user, index) => (
          <li key={index}>
            <p>{user.name}</p>
            <p>{user.email}</p>
            <button>Deletar</button> {/* Exemplo de ação para deletar usuário */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageUsers;
