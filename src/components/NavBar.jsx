import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = ({ onLogout, isAuthenticated, userRole }) => {
  // Récupération du rôle depuis le localStorage (à adapter selon ta logique réelle)
  const prenom = 'Rémi';
  const role = localStorage.getItem('role') || 'client';

  return (
    <nav className="navbar">
      <div className="navbar__left">
        <span className="navbar__prenom">Bienvenue, {prenom} !</span>
        <Link to="/home" className="navbar__link">Accueil</Link>
        {(userRole === 'client' || role === 'admin') && (
          <>
            <li><a href="/reserver">Réserver</a></li>
            <li><a href="/mes-reservations">Mes réservations</a></li>
          </>
        )}
        {role === 'admin' && (
          <Link to="/admin" className="navbar__admin">Espace admin</Link>
        )}
      </div>
      <div className="navbar__right">
        <button onClick={onLogout} className="navbar__logout">Déconnexion</button>
      </div>
    </nav>
  );
};

export default NavBar;
