import React, { useEffect, useState } from 'react';
import availabilityService from '../service/availabilityService';
import PrimaryButton from '../components/PrimaryButton';

const days = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];

const AdminOpeningSlots = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ day_of_week: 0, time: '', duration: 90, is_active: true });
  const [success, setSuccess] = useState('');
  const [editMode, setEditMode] = useState(false);

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
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
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
        setSuccess('Créneau modifié !');
      } else {
        await availabilityService.createOrUpdateOpeningSlot({
          ...form,
          day_of_week: Number(form.day_of_week),
          duration: Number(form.duration),
        });
        setSuccess('Créneau enregistré !');
      }
      setForm({ day_of_week: 0, time: '', duration: 90, is_active: true });
      setEditMode(false);
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
    setSuccess('');
    setError('');
  };

  const handleCancel = () => {
    setForm({ day_of_week: 0, time: '', duration: 90, is_active: true });
    setEditMode(false);
    setSuccess('');
    setError('');
  };

  return (
    <section style={{ margin: '48px 0', background: '#f8fafc', borderRadius: 12, padding: 32 }}>
      <h2 style={{ color: '#007bff', fontSize: 24, marginBottom: 24 }}>Créneaux standards</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', marginBottom: 24 }}>
        <label>
          Jour :
          <select name="day_of_week" value={form.day_of_week} onChange={handleChange} style={{ marginLeft: 8 }}>
            {days.map((d, i) => <option key={i} value={i}>{d}</option>)}
          </select>
        </label>
        <label>
          Heure :
          <input name="time" type="time" value={form.time} onChange={handleChange} required style={{ marginLeft: 8 }} />
        </label>
        <label>
          Durée (min) :
          <input name="duration" type="number" value={form.duration} onChange={handleChange} min={15} max={240} step={15} style={{ marginLeft: 8, width: 70 }} />
        </label>
        <label>
          Actif :
          <input name="is_active" type="checkbox" checked={form.is_active} onChange={handleChange} style={{ marginLeft: 8 }} />
        </label>
        <PrimaryButton type="submit">{editMode ? 'Modifier' : 'Enregistrer'}</PrimaryButton>
        {editMode && <PrimaryButton type="button" style={{ background: '#aaa' }} onClick={handleCancel}>Annuler</PrimaryButton>}
      </form>
      {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
      {success && <div style={{ color: 'green', marginBottom: 16 }}>{success}</div>}
      {loading ? (
        <div style={{ color: '#888', textAlign: 'center' }}>Chargement...</div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, maxWidth: 600, margin: '0 auto' }}>
          {slots.length > 0 ? slots.map((slot, idx) => (
            <li key={slot.id || idx} style={{ borderBottom: '1px solid #eee', padding: '12px 0', cursor: 'pointer' }} onClick={() => handleEdit(slot)}>
              <b>{days[slot.day_of_week]}</b> à {slot.time} — {slot.duration} min — {slot.is_active ? 'Actif' : 'Inactif'}
            </li>
          )) : <li style={{ color: '#888', textAlign: 'center' }}>Aucun créneau enregistré.</li>}
        </ul>
      )}
    </section>
  );
};

export default AdminOpeningSlots;
