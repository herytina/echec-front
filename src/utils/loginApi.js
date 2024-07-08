import { apiClient, URL } from "./httpClient";

export const verifyUser = async(name,pwd) => {
  try {
    const response = await apiClient.post(`${URL}/login`, {
      name,pwd
    })
    return response.data
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}
