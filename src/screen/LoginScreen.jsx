import React, { useState } from 'react';
import userService from '../service/userService';
import Input from '../components/Inputs';
import PrimaryButton from '../components/PrimaryButton';
import { useNavigate } from 'react-router-dom';

const LoginScreen = ({ setIsAuthenticated }) => {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await userService.login(form);
      if (data && data.token) {
        localStorage.setItem('token', data.token);
        if (data.role) {
          localStorage.setItem('role', data.role);
        } else if (data.user && data.user.role) {
          localStorage.setItem('role', data.user.role);
        }
        if (data.firstname) {
          localStorage.setItem('firstname', data.firstname);
        } else if (data.user && data.user.firstname) {
          localStorage.setItem('firstname', data.user.firstname);
        }
        setIsAuthenticated(true);
        navigate('/home');
      } else {
        setError('Identifiants invalides.');
      }
    } catch (err) {
      setError("Erreur lors de la connexion. Veuillez réessayer.");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '0 auto', padding: 24, border: '1px solid #eee', borderRadius: 8 }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Connexion</h2>
      <Input label="Adresse email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="Entrez votre email" />
      <Input label="Mot de passe" name="password" type="password" value={form.password} onChange={handleChange} placeholder="Entrez votre mot de passe" />
      <div style={{ textAlign: 'center', marginTop: 16 }}>
        <PrimaryButton type="submit" disabled={loading}>Se connecter</PrimaryButton>
      </div>
      {error && <div style={{ color: 'red', textAlign: 'center', marginTop: 16 }}>{error}</div>}
    </form>
  );
};

export default LoginScreen;
