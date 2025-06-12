import React, { useState, useEffect } from 'react';
import availabilityService from '../service/availabilityService';
import PrimaryButton from '../components/PrimaryButton';
import Inputs from '../components/Inputs';

const ReservationForm = () => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState(2);
  const [note, setNote] = useState('');
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [availableDates, setAvailableDates] = useState([]);
  const [datesLoading, setDatesLoading] = useState(true);
  const [showCalendar, setShowCalendar] = useState(false);

  // Récupération des dates disponibles
  useEffect(() => {
    const fetchAvailableDates = async () => {
      setDatesLoading(true);
      try {
        console.log('Récupération des dates disponibles...');
        const data = await availabilityService.getAvailableDates();
        console.log('Réponse dates:', data);
        
        const dates = data.available_dates?.map(item => item.date) || [];
        setAvailableDates(dates);
        console.log('Dates disponibles:', dates);
        
      } catch (err) {
        console.error('Erreur lors du chargement des dates:', err);
        setAvailableDates([]);
        setError('Erreur lors du chargement des dates disponibles');
      } finally {
        setDatesLoading(false);
      }
    };
    
    fetchAvailableDates();
  }, []);

  // Récupération des créneaux pour une date
  const fetchSlots = async (selectedDate) => {
    if (!selectedDate) {
      setSlots([]);
      setTime('');
      return;
    }

    console.log('Récupération des créneaux pour:', selectedDate);
    
    try {
      const data = await availabilityService.getAvailabilityByDate(selectedDate);
      console.log('Réponse créneaux:', data);
      
      if (data.is_closed) {
        setSlots([]);
        setError(data.message || 'Restaurant fermé ce jour-là');
        return;
      }

      const availableSlots = data.slots || [];
      setSlots(availableSlots);
      setError('');
      
      if (availableSlots.length === 0) {
        setError(`Aucun créneau disponible pour cette date`);
      }
      
    } catch (err) {
      console.error('Erreur lors du chargement des créneaux:', err);
      setSlots([]);
      setError('Erreur lors du chargement des créneaux: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDateSelect = (selectedDate) => {
    console.log('Date sélectionnée:', selectedDate);
    
    setDate(selectedDate);
    setTime('');
    setError('');
    setShowCalendar(false);
    
    // Vérifier si la date est valide
    if (!availableDates.includes(selectedDate)) {
      setSlots([]);
      setError('Cette date n\'est pas disponible à la réservation');
      return;
    }
    
    fetchSlots(selectedDate);
  };

  const handleTimeChange = (e) => {
    setTime(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    // Validation côté client
    if (!availableDates.includes(date)) {
      setError('Date non valide');
      setLoading(false);
      return;
    }

    if (!slots.includes(time)) {
      setError('Créneau non disponible');
      setLoading(false);
      return;
    }

    try {
      await availabilityService.createReservation({
        number_of_people: numberOfPeople,
        date,
        time,
        note,
      });
      
      setSuccess('Réservation enregistrée avec succès !');
      
      // Reset du formulaire
      setDate('');
      setTime('');
      setNumberOfPeople(2);
      setNote('');
      setSlots([]);
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Erreur lors de la réservation";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour formater les dates
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short'
    };
    return date.toLocaleDateString('fr-FR', options);
  };

  // Fonction pour grouper les dates par semaine
  const groupDatesByWeek = () => {
    const weeks = [];
    let currentWeek = [];
    
    availableDates.forEach((dateStr, index) => {
      currentWeek.push(dateStr);
      
      // Nouvelle semaine tous les 7 jours ou à la fin
      if (currentWeek.length === 7 || index === availableDates.length - 1) {
        weeks.push([...currentWeek]);
        currentWeek = [];
      }
    });
    
    return weeks;
  };

  return (
    <div className="container">
      <div className="card">
        <div className="page-header">
          <h1 className="title-page">Réserver une table</h1>
          <p className="page-description">
            Choisissez votre date, votre créneau et le nombre de personnes
          </p>
        </div>

        {datesLoading && (
          <div className="loading">Chargement des disponibilités...</div>
        )}

        <form onSubmit={handleSubmit} className="reservation-form">
          {/* Sélection de date */}
          <div className="form-group">
            <label className="form-label">Date souhaitée</label>
            
            {!datesLoading && availableDates.length > 0 && (
              <div className="date-selection">
                <div className="selected-date-display">
                  <input
                    type="text"
                    value={date ? formatDate(date) : ''}
                    placeholder="Cliquez pour choisir une date"
                    className="form-input date-input"
                    onClick={() => setShowCalendar(!showCalendar)}
                    readOnly
                  />
                  <button 
                    type="button"
                    className="calendar-toggle"
                    onClick={() => setShowCalendar(!showCalendar)}
                  >
                    Calendrier
                  </button>
                </div>

                {showCalendar && (
                  <div className="calendar-container">
                    <div className="calendar-header">
                      <h4>Dates disponibles</h4>
                      <span className="available-count">
                        {availableDates.length} dates disponibles
                      </span>
                    </div>
                    
                    <div className="calendar-grid">
                      {groupDatesByWeek().map((week, weekIndex) => (
                        <div key={weekIndex} className="calendar-week">
                          {week.map(dateStr => (
                            <button
                              key={dateStr}
                              type="button"
                              className={`calendar-date ${date === dateStr ? 'selected' : ''}`}
                              onClick={() => handleDateSelect(dateStr)}
                            >
                              <span className="date-day">
                                {new Date(dateStr).getDate()}
                              </span>
                              <span className="date-month">
                                {formatDate(dateStr).split(' ')[1]}
                              </span>
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {!datesLoading && availableDates.length === 0 && (
              <div className="message message-error">
                Aucune date disponible pour le moment
              </div>
            )}
          </div>

          {/* Nombre de personnes */}
          <div className="form-group">
            <label className="form-label">Nombre de personnes</label>
            <select
              value={numberOfPeople}
              onChange={e => setNumberOfPeople(Number(e.target.value))}
              className="form-select"
              required
            >
              {[...Array(20)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} personne{i > 0 ? 's' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Créneau horaire */}
          <div className="form-group">
            <label className="form-label">Créneau horaire</label>
            
            {date && slots.length > 0 && (
              <div className="time-slots">
                {slots.map(slot => (
                  <button
                    key={slot}
                    type="button"
                    className={`time-slot ${time === slot ? 'selected' : ''}`}
                    onClick={() => setTime(slot)}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            )}

            {date && slots.length === 0 && !error && (
              <div className="message message-info">
                Chargement des créneaux...
              </div>
            )}

            {!date && (
              <div className="form-help">
                Sélectionnez d'abord une date pour voir les créneaux disponibles
              </div>
            )}
          </div>

          {/* Note optionnelle */}
          <div className="form-group">
            <label className="form-label">Note (optionnelle)</label>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Allergies, occasion spéciale, demandes particulières..."
              className="form-textarea"
              rows="3"
            />
          </div>

          {/* Messages d'erreur/succès */}
          {success && (
            <div className="message message-success">
              {success}
            </div>
          )}
          
          {error && (
            <div className="message message-error">
              {error}
            </div>
          )}

          {/* Bouton de soumission */}
          <div className="form-actions">
            <button 
              type="submit" 
              disabled={loading || !date || !time || slots.length === 0}
              className="btn btn-primary btn-full btn-large"
            >
              {loading ? 'Réservation en cours...' : 'Confirmer la réservation'}
            </button>
          </div>
        </form>

        {/* Informations pratiques */}
        <div className="reservation-info">
          <h3>Informations pratiques</h3>
          <ul>
            <li>Les réservations sont confirmées sous 24h</li>
            <li>Annulation gratuite jusqu'à 2h avant l'heure de réservation</li>
            <li>Un retard de plus de 15 minutes peut entraîner l'annulation</li>
            <li>Pour les groupes de plus de 10 personnes, contactez-nous directement</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ReservationForm;
