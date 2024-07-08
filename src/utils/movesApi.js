import { apiClient, URL } from "./httpClient";

export const getKnightMoves = async (row, col, isWhite, board) => {
  try {
    const response = await apiClient.post(`${URL}/knight-moves`, {
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

export const getPawnsMoves = async (row, col, isWhite, board, lastMove) => {
  try {
    const response = await apiClient.post(`${URL}/pawns-moves`, {
      row,
      col,
      isWhite,
      board,
      lastMove
    });
    return response.data.moves;
  } catch (error) {
    console.error('Error fetching pawns moves:', error);
    throw error;
  }
};

export const getBishopMoves = async (row, col, isWhite, board) => {
  try {
    const response = await apiClient.post(`${URL}/bishop-moves`, {
      row,
      col,
      isWhite,
      board
    });
    return response.data.moves;
  } catch (error) {
    console.error('Error fetching bishop moves:', error);
    throw error;
  }
};

export const getRookMoves = async (row, col, isWhite, board) => {
  try {
    const response = await apiClient.post(`${URL}/rook-moves`, {
      row,
      col,
      isWhite,
      board
    });
    return response.data.moves;
  } catch (error) {
    console.error('Error fetching rook moves:', error);
    throw error;
  }
};

export const getKingMoves = async (row, col, isWhite, board) => {
  try {
    const response = await apiClient.post(`${URL}/king-moves`, {
      row,
      col,
      isWhite,
      board
    });
    return response.data.moves;
  } catch (error) {
    console.error('Error fetching king moves:', error);
    throw error;
  }
};

export const getKingRookMoves = async (row, col, direction, kingMoved, isWhite, board) => {
  try {
    const response = await apiClient.post(`${URL}/king-to-rook`, {
      row,
      col,
      direction,
      kingMoved,
      isWhite,
      board
    });
    return response.data.moves;
  } catch (error) {
    console.error('Error fetching king for rook moves:', error);
    throw error;
  }
};
