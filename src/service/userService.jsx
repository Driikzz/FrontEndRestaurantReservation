import axios from 'axios';
import BASE_URL from '../misc/base_url';

const userService = {
  async register(userData) {
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/signup`, userData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error during registration:', error);
      throw error;
    }
  },
  async login(credentials) {
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/login`, credentials, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  },
};

export default userService;
