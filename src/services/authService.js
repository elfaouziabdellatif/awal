import axios from "axios";
import { useDispatch } from "react-redux";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, { email, password });
        const { token, user } = response.data;
        // Save the token to localStorage
        localStorage.setItem('token', token);

        // Return both user and token as an object
        return { user, token };
      } catch (error) {
        throw new Error(error.response.data.msg || 'Login failed');
      }
}

export const register = async (email,username, password) => {
    try {
        const response = await axios.post(`${API_URL}/auth/register`, {
            email,
            password,
            username
        });
        return response.data;
    }catch (error) {
        return error.response ? error.response.data : error;
    }
}
export const logout = () => {
    const dispatch = useDispatch();
    dispatch(clearUserInfo()); // Clear user info from Redux
    // Optionally, clear any session storage or cookies
  };


