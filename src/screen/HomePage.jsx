import React, { useEffect, useState } from 'react';
import menuService from '../service/menuService';

const HomePage = () => {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const data = await menuService.getMenu();
        setMenu(data);
        console.log("Menu loaded:", data);
      } catch (err) {
        setError("Erreur lors du chargement du menu.");
      }
      setLoading(false);
    };
    fetchMenu();
  }, []);

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px #e0e7ef', padding: 40, fontFamily: 'Segoe UI, Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#b22222', fontSize: 38, marginBottom: 8, fontWeight: 700 }}>
        Le Gourmet Parisien
      </h1>
      <h2 style={{ textAlign: 'center', color: '#555', fontWeight: 400, fontSize: 22, marginBottom: 32 }}>
        Restaurant français raffiné & ambiance chaleureuse
      </h2>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
        <img src="/vite.svg" alt="Logo resto" style={{ width: 90, opacity: 0.8, borderRadius: 12 }} />
      </div>
      <p style={{ textAlign: 'center', fontSize: 19, color: '#333', marginBottom: 32, fontWeight: 400 }}>
        Bienvenue au <b>Gourmet Parisien</b> !<br />
        Découvrez une cuisine authentique, des produits frais et une carte de vins sélectionnée avec soin.<br />
        Réservez votre table en ligne et vivez une expérience gastronomique unique au cœur de Paris.
      </p>
      <h3 style={{ textAlign: 'center', color: '#007bff', fontWeight: 600, fontSize: 24, margin: '32px 0 16px 0' }}>Notre menu</h3>
      {loading ? (
        <div style={{ textAlign: 'center', color: '#888', fontSize: 18 }}>Chargement du menu...</div>
      ) : error ? (
        <div style={{ textAlign: 'center', color: 'red', fontSize: 18 }}>{error}</div>
      ) : (
        <ul style={{ maxWidth: 500, margin: '0 auto', fontSize: 18, color: '#444', lineHeight: 1.7, padding: 0, listStyle: 'none' }}>
          {menu && menu.length > 0 ? menu.map((item, idx) => (
            <li key={item.id || idx} style={{ borderBottom: '1px solid #eee', padding: '12px 0' }}>
              <span style={{ fontWeight: 600 }}>{item.name}</span> <span style={{ color: '#888', fontSize: 15 }}>- {item.price} €</span>
              <br />
              <span style={{ color: '#666', fontSize: 15 }}>{item.description}</span>
            </li>
          )) : <li style={{ textAlign: 'center', color: '#888' }}>Aucun plat disponible pour le moment.</li>}
        </ul>
      )}
      <div style={{ textAlign: 'center', marginTop: 40 }}>
        <span style={{ color: '#b22222', fontWeight: 600, fontSize: 22 }}>
          À très bientôt chez nous !
        </span>
      </div>
    </div>
  );
};

export default HomePage;
