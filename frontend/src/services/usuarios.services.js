import axios from 'axios';
import { API_URL } from '../constants/constants.js';

const login = async (data) => {
    try {
        const user = await axios.post(`${API_URL}/api/medres/usuarios/login`, data);
        console.log("usuario que se esta logueando: ", user)
        return user.data
    } catch (error) {
        if (error.response) {
            return error.response.data;
        }
    }
}

const registerUser = async (data) => {
    try {
        const user = await axios.post(`${API_URL}/api/medres/usuarios/`, data);
        return user.data
    } catch (error) {
        if (error.response) {
            return error.response.data;
        }
    }
}

const userServices = {
    login,
    registerUser
}

export {userServices}