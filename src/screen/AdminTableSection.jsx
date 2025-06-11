import React, { useEffect, useState } from 'react';
import tableService from '../service/tableService';
import AdminTableForm from './AdminTableForm';
import PrimaryButton from '../components/PrimaryButton';

const AdminTableSection = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editTable, setEditTable] = useState(null);

  const fetchTables = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await tableService.getTables();
      setTables(data.tables || data); // selon la structure de la réponse
    } catch (err) {
      setError("Erreur lors du chargement des tables.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const handleEdit = (table) => {
    setEditTable(table);
    setShowForm(true);
  };

  const handleCreate = () => {
    setEditTable(null);
    setShowForm(true);
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditTable(null);
    fetchTables();
  };

  return (
    <section style={{ margin: '48px 0', background: '#f8fafc', borderRadius: 12, padding: 32 }}>
      <h2 style={{ color: '#007bff', fontSize: 24, marginBottom: 24 }}>Gestion des tables</h2>
      <div style={{ textAlign: 'right', marginBottom: 24 }}>
        <PrimaryButton onClick={handleCreate}>Créer une table</PrimaryButton>
      </div>
      {loading ? (
        <div style={{ color: '#888', textAlign: 'center' }}>Chargement...</div>
      ) : error ? (
        <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, maxWidth: 600, margin: '0 auto' }}>
          {tables.length > 0 ? tables.map((table) => (
            <li key={table.id} style={{ borderBottom: '1px solid #eee', padding: '12px 0', cursor: 'pointer' }} onClick={() => handleEdit(table)}>
              <b>{table.name}</b> — {table.seats} places — {table.location}
            </li>
          )) : <li style={{ color: '#888', textAlign: 'center' }}>Aucune table enregistrée.</li>}
        </ul>
      )}
      {showForm && (
        <div style={{ marginTop: 32 }}>
          <AdminTableForm table={editTable} onSuccess={handleSuccess} />
        </div>
      )}
    </section>
  );
};

export default AdminTableSection;
