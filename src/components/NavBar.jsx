import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = ({ onLogout }) => {
  const userRole = localStorage.getItem('role');
  const userFirstname = localStorage.getItem('firstname');

  return (
    <nav className="navbar">
      <Link to="/home" className="navbar-brand">
        🍽️ Le Gourmet
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
        {userFirstname && (
          <span className="navbar-user">Bonjour {userFirstname}</span>
        )}
        <button onClick={onLogout} className="btn-logout">
          Déconnexion
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
