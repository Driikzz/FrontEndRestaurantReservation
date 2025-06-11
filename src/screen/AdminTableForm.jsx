import React, { useState } from 'react';
import tableService from '../service/tableService';
import Input from '../components/Inputs';
import PrimaryButton from '../components/PrimaryButton';

const AdminTableForm = ({ table, onSuccess }) => {
  const [form, setForm] = useState({
    name: table?.name || '',
    seats: table?.seats || '',
    location: table?.location || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      if (table && table.id) {
        await tableService.updateTable(table.id, form);
        setSuccess('Table modifiée avec succès !');
      } else {
        await tableService.createTable(form);
        setSuccess('Table créée avec succès !');
        setForm({ name: '', seats: '', location: '' });
      }
      if (onSuccess) onSuccess();
    } catch (err) {
      setError("Erreur lors de l'enregistrement de la table.");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '0 auto', padding: 24, border: '1px solid #eee', borderRadius: 8, background: '#fafbfc' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>{table ? 'Modifier une table' : 'Créer une table'}</h2>
      <Input label="Nom de la table" name="name" value={form.name} onChange={handleChange} placeholder="Ex : Table Fenêtre" />
      <Input label="Nombre de places" name="seats" type="number" value={form.seats} onChange={handleChange} placeholder="Ex : 4" min={1} />
      <Input label="Emplacement" name="location" value={form.location} onChange={handleChange} placeholder="Ex : Près de la fenêtre" />
      <div style={{ textAlign: 'center', marginTop: 16 }}>
        <PrimaryButton type="submit" disabled={loading}>{table ? 'Modifier' : 'Créer'}</PrimaryButton>
      </div>
      {error && <div style={{ color: 'red', textAlign: 'center', marginTop: 16 }}>{error}</div>}
      {success && <div style={{ color: 'green', textAlign: 'center', marginTop: 16 }}>{success}</div>}
    </form>
  );
};

export default AdminTableForm;
