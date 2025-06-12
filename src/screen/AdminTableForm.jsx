import React, { useState } from 'react';
import tableService from '../service/tableService';

const AdminTableForm = ({ table, onSuccess, onCancel }) => {
  const [form, setForm] = useState({
    name: table?.name || '',
    seats: table?.seats || '',
    location: table?.location || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (table && table.id) {
        await tableService.updateTable(table.id, form);
      } else {
        await tableService.createTable(form);
      }
      onSuccess();
    } catch (err) {
      setError("Erreur lors de l'enregistrement de la table.");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="table-form">
      <div className="form-group">
        <label className="form-label">Nom de la table</label>
        <input
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          placeholder="Ex: Table 1, Table terrasse..."
          className="form-input"
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Nombre de places</label>
        <input
          name="seats"
          type="number"
          value={form.seats}
          onChange={handleChange}
          placeholder="4"
          className="form-input"
          min="1"
          max="20"
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Emplacement</label>
        <input
          name="location"
          type="text"
          value={form.location}
          onChange={handleChange}
          placeholder="Ex: Salle principale, Terrasse, Près de la fenêtre..."
          className="form-input"
          required
        />
      </div>

      {error && <div className="message message-error">{error}</div>}

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn btn-secondary">
          Annuler
        </button>
        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading ? 'Enregistrement...' : (table ? 'Modifier' : 'Créer')}
        </button>
      </div>
    </form>
  );
};

export default AdminTableForm;
