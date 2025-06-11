import axios from 'axios';
import BASE_URL from '../misc/base_url';

const tableService = {
  
  async createTable(tableData) {
    const token = localStorage.getItem('token');
    const payload = {
      name: tableData.name,
      seats: Number(tableData.seats),
      location: tableData.location,
    };
    try {
      const response = await axios.post(`${BASE_URL}/api/tables/`, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la table :', error);
      throw error;
    }
  },

  async updateTable(id, tableData) {
    const token = localStorage.getItem('token');
    const payload = {
      name: tableData.name,
      seats: Number(tableData.seats),
      location: tableData.location,
    };
    try {
      const response = await axios.put(`${BASE_URL}/api/tables/${id}`, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la modification de la table :', error);
      throw error;
    }
  },
  
  async getTables() {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${BASE_URL}/api/tables/`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des tables :', error);
      throw error;
    }
  },
};

export default tableService;
