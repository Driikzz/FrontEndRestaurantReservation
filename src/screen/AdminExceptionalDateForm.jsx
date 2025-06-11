import React, { useState } from 'react';
import availabilityService from '../service/availabilityService';
import PrimaryButton from '../components/PrimaryButton';

const AdminExceptionalDateForm = ({ onSuccess }) => {
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
      setForm((prev) => ({ ...prev, slots: [...prev.slots, { ...slot, duration: Number(slot.duration) }] }));
      setSlot({ time: '', duration: 90 });
    }
  };

  const removeSlot = (idx) => {
    setForm((prev) => ({ ...prev, slots: prev.slots.filter((_, i) => i !== idx) }));
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
      setSuccess('Date exceptionnelle enregistrée !');
      setForm({ date: '', is_closed: false, note: '', slots: [] });
      setSlot({ time: '', duration: 90 });
      if (onSuccess) onSuccess();
    } catch (err) {
      setError("Erreur lors de l'enregistrement de la date exceptionnelle.");
    }
    setLoading(false);
  };

  return (
    <section style={{ margin: '48px 0', background: '#f8fafc', borderRadius: 12, padding: 32 }}>
      <h2 style={{ color: '#007bff', fontSize: 24, marginBottom: 24 }}>Date exceptionnelle</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 400, margin: '0 auto' }}>
        <label>
          Date :
          <input name="date" type="date" value={form.date} onChange={handleChange} required style={{ marginLeft: 8 }} />
        </label>
        <label>
          Fermé ce jour ?
          <input name="is_closed" type="checkbox" checked={form.is_closed} onChange={handleChange} style={{ marginLeft: 8 }} />
        </label>
        <label>
          Note :
          <input name="note" type="text" value={form.note} onChange={handleChange} placeholder="Ex : Fermeture exceptionnelle pour travaux" style={{ marginLeft: 8 }} />
        </label>
        {!form.is_closed && (
          <>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input name="time" type="time" value={slot.time} onChange={handleSlotChange} />
              <input name="duration" type="number" value={slot.duration} onChange={handleSlotChange} min={15} max={240} step={15} style={{ width: 70 }} />
              <PrimaryButton type="button" onClick={addSlot}>Ajouter créneau</PrimaryButton>
            </div>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {form.slots.map((s, idx) => (
                <li key={idx} style={{ margin: '8px 0' }}>
                  {s.time} — {s.duration} min
                  <button type="button" style={{ marginLeft: 12, color: 'red', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => removeSlot(idx)}>Supprimer</button>
                </li>
              ))}
            </ul>
          </>
        )}
        <PrimaryButton type="submit" disabled={loading}>Enregistrer</PrimaryButton>
      </form>
      {error && <div style={{ color: 'red', marginTop: 16 }}>{error}</div>}
      {success && <div style={{ color: 'green', marginTop: 16 }}>{success}</div>}
    </section>
  );
};

export default AdminExceptionalDateForm;
