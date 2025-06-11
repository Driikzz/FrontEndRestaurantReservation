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
  const [hoveredDate, setHoveredDate] = useState('');

  // Récupère les dates avec au moins un slot standard actif ET gère les dates exceptionnelles (ouvertures/fermetures)
  useEffect(() => {
    const fetchAvailableDates = async () => {
      setDatesLoading(true);
      const today = new Date();
      const dates = [];
      // 1. Récupérer les créneaux standards actifs
      let openingSlots = [];
      try {
        openingSlots = await availabilityService.getAllOpeningSlots();
      } catch (e) { /* ignore */ }
      const activeDays = new Set(
        openingSlots.filter(s => s.is_active).map(s => s.day_of_week)
      );
      // 2. Récupérer les dates exceptionnelles (ouvertures/fermetures)
      let exceptionalDates = [];
      try {
        exceptionalDates = await availabilityService.getExceptionalDates(); // à créer si besoin
      } catch (e) { /* ignore */ }
      const exceptionalMap = {};
      exceptionalDates.forEach(ed => {
        exceptionalMap[ed.date] = ed;
      });
      // 3. Générer les 30 prochains jours qui correspondent à un jour actif, en tenant compte des exceptions
      for (let i = 0; i < 30; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        const dayOfWeek = d.getDay();
        const dateStr = d.toISOString().slice(0, 10);
        // Si date exceptionnelle fermée, on saute
        if (exceptionalMap[dateStr]?.is_closed) continue;
        // Si date exceptionnelle ouverte avec slots, on ajoute
        if (exceptionalMap[dateStr] && exceptionalMap[dateStr].slots && exceptionalMap[dateStr].slots.length > 0) {
          dates.push(dateStr);
          continue;
        }
        // Sinon, jour standard
        if (activeDays.has(dayOfWeek)) {
          dates.push(dateStr);
        }
      }
      setAvailableDates(dates);
      setDatesLoading(false);
    };
    fetchAvailableDates();
  }, []);

  // Récupère les créneaux disponibles pour la date choisie
  const fetchSlots = async (selectedDate) => {
    setSlots([]);
    setTime('');
    if (!selectedDate) return;
    try {
      const data = await availabilityService.getAvailabilityByDate(selectedDate);
      // Gestion flexible du format de réponse
      let slotsArr = [];
      if (Array.isArray(data)) {
        slotsArr = data;
      } else if (Array.isArray(data.slots)) {
        slotsArr = data.slots;
      } else if (Array.isArray(data.availableSlots)) {
        slotsArr = data.availableSlots;
      }
      setSlots(slotsArr);
    } catch (err) {
      setSlots([]);
    }
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
    fetchSlots(e.target.value);
  };

  // handleTimeChange redevient simple :
  const handleTimeChange = (e) => {
    setTime(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      await availabilityService.createReservation({
        number_of_people: numberOfPeople,
        date,
        time,
        note,
      });
      setSuccess('Réservation enregistrée !');
      setDate('');
      setTime('');
      setNumberOfPeople(2);
      setNote('');
      setSlots([]);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la réservation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reservation-form-container">
      <h2>Réserver une table</h2>
      <form onSubmit={handleSubmit} className="reservation-form">
        <label>Date</label>
        <input
          type="date"
          value={date}
          onChange={handleDateChange}
          required
          min={availableDates[0]}
          max={availableDates[availableDates.length - 1]}
          list="available-dates"
          disabled={datesLoading}
          style={{
            backgroundColor: date && !availableDates.includes(date) ? '#ffd6d6' : undefined
          }}
          onMouseOver={e => setHoveredDate(e.target.value)}
          onMouseOut={() => setHoveredDate('')}
        />
        <datalist id="available-dates">
          {availableDates.map(d => (
            <option key={d} value={d} />
          ))}
        </datalist>
        {date && !availableDates.includes(date) && (
          <div className="error-message">Cette date n'est pas disponible à la réservation.</div>
        )}
        <div style={{marginBottom: 8}}>
          <span style={{color: '#2e7d32'}}>Dates disponibles : </span>
          {availableDates.map(d => (
            <span
              key={d}
              style={{
                marginRight: 6,
                fontWeight: d === date ? 'bold' : 'normal',
                textDecoration: d === hoveredDate ? 'underline' : 'none',
                color: d === date ? '#1976d2' : '#333',
                cursor: 'pointer'
              }}
              onClick={() => { setDate(d); fetchSlots(d); }}
              onMouseOver={() => setHoveredDate(d)}
              onMouseOut={() => setHoveredDate('')}
            >
              {d}
            </span>
          ))}
        </div>
        <Inputs
          label="Nombre de personnes"
          type="number"
          min={1}
          max={20}
          value={numberOfPeople}
          onChange={e => setNumberOfPeople(Number(e.target.value))}
          required
        />
        <label>Créneau horaire</label>
        <select value={time} onChange={handleTimeChange} required disabled={slots.length === 0}>
          <option value="">-- Choisir un créneau --</option>
          {slots.map(slot => (
            <option key={slot} value={slot}>{slot}</option>
          ))}
        </select>
        {date && slots.length === 0 && (
          <div className="error-message">Aucun créneau disponible pour cette date.</div>
        )}
        <Inputs
          label="Note (optionnelle)"
          type="text"
          value={note}
          onChange={e => setNote(e.target.value)}
        />
        <PrimaryButton type="submit" disabled={loading}>
          {loading ? 'Réservation...' : 'Réserver'}
        </PrimaryButton>
        {success && <div className="success-message">{success}</div>}
        {error && <div className="error-message">{error}</div>}
      </form>
    </div>
  );
};

export default ReservationForm;
