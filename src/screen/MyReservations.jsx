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
      setSuccess('Réservation annulée avec succès.');
      fetchReservations();
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'annulation");
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { text: 'En attente', class: 'badge-pending' },
      confirmed: { text: 'Confirmée', class: 'badge-confirmed' },
      cancelled: { text: 'Annulée', class: 'badge-cancelled' }
    };
    const statusInfo = statusMap[status] || { text: status, class: 'badge-pending' };
    
    return <span className={`badge ${statusInfo.class}`}>{statusInfo.text}</span>;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="container">
      <div className="card">
        <div className="page-header">
          <h1 className="title-page">Mes Réservations</h1>
          <p className="page-description">
            Consultez et gérez vos réservations actuelles et passées
          </p>
        </div>

        {loading ? (
          <div className="loading">Chargement de vos réservations...</div>
        ) : error ? (
          <div className="message message-error">{error}</div>
        ) : (
          <>
            {success && <div className="message message-success">{success}</div>}
            
            {reservations.length === 0 ? (
              <div className="empty-state">
                <h3>Aucune réservation</h3>
                <p>Vous n'avez pas encore effectué de réservation.</p>
                <a href="/reserver" className="btn btn-primary">
                  Faire une réservation
                </a>
              </div>
            ) : (
              <div className="reservations-list">
                {reservations.map(reservation => (
                  <div key={reservation.id} className="reservation-card">
                    <div className="reservation-header">
                      <div className="reservation-date">
                        <h3>{formatDate(reservation.date)}</h3>
                        <p className="reservation-time">{reservation.time}</p>
                      </div>
                      <div className="reservation-status">
                        {getStatusBadge(reservation.status)}
                      </div>
                    </div>
                    
                    <div className="reservation-details">
                      <div className="detail-item">
                        <span className="detail-label">Nombre de personnes:</span>
                        <span className="detail-value">{reservation.number_of_people}</span>
                      </div>
                      
                      <div className="detail-item">
                        <span className="detail-label">Tables:</span>
                        <span className="detail-value">
                          {reservation.Tables?.map(t => t.name).join(', ') || 'Non assignées'}
                        </span>
                      </div>
                      
                      {reservation.note && (
                        <div className="detail-item">
                          <span className="detail-label">Note:</span>
                          <span className="detail-value">{reservation.note}</span>
                        </div>
                      )}
                    </div>
                    
                    {reservation.status === 'pending' && (
                      <div className="reservation-actions">
                        <button 
                          onClick={() => handleCancel(reservation.id)}
                          className="btn btn-danger btn-small"
                        >
                          Annuler la réservation
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyReservations;
