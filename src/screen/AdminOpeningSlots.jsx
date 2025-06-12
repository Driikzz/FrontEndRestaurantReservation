import React, { useEffect, useState } from 'react';
import availabilityService from '../service/availabilityService';

const AdminOpeningSlots = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ 
    day_of_week: 1, 
    time: '', 
    duration: 90, 
    is_active: true 
  });
  const [success, setSuccess] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

  const fetchSlots = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await availabilityService.getAllOpeningSlots();
      setSlots(data);
    } catch (err) {
      setError("Erreur lors du chargement des créneaux.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      if (editMode) {
        await availabilityService.updateOpeningSlot({
          ...form,
          day_of_week: Number(form.day_of_week),
          duration: Number(form.duration),
        });
        setSuccess('Créneau modifié avec succès');
      } else {
        await availabilityService.createOrUpdateOpeningSlot({
          ...form,
          day_of_week: Number(form.day_of_week),
          duration: Number(form.duration),
        });
        setSuccess('Créneau créé avec succès');
      }
      
      resetForm();
      fetchSlots();
    } catch (err) {
      setError("Erreur lors de l'enregistrement du créneau.");
    }
  };

  const handleEdit = (slot) => {
    setForm({
      day_of_week: slot.day_of_week,
      time: slot.time,
      duration: slot.duration,
      is_active: slot.is_active,
    });
    setEditMode(true);
    setShowForm(true);
    setSuccess('');
    setError('');
  };

  const resetForm = () => {
    setForm({ day_of_week: 1, time: '', duration: 90, is_active: true });
    setEditMode(false);
    setShowForm(false);
    setSuccess('');
    setError('');
  };

  // Grouper les créneaux par jour
  const slotsByDay = slots.reduce((acc, slot) => {
    if (!acc[slot.day_of_week]) {
      acc[slot.day_of_week] = [];
    }
    acc[slot.day_of_week].push(slot);
    return acc;
  }, {});

  // Trier les créneaux par heure
  Object.keys(slotsByDay).forEach(day => {
    slotsByDay[day].sort((a, b) => a.time.localeCompare(b.time));
  });

  return (
    <div>
      <div className="section-header">
        <h2>Créneaux Standards</h2>
        <button 
          onClick={() => setShowForm(true)} 
          className="btn btn-primary"
        >
          Nouveau créneau
        </button>
      </div>

      <p className="section-description">
        Définissez les créneaux d'ouverture récurrents par jour de la semaine. 
        Ces créneaux seront appliqués automatiquement chaque semaine.
      </p>

      {/* Formulaire */}
      {showForm && (
        <div className="form-overlay">
          <div className="form-modal">
            <div className="modal-header">
              <h3>{editMode ? 'Modifier le créneau' : 'Nouveau créneau'}</h3>
              <button onClick={resetForm} className="btn-close">×</button>
            </div>
            
            <form onSubmit={handleSubmit} className="opening-slots-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Jour de la semaine</label>
                  <select 
                    name="day_of_week" 
                    value={form.day_of_week} 
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    {days.map((day, index) => (
                      <option key={index} value={index}>{day}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Heure</label>
                  <input 
                    name="time" 
                    type="time" 
                    value={form.time} 
                    onChange={handleChange}
                    className="form-input"
                    required 
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Durée (minutes)</label>
                  <select 
                    name="duration" 
                    value={form.duration} 
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value={60}>1h00</option>
                    <option value={90}>1h30</option>
                    <option value={120}>2h00</option>
                    <option value={150}>2h30</option>
                    <option value={180}>3h00</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Statut</label>
                  <div className="checkbox-container">
                    <label className="checkbox-label">
                      <input 
                        name="is_active" 
                        type="checkbox" 
                        checked={form.is_active} 
                        onChange={handleChange}
                        className="checkbox-input"
                      />
                      <span className="checkbox-text">Actif</span>
                    </label>
                  </div>
                </div>
              </div>

              {error && <div className="message message-error">{error}</div>}
              {success && <div className="message message-success">{success}</div>}

              <div className="form-actions">
                <button type="button" onClick={resetForm} className="btn btn-secondary">
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                  {editMode ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Liste des créneaux */}
      {loading ? (
        <div className="loading">Chargement des créneaux...</div>
      ) : error ? (
        <div className="message message-error">{error}</div>
      ) : (
        <div className="slots-grid">
          {days.map((dayName, dayIndex) => (
            <div key={dayIndex} className="day-column">
              <div className="day-header">
                <h3>{dayName}</h3>
                <span className="slots-count">
                  {slotsByDay[dayIndex]?.length || 0} créneau(x)
                </span>
              </div>
              
              <div className="day-slots">
                {slotsByDay[dayIndex]?.length > 0 ? (
                  slotsByDay[dayIndex].map((slot) => (
                    <div 
                      key={slot.id} 
                      className={`slot-card ${!slot.is_active ? 'inactive' : ''}`}
                      onClick={() => handleEdit(slot)}
                    >
                      <div className="slot-time">{slot.time}</div>
                      <div className="slot-duration">{slot.duration} min</div>
                      <div className="slot-status">
                        <span className={`status-badge ${slot.is_active ? 'active' : 'inactive'}`}>
                          {slot.is_active ? 'Actif' : 'Inactif'}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-day">
                    <p>Aucun créneau</p>
                    <button 
                      onClick={() => {
                        setForm(prev => ({ ...prev, day_of_week: dayIndex }));
                        setShowForm(true);
                      }}
                      className="btn btn-outline btn-small"
                    >
                      Ajouter
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOpeningSlots;
