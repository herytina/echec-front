import { apiClient, URL } from "./httpClient";

interface Board {
  [key: string]: any;
}

export const getKnightMoves = async (
  row: number,
  col: number,
  isWhite: boolean,
  board: Board
): Promise<any[]> => {
  try {
    const response = await apiClient.post(`${URL}/knight-moves`, {
      row,
      col,
      isWhite,
      board,
    });
    return response.data.moves;
  } catch (error) {
    console.error('Error fetching knight moves:', error);
    throw error;
  }
};

export const getPawnsMoves = async (
  row: number,
  col: number,
  isWhite: boolean,
  board: Board,
  lastMove: any
): Promise<any[]> => {
  try {
    const response = await apiClient.post(`${URL}/pawns-moves`, {
      row,
      col,
      isWhite,
      board,
      lastMove,
    });
    return response.data.moves;
  } catch (error) {
    console.error('Error fetching pawns moves:', error);
    throw error;
  }
};

export const getBishopMoves = async (
  row: number,
  col: number,
  isWhite: boolean,
  board: Board
): Promise<any[]> => {
  try {
    const response = await apiClient.post(`${URL}/bishop-moves`, {
      row,
      col,
      isWhite,
      board,
    });
    return response.data.moves;
  } catch (error) {
    console.error('Error fetching bishop moves:', error);
    throw error;
  }
};

export const getRookMoves = async (
  row: number,
  col: number,
  isWhite: boolean,
  board: Board
): Promise<any[]> => {
  try {
    const response = await apiClient.post(`${URL}/rook-moves`, {
      row,
      col,
      isWhite,
      board,
    });
    return response.data.moves;
  } catch (error) {
    console.error('Error fetching rook moves:', error);
    throw error;
  }
};

export const getKingMoves = async (
  row: number,
  col: number,
  isWhite: boolean,
  board: Board
): Promise<any[]> => {
  try {
    const response = await apiClient.post(`${URL}/king-moves`, {
      row,
      col,
      isWhite,
      board,
    });
    return response.data.moves;
  } catch (error) {
    console.error('Error fetching king moves:', error);
    throw error;
  }
};

export const getKingRookMoves = async (
  row: number,
  col: number,
  direction: number,
  kingMoved: boolean,
  isWhite: boolean,
  board: Board
): Promise<any[]> => {
  try {
    const response = await apiClient.post(`${URL}/king-to-rook`, {
      row,
      col,
      direction,
      kingMoved,
      isWhite,
      board,
    });
    return response.data.moves;
  } catch (error) {
    console.error('Error fetching king for rook moves:', error);
    throw error;
  }
};
