import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = ({ onLogout }) => {
  const userRole = localStorage.getItem('role');

  return (
    <nav className="navbar">
      <Link to="/home" className="navbar-brand">
        Les gourmands
      </Link>
      
      <div className="navbar-links">
        <Link to="/home">Accueil</Link>
        <Link to="/reserver">Réserver</Link>
        <Link to="/mes-reservations">Mes Réservations</Link>
        {userRole === 'admin' && (
          <>
            <Link to="/admin">Admin</Link>
            <Link to="/reservations">Réservations</Link>
          </>
        )}
      </div>
      
      <div className="navbar-right">
        <button onClick={onLogout} className="btn-logout">
          Déconnexion
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
