import React, { useState, useEffect } from 'react';
import availabilityService from '../service/availabilityService';

const AdminExceptionalDateForm = () => {
  const [form, setForm] = useState({
    date: '',
    is_closed: false,
    note: '',
    slots: [],
  });
  const [slot, setSlot] = useState({ time: '', duration: 90 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [exceptionalDates, setExceptionalDates] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const fetchExceptionalDates = async () => {
    try {
      const data = await availabilityService.getExceptionalDates();
      setExceptionalDates(data);
    } catch (err) {
      console.error('Erreur lors du chargement des dates exceptionnelles:', err);
    }
  };

  useEffect(() => {
    fetchExceptionalDates();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSlotChange = (e) => {
    const { name, value } = e.target;
    setSlot((prev) => ({ ...prev, [name]: value }));
  };

  const addSlot = () => {
    if (slot.time) {
      setForm((prev) => ({ 
        ...prev, 
        slots: [...prev.slots, { ...slot, duration: Number(slot.duration) }] 
      }));
      setSlot({ time: '', duration: 90 });
    }
  };

  const removeSlot = (idx) => {
    setForm((prev) => ({ 
      ...prev, 
      slots: prev.slots.filter((_, i) => i !== idx) 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      await availabilityService.createOrUpdateExceptionalDate({
        ...form,
        slots: form.is_closed ? [] : form.slots,
      });
      setSuccess('Date exceptionnelle enregistrée avec succès');
      resetForm();
      fetchExceptionalDates();
    } catch (err) {
      setError("Erreur lors de l'enregistrement de la date exceptionnelle.");
    }
    setLoading(false);
  };

  const resetForm = () => {
    setForm({ date: '', is_closed: false, note: '', slots: [] });
    setSlot({ time: '', duration: 90 });
    setShowForm(false);
    setError('');
    setSuccess('');
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
    <div>
      <div className="section-header">
        <h2>Dates Exceptionnelles</h2>
        <button 
          onClick={() => setShowForm(true)} 
          className="btn btn-primary"
        >
          Nouvelle date
        </button>
      </div>

      <p className="section-description">
        Gérez les fermetures exceptionnelles et les horaires spéciaux 
        (jours fériés, événements privés, maintenance...).
      </p>

      {/* Formulaire */}
      {showForm && (
        <div className="form-overlay">
          <div className="form-modal">
            <div className="modal-header">
              <h3>Nouvelle date exceptionnelle</h3>
              <button onClick={resetForm} className="btn-close">×</button>
            </div>
            
            <form onSubmit={handleSubmit} className="exceptional-date-form">
              <div className="form-group">
                <label className="form-label">Date</label>
                <input 
                  name="date" 
                  type="date" 
                  value={form.date} 
                  onChange={handleChange}
                  className="form-input"
                  required 
                />
              </div>

              <div className="form-group">
                <div className="checkbox-container">
                  <label className="checkbox-label">
                    <input 
                      name="is_closed" 
                      type="checkbox" 
                      checked={form.is_closed} 
                      onChange={handleChange}
                      className="checkbox-input"
                    />
                    <span className="checkbox-text">Restaurant fermé ce jour</span>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Note explicative</label>
                <input 
                  name="note" 
                  type="text" 
                  value={form.note} 
                  onChange={handleChange}
                  placeholder="Ex: Fermeture exceptionnelle pour travaux, Événement privé..."
                  className="form-input"
                />
              </div>

              {!form.is_closed && (
                <div className="slots-section">
                  <h4>Créneaux spéciaux pour cette date</h4>
                  <p className="section-description">
                    Si aucun créneau n'est défini, les horaires standards s'appliqueront.
                  </p>
                  
                  <div className="add-slot-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Heure</label>
                        <input 
                          name="time" 
                          type="time" 
                          value={slot.time} 
                          onChange={handleSlotChange}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Durée</label>
                        <select 
                          name="duration" 
                          value={slot.duration} 
                          onChange={handleSlotChange}
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
                        <label className="form-label">&nbsp;</label>
                        <button 
                          type="button" 
                          onClick={addSlot}
                          disabled={!slot.time}
                          className="btn btn-secondary"
                        >
                          Ajouter
                        </button>
                      </div>
                    </div>
                  </div>

                  {form.slots.length > 0 && (
                    <div className="slots-list">
                      <h5>Créneaux ajoutés:</h5>
                      <div className="added-slots">
                        {form.slots.map((s, idx) => (
                          <div key={idx} className="added-slot">
                            <span>{s.time} ({s.duration} min)</span>
                            <button 
                              type="button"
                              onClick={() => removeSlot(idx)}
                              className="btn-remove"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {error && <div className="message message-error">{error}</div>}
              {success && <div className="message message-success">{success}</div>}

              <div className="form-actions">
                <button type="button" onClick={resetForm} className="btn btn-secondary">
                  Annuler
                </button>
                <button type="submit" disabled={loading} className="btn btn-primary">
                  {loading ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Liste des dates exceptionnelles */}
      <div className="exceptional-dates-list">
        {exceptionalDates.length > 0 ? (
          <div className="dates-grid">
            {exceptionalDates.map((date) => (
              <div key={date.id} className="date-card">
                <div className="date-header">
                  <h4>{formatDate(date.date)}</h4>
                  <span className={`status-badge ${date.is_closed ? 'closed' : 'special'}`}>
                    {date.is_closed ? 'Fermé' : 'Horaires spéciaux'}
                  </span>
                </div>
                
                {date.note && (
                  <p className="date-note">{date.note}</p>
                )}
                
                {!date.is_closed && date.ExceptionalSlots?.length > 0 && (
                  <div className="date-slots">
                    <h5>Créneaux:</h5>
                    <div className="slots-list">
                      {date.ExceptionalSlots.map((slot, idx) => (
                        <span key={idx} className="slot-tag">
                          {slot.time} ({slot.duration}min)
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>Aucune date exceptionnelle</h3>
            <p>Aucune fermeture ou horaire spécial n'est défini</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminExceptionalDateForm;
