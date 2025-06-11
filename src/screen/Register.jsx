import React, { useState } from 'react';
import userService from '../service/userService';
import Input from '../components/Inputs';
import PrimaryButton from '../components/PrimaryButton';

const Register = () => {
  const [form, setForm] = useState({
    email: '',
    firstname: '',
    lastname: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'client',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (form.password !== form.confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    setLoading(true);
    try {
      await userService.register({
        email: form.email,
        firstname: form.firstname,
        lastname: form.lastname,
        phone: form.phone,
        password: form.password,
        role: form.role,
      });
      setSuccess('Compte créé avec succès !');
      setForm({ email: '', firstname: '', lastname: '', phone: '', password: '', confirmPassword: '', role: 'client' });
    } catch (err) {
      setError("Erreur lors de l'inscription. Veuillez réessayer.");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '0 auto', padding: 24, border: '1px solid #eee', borderRadius: 8 }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Inscription</h2>
      <Input label="Adresse email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="Entrez votre email" />
      <Input label="Prénom" name="firstname" value={form.firstname} onChange={handleChange} placeholder="Entrez votre prénom" />
      <Input label="Nom" name="lastname" value={form.lastname} onChange={handleChange} placeholder="Entrez votre nom" />
      <Input label="Téléphone" name="phone" value={form.phone} onChange={handleChange} placeholder="Entrez votre numéro de téléphone" />
      <Input label="Mot de passe" name="password" type="password" value={form.password} onChange={handleChange} placeholder="Entrez votre mot de passe" />
      <Input label="Confirmer le mot de passe" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} placeholder="Confirmez votre mot de passe" />
      <div style={{ textAlign: 'center', marginTop: 16 }}>
        <PrimaryButton type="submit" disabled={loading}>S'inscrire</PrimaryButton>
      </div>
      {error && <div style={{ color: 'red', textAlign: 'center', marginTop: 16 }}>{error}</div>}
      {success && <div style={{ color: 'green', textAlign: 'center', marginTop: 16 }}>{success}</div>}
    </form>
  );
};

export default Register;
