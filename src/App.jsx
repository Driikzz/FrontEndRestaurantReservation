import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import LoginScreen from './screen/LoginScreen';
import Register from './screen/Register';
import HomePage from './screen/HomePage';
import NavBar from './components/NavBar';
import AdminDashboard from './screen/AdminDashboard';
import ReservationForm from './screen/ReservationForm';
import MyReservations from './screen/MyReservations';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const handleStorage = () => setIsAuthenticated(!!localStorage.getItem('token'));
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsAuthenticated(false);
  };

  // Protection de la route admin : accessible uniquement si admin
  const isAdmin = localStorage.getItem('role') === 'admin';

  return (
    <Router>
      {isAuthenticated && <NavBar onLogout={handleLogout} />}
      {!isAuthenticated && (
        <nav style={{ display: 'flex', justifyContent: 'center', gap: 16, margin: 24 }}>
          <Link to="/login">Connexion</Link>
          <Link to="/register">Inscription</Link>
        </nav>
      )}
      <Routes>
        <Route path="/" element={<Navigate to={isAuthenticated ? '/home' : '/login'} />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/home" /> : <LoginScreen setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/home" /> : <Register />} />
        <Route path="/home" element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/admin" element={isAuthenticated && isAdmin ? <AdminDashboard /> : <Navigate to="/home" />} />
        <Route path="/reserver" element={isAuthenticated ? <ReservationForm /> : <Navigate to="/login" />} />
        <Route path="/mes-reservations" element={isAuthenticated ? <MyReservations /> : <Navigate to="/login" />} />
        {/* Ajoute d'autres routes protégées ici si besoin */}
      </Routes>
    </Router>
  );
}

export default App;
