import { apiClient, URL } from "./httpClient";

export const createParty = async (
  name: string,
  mise: number,
  players: string,
  status: string,
  timer: number
): Promise<any> => {
  try {
    const response = await apiClient.post(`${URL}/createParty`, {
      name,
      mise,
      players,
      status,
      timer,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching create party:', error);
    throw error;
  }
};

export const getAllParty = async (): Promise<any[]> => {
  try {
    const response = await apiClient.get(`${URL}/getAllParty`);
    return response.data;
  } catch (error) {
    console.error('Error fetching get all party:', error);
    throw error;
  }
};

export const getPartyById = async (id: number): Promise<any> => {
  try {
    const response = await apiClient.get(`${URL}/getPartyId/${id}`);
    return response.data[0];
  } catch (error) {
    console.error('Error fetching get party by id:', error);
    throw error;
  }
};

export const updateParty = async (
  id: number,
  userId: string,
  status: string
): Promise<any> => {
  try {
    const response = await apiClient.put(`${URL}/updateParty/${id}`, {
      userId,
      status,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching update party', error);
    throw error;
  }
};

export const deleteParty = async (id: string): Promise<any> => {
  try {
    const response = await apiClient.delete(`${URL}/deleteParty/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching delete party', error);
    throw error;
  }
};
