import React, { useEffect, useState } from 'react';
import availabilityService from '../service/availabilityService';
import PrimaryButton from '../components/PrimaryButton';

const AdminReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filters, setFilters] = useState({ date: '', status: '' });

  const fetchReservations = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await availabilityService.getAllReservations(filters);
      setReservations(data);
    } catch (err) {
      setError("Erreur lors du chargement des réservations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  useEffect(() => {
    // Recharger quand les filtres changent
    fetchReservations();
  }, [filters]);

  const handleValidate = async (id) => {
    setError('');
    setSuccess('');
    try {
      await availabilityService.validateReservation(id);
      setSuccess('Réservation validée.');
      fetchReservations(); // Mise à jour en temps réel
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la validation");
    }
  };

  const handleCancel = async (id) => {
    setError('');
    setSuccess('');
    try {
      await availabilityService.cancelReservationAdmin(id);
      setSuccess('Réservation annulée.');
      fetchReservations(); // Mise à jour en temps réel
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'annulation");
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: '#ffa726',
      confirmed: '#66bb6a',
      cancelled: '#ef5350'
    };
    return (
      <span style={{
        background: colors[status] || '#9e9e9e',
        color: 'white',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 'bold'
      }}>
        {status === 'pending' ? 'En attente' : 
         status === 'confirmed' ? 'Confirmée' : 
         status === 'cancelled' ? 'Annulée' : status}
      </span>
    );
  };

  return (
    <div style={{ maxWidth: 1200, margin: '40px auto', background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px #e0e7ef', padding: 40 }}>
      <h1 style={{ textAlign: 'center', color: '#222', fontSize: 32, marginBottom: 32 }}>
        Gestion des Réservations
      </h1>

      {/* Filtres */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, alignItems: 'center', flexWrap: 'wrap' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          Date :
          <input
            type="date"
            name="date"
            value={filters.date}
            onChange={handleFilterChange}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          Statut :
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            <option value="">Tous</option>
            <option value="pending">En attente</option>
            <option value="confirmed">Confirmées</option>
            <option value="cancelled">Annulées</option>
          </select>
        </label>
        <PrimaryButton 
          onClick={() => setFilters({ date: '', status: '' })}
          style={{ background: '#6c757d' }}
        >
          Réinitialiser
        </PrimaryButton>
      </div>

      {/* Messages */}
      {success && <div className="success-message" style={{ color: 'green', marginBottom: 16, textAlign: 'center' }}>{success}</div>}
      {error && <div className="error-message" style={{ color: 'red', marginBottom: 16, textAlign: 'center' }}>{error}</div>}

      {/* Tableau des réservations */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
          🔄 Chargement des réservations...
        </div>
      ) : reservations.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
          Aucune réservation trouvée.
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e0e7ef' }}>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>ID</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Client</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Date</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Heure</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Personnes</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Tables</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Statut</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Note</th>
                <th style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map(res => (
                <tr key={res.id} style={{ borderBottom: '1px solid #e0e7ef' }}>
                  <td style={{ padding: '12px' }}>{res.id}</td>
                  <td style={{ padding: '12px' }}>
                    {res.User ? `${res.User.firstname} ${res.User.lastname}` : 'N/A'}
                    <br />
                    <small style={{ color: '#666' }}>{res.User?.email}</small>
                  </td>
                  <td style={{ padding: '12px' }}>{res.date}</td>
                  <td style={{ padding: '12px' }}>{res.time}</td>
                  <td style={{ padding: '12px' }}>{res.number_of_people}</td>
                  <td style={{ padding: '12px' }}>
                    {res.Tables?.map(t => t.name).join(', ') || 'N/A'}
                  </td>
                  <td style={{ padding: '12px' }}>
                    {getStatusBadge(res.status)}
                  </td>
                  <td style={{ padding: '12px', maxWidth: '150px' }}>
                    <div style={{ 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis', 
                      whiteSpace: 'nowrap',
                      color: '#666'
                    }}>
                      {res.note || '-'}
                    </div>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      {res.status === 'pending' && (
                        <>
                          <PrimaryButton 
                            onClick={() => handleValidate(res.id)}
                            style={{ 
                              background: '#66bb6a', 
                              fontSize: '12px',
                              padding: '6px 12px'
                            }}
                          >
                            Valider
                          </PrimaryButton>
                          <PrimaryButton 
                            onClick={() => handleCancel(res.id)}
                            style={{ 
                              background: '#ef5350', 
                              fontSize: '12px',
                              padding: '6px 12px'
                            }}
                          >
                            Annuler
                          </PrimaryButton>
                        </>
                      )}
                      {res.status === 'confirmed' && (
                        <PrimaryButton 
                          onClick={() => handleCancel(res.id)}
                          style={{ 
                            background: '#ef5350', 
                            fontSize: '12px',
                            padding: '6px 12px'
                          }}
                        >
                          Annuler
                        </PrimaryButton>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Statistiques rapides */}
      <div style={{ marginTop: 32, display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ background: '#e3f2fd', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1976d2' }}>
            {reservations.length}
          </div>
          <div style={{ color: '#666' }}>Total</div>
        </div>
        <div style={{ background: '#fff3e0', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f57c00' }}>
            {reservations.filter(r => r.status === 'pending').length}
          </div>
          <div style={{ color: '#666' }}>En attente</div>
        </div>
        <div style={{ background: '#e8f5e8', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#388e3c' }}>
            {reservations.filter(r => r.status === 'confirmed').length}
          </div>
          <div style={{ color: '#666' }}>Confirmées</div>
        </div>
      </div>
    </div>
  );
};

export default AdminReservations; 