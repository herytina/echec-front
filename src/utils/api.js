import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000', // L'URL de base de votre serveur Node.js
  headers: {
    'Content-Type': 'application/json'
  }
});

export const getKnightMoves = async (row, col, isWhite, board) => {
  try {
    const response = await apiClient.post('http://localhost:3000/api/knight-moves', {
      row,
      col,
      isWhite,
      board
    });
    return response.data.moves;
  } catch (error) {
    console.error('Error fetching knight moves:', error);
    throw error;
  }
};
