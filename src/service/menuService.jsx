import axios from 'axios';
import BASE_URL from '../misc/base_url';

const menu = {
  async getMenu() {
    try {
      const response = await axios.get(`${BASE_URL}/api/menu`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching menu:', error);
      throw error;
    }
  },
}
export default menu;
