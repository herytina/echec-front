import { apiClient, URL } from "./httpClient";

export const createParty = async(name,mise,players, status) => {
  try {
    const response = await apiClient.post(`${URL}/createParty`, {
      name,
      mise,
      players,
      status
    })
    return response.data
  } catch (error) {
    console.error('Error fetching create party:', error);
    throw error;
  }
}

export const getAllParty = async () => {
  try {
    const response = await apiClient.get(`${URL}/getAllParty`)
    return response.data
  } catch (error) {
    console.error('Error fetching get all party:', error);
    throw error;
  }
}

export const getPartybyId = async (id) => {
  try {
    const response = await apiClient.get(`${URL}/getPartyId/${id}`)
    return response.data[0]
  } catch (error) {
    console.error('Error fetching get party by id:', error);
    throw error;
  }
}

export const updateParty = async (id,userId,status) => {
  try {
    const response = await apiClient.put(`${URL}/updateParty/${id}`, { userId, status })
    return response.data
  } catch (error) {
    console.error('Error fetching update party', error);
    throw error;
  }
}

export const updatePartyboard = async (id,board,status,currentPlayer, isTopTimer,isBottomTimer,selectedPiece,lastMove) => {
  try {
    const response = await apiClient.put(`${URL}/updatedBoard/${id}`, { board, status, currentPlayer, isTopTimer, isBottomTimer, selectedPiece,lastMove })
    return response.data
  } catch (error) {
    console.error('Error fetching update party board', error);
    throw error;
  }
}

export const deleteParty = async (id) => {
  try {
    const response = await apiClient.delete(`${URL}/deleteParty/:${id}`)
    return response.data
  } catch (error) {
    console.error('Error fetching delete party', error);
    throw error;
  }
}
