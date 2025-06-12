import axios from 'axios';
import BASE_URL from '../misc/base_url';

const availabilityService = {
  async getAvailabilityByDate(date) {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${BASE_URL}/api/availability`, {
        params: { date },
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des créneaux disponibles :', error);
      throw error;
    }
  },
  async getAllOpeningSlots() {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${BASE_URL}/api/availability/admin/opening-slots`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des créneaux standards :', error);
      throw error;
    }
  },
  async createOrUpdateOpeningSlot(slot) {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(`${BASE_URL}/api/availability/admin/opening-slots`, slot, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création/mise à jour du créneau standard :', error);
      throw error;
    }
  },
  async updateOpeningSlot(slot) {
    // La route POST /admin/opening-slots sert à la fois à la création et à la modification
    // Il suffit d'appeler createOrUpdateOpeningSlot avec les bons paramètres
    return this.createOrUpdateOpeningSlot(slot);
  },
  async createOrUpdateExceptionalDate(data) {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(`${BASE_URL}/api/availability/admin/exceptional-dates`, data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création/mise à jour de la date exceptionnelle :', error);
      throw error;
    }
  },
  async updateExceptionalDate(data) {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(`${BASE_URL}/api/availability/admin/exceptional-dates`, data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la date exceptionnelle :', error);
      throw error;
    }
  },
  async getExceptionalDates() {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${BASE_URL}/api/availability/admin/exceptional-dates`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des dates exceptionnelles :', error);
      return [];
    }
  },
  async getAvailableTables(date, time) {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${BASE_URL}/api/availability/available-tables`, {
        params: { date, time },
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des tables disponibles :', error);
      throw error;
    }
  },
  // --- RÉSERVATIONS CLIENT ---
  async createReservation(data) {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(`${BASE_URL}/api/reservations`, data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la réservation :', error);
      throw error;
    }
  },
  async getMyReservations() {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${BASE_URL}/api/reservations/my-reservations`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de mes réservations :', error);
      throw error;
    }
  },
  async cancelReservation(id) {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.delete(`${BASE_URL}/api/reservations/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'annulation de la réservation :', error);
      throw error;
    }
  },
  // --- RÉSERVATIONS ADMIN ---
  async getAllReservations(filters = {}) {
    const token = localStorage.getItem('token');
    try {
      const params = new URLSearchParams();
      if (filters.date) params.append('date', filters.date);
      if (filters.status) params.append('status', filters.status);
      
      const response = await axios.get(`${BASE_URL}/api/reservations?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des réservations admin :', error);
      throw error;
    }
  },
  async validateReservation(id) {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.patch(`${BASE_URL}/api/reservations/${id}/validate`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la validation de la réservation :', error);
      throw error;
    }
  },
  async cancelReservationAdmin(id) {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.delete(`${BASE_URL}/api/reservations/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'annulation admin de la réservation :', error);
      throw error;
    }
  },
  // Nouvelle fonction : obtenir les dates disponibles
  async getAvailableDates() {
    try {
      const response = await axios.get(`${BASE_URL}/api/availability/dates`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des dates disponibles :', error);
      throw error;
    }
  },
  // Fonction améliorée pour obtenir les dates disponibles avec plus de détails
  async getAvailableDatesDetailed() {
    try {
      const response = await axios.get(`${BASE_URL}/api/availability/dates`);
      return response.data.available_dates || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des dates disponibles détaillées :', error);
      return [];
    }
  },
};

export default availabilityService;
