import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminTableSection from './AdminTableSection';
import AdminOpeningSlots from './AdminOpeningSlots';
import AdminExceptionalDateForm from './AdminExceptionalDateForm';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', name: 'Vue d\'ensemble' },
    { id: 'reservations', name: 'Réservations' },
    { id: 'tables', name: 'Tables' },
    { id: 'horaires', name: 'Horaires' },
    { id: 'exceptions', name: 'Dates exceptionnelles' },
  ];

  return (
    <div className="container-wide">
      {/* Header Admin */}
      <div className="admin-header">
        <h1 className="title-hero" style={{color: 'white', marginBottom: '8px'}}>
          Administration
        </h1>
        <p className="title-sub" style={{color: 'rgba(255,255,255,0.9)'}}>
          Gérez votre restaurant en toute simplicité
        </p>
      </div>

      {/* Navigation Admin */}
      <div className="admin-nav">
        {sections.map(section => (
          <button
            key={section.id}
            className={`admin-nav-btn ${activeSection === section.id ? 'active' : ''}`}
            onClick={() => setActiveSection(section.id)}
          >
            {section.name}
          </button>
        ))}
      </div>

      {/* Contenu selon la section active */}
      {activeSection === 'overview' && (
        <div className="admin-section">
          <h2>Vue d'ensemble</h2>
          
          <div className="admin-overview-grid">
            <div className="overview-card">
              <h3>Gestion des Réservations</h3>
              <p>Voir toutes les réservations, valider ou annuler les demandes clients</p>
              <Link to="/reservations" className="btn btn-primary">
                Gérer les réservations
              </Link>
            </div>
            
            <div className="overview-card">
              <h3>Configuration des Tables</h3>
              <p>Ajouter, modifier ou supprimer les tables du restaurant</p>
              <button 
                className="btn btn-secondary"
                onClick={() => setActiveSection('tables')}
              >
                Configurer les tables
              </button>
            </div>

            <div className="overview-card">
              <h3>Horaires d'Ouverture</h3>
              <p>Définir les créneaux horaires d'ouverture par jour de la semaine</p>
              <button 
                className="btn btn-secondary"
                onClick={() => setActiveSection('horaires')}
              >
                Gérer les horaires
              </button>
            </div>

            <div className="overview-card">
              <h3>Dates Exceptionnelles</h3>
              <p>Gérer les fermetures et horaires spéciaux (jours fériés, événements)</p>
              <button 
                className="btn btn-secondary"
                onClick={() => setActiveSection('exceptions')}
              >
                Gérer les exceptions
              </button>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'reservations' && (
        <div className="admin-section">
          <h2>Gestion des Réservations</h2>
          <div className="text-center mb-20">
            <Link to="/reservations" className="btn btn-primary btn-large">
              Accéder à la gestion complète
            </Link>
          </div>
          <p className="text-center" style={{color: '#636e72'}}>
            Accédez à la page dédiée pour gérer toutes les réservations, 
            les valider, les annuler et filtrer par date ou statut.
          </p>
        </div>
      )}

      {activeSection === 'tables' && (
        <div className="admin-section">
          <AdminTableSection />
        </div>
      )}

      {activeSection === 'horaires' && (
        <div className="admin-section">
          <AdminOpeningSlots />
        </div>
      )}

      {activeSection === 'exceptions' && (
        <div className="admin-section">
          <AdminExceptionalDateForm />
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

