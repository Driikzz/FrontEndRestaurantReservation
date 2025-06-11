import React from 'react';
import AdminTableForm from './AdminTableForm';
import AdminTableSection from './AdminTableSection';
import AdminOpeningSlots from './AdminOpeningSlots';
import AdminExceptionalDateForm from './AdminExceptionalDateForm';

const AdminDashboard = () => {
  return (
    <div style={{ maxWidth: 900, margin: '40px auto', background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px #e0e7ef', padding: 40 }}>
      <h1 style={{ textAlign: 'center', color: '#222', fontSize: 36, marginBottom: 16 }}>
        Tableau de bord administrateur
      </h1>
      <p style={{ textAlign: 'center', fontSize: 20, color: '#555', marginBottom: 32 }}>
        Bienvenue dans l'espace d'administration du restaurant.<br />
        Ici, vous pouvez gérer les menus, les réservations, les utilisateurs et consulter les statistiques.
      </p>
      <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 32, marginBottom: 48 }}>
        <div style={{ background: '#f8fafc', borderRadius: 12, padding: 32, minWidth: 220, textAlign: 'center', boxShadow: '0 2px 8px #e0e7ef' }}>
          <h2 style={{ color: '#007bff', fontSize: 22 }}>Gestion des menus</h2>
          <p>Ajouter, modifier ou supprimer des plats.</p>
        </div>
        <div style={{ background: '#f8fafc', borderRadius: 12, padding: 32, minWidth: 220, textAlign: 'center', boxShadow: '0 2px 8px #e0e7ef' }}>
          <h2 style={{ color: '#007bff', fontSize: 22 }}>Réservations</h2>
          <p>Consulter et gérer les réservations clients.</p>
        </div>
        <div style={{ background: '#f8fafc', borderRadius: 12, padding: 32, minWidth: 220, textAlign: 'center', boxShadow: '0 2px 8px #e0e7ef' }}>
          <h2 style={{ color: '#007bff', fontSize: 22 }}>Utilisateurs</h2>
          <p>Voir la liste des clients et administrateurs.</p>
        </div>
        <div style={{ background: '#f8fafc', borderRadius: 12, padding: 32, minWidth: 220, textAlign: 'center', boxShadow: '0 2px 8px #e0e7ef' }}>
          <h2 style={{ color: '#007bff', fontSize: 22 }}>Statistiques</h2>
          <p>Visualiser les statistiques du restaurant.</p>
        </div>
      </div>
      <AdminTableSection />
      <AdminOpeningSlots />
      <AdminExceptionalDateForm />
    </div>
  );
};

export default AdminDashboard;
