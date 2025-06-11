import React, { useEffect, useState } from 'react';
import availabilityService from '../service/availabilityService';
import PrimaryButton from '../components/PrimaryButton';

const MyReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchReservations = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await availabilityService.getMyReservations();
      setReservations(data);
    } catch (err) {
      setError("Erreur lors du chargement de vos réservations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleCancel = async (id) => {
    setError('');
    setSuccess('');
    try {
      await availabilityService.cancelReservation(id);
      setSuccess('Réservation annulée.');
      fetchReservations();
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'annulation");
    }
  };

  return (
    <div className="my-reservations-container">
      <h2>Mes réservations</h2>
      {loading ? (
        <div>Chargement...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <>
          {success && <div className="success-message">{success}</div>}
          {reservations.length === 0 ? (
            <div>Vous n'avez pas de réservation.</div>
          ) : (
            <table className="reservation-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Heure</th>
                  <th>Personnes</th>
                  <th>Tables</th>
                  <th>Statut</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map(res => (
                  <tr key={res.id}>
                    <td>{res.date}</td>
                    <td>{res.time}</td>
                    <td>{res.number_of_people}</td>
                    <td>{res.Tables?.map(t => t.name).join(', ')}</td>
                    <td>{res.status}</td>
                    <td>
                      {res.status === 'pending' && (
                        <PrimaryButton onClick={() => handleCancel(res.id)}>
                          Annuler
                        </PrimaryButton>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
};

export default MyReservations;
