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
      setTables(data.tables || data);
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

  const handleCancel = () => {
    setShowForm(false);
    setEditTable(null);
  };

  return (
    <div>
      <div className="section-header">
        <h2>Gestion des Tables</h2>
        <button onClick={handleCreate} className="btn btn-primary">
          Nouvelle table
        </button>
      </div>

      {loading ? (
        <div className="loading">Chargement des tables...</div>
      ) : error ? (
        <div className="message message-error">{error}</div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Capacité</th>
                <th>Emplacement</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tables.length > 0 ? tables.map((table) => (
                <tr key={table.id}>
                  <td className="table-name">{table.name}</td>
                  <td>{table.seats} personnes</td>
                  <td>{table.location}</td>
                  <td>
                    <button 
                      onClick={() => handleEdit(table)}
                      className="btn btn-secondary btn-small"
                    >
                      Modifier
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    Aucune table enregistrée
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="form-overlay">
          <div className="form-modal">
            <div className="modal-header">
              <h3>{editTable ? 'Modifier la table' : 'Nouvelle table'}</h3>
              <button onClick={handleCancel} className="btn-close">×</button>
            </div>
            <AdminTableForm 
              table={editTable} 
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTableSection;
