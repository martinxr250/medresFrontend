import axios from 'axios';

const API_URL = 'http://localhost:4001';

export const crearReserva = async (reservaData) => {
  try {
    const response = await axios.post(`${API_URL}/api/medres/reservas`, reservaData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getReservasByUsuario = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/api/medres/reservas/get/by/user`, {headers: {Authorization: `Bearer ${token}`}});
    return response.data;
  } catch (error) {
    throw error;
  }
}