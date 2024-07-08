import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'http://localhost:3000', // L'URL de base de votre serveur Node.js
  headers: {
    'Content-Type': 'application/json'
  }
});

export const URL = 'http://localhost:3000/api'
