import axios from 'axios';
// import { useStoreUser } from '@/stores/user.store';

export const apiClient = axios.create({
  baseURL: 'http://localhost:3000', // L'URL de base de votre serveur Node.js
  headers: {
    'Content-Type': 'application/json'
  }
});

// // Ajouter un interceptor pour inclure le token à chaque requête
// apiClient.interceptors.request.use(config => {
//   const userStore = useStoreUser(); // Accéder au store Pinia
//   const token = userStore.token; // Récupérer le token depuis le store
  
//   if (token) {
//     config.headers['Authorization'] = `Bearer ${token}`;
//   }
  
//   return config;
// }, error => {
//   return Promise.reject(error);
// });

export const URL = 'http://localhost:3000/api'
