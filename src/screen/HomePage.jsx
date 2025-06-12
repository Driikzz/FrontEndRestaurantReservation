import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import menuService from '../service/menuService';

const HomePage = () => {
  const [menu, setMenu] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const data = await menuService.getMenu();
        console.log("Menu data received:", data);
        setMenu(data || {});
      } catch (err) {
        console.error("Error fetching menu:", err);
        setError("Erreur lors du chargement du menu.");
        setMenu({});
      }
      setLoading(false);
    };
    fetchMenu();
  }, []);

  // Fonction pour formater le nom des catégories
  const formatCategoryName = (category) => {
    const mapping = {
      'entrée': 'Entrées',
      'plat': 'Plats principaux', 
      'dessert': 'Desserts',
      'boisson': 'Boissons'
    };
    return mapping[category] || category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <div className="container">
      <div className="card">
        {/* Section Hero */}
        <div className="hero-section">
          <h1 className="title-hero">Le Gourmet Parisien</h1>
          <p className="title-sub">
            Une expérience culinaire authentique au cœur de Paris
          </p>
          <Link to="/reserver" className="btn btn-large" style={{background: 'white', color: '#6c5ce7'}}>
            Réserver une table
          </Link>
        </div>

        {/* Section Présentation */}
        <div className="text-center mb-30">
          <h2 className="title-section">Bienvenue dans notre restaurant</h2>
          <p style={{fontSize: '16px', color: '#636e72', maxWidth: '600px', margin: '0 auto'}}>
            Depuis 1995, nous vous proposons une cuisine française traditionnelle revisitée, 
            préparée avec des produits frais et de saison. Notre chef étoilé vous invite à 
            découvrir ses créations dans un cadre chaleureux et élégant.
          </p>
        </div>

        {/* Section Caractéristiques */}
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">👨‍🍳</div>
            <h3 className="feature-title">Chef Étoilé</h3>
            <p className="feature-desc">
              Notre chef doublement étoilé vous propose une cuisine d'exception
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌱</div>
            <h3 className="feature-title">Produits Frais</h3>
            <p className="feature-desc">
              Sélection quotidienne des meilleurs produits du marché
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🍷</div>
            <h3 className="feature-title">Cave d'Exception</h3>
            <p className="feature-desc">
              Plus de 300 références soigneusement sélectionnées
            </p>
          </div>
        </div>

        {/* Section Menu */}
        <div className="menu-section">
          <h2 className="title-section">Notre Carte</h2>
          
          {loading ? (
            <div className="text-center">
              <p style={{color: '#636e72'}}>⏳ Chargement du menu...</p>
            </div>
          ) : error ? (
            <div className="message message-error">
              {error}
            </div>
          ) : Object.keys(menu).length > 0 ? (
            <div className="menu-grid">
              {Object.entries(menu).map(([category, items]) => (
                items.length > 0 && (
                  <div key={category} className="menu-category">
                    <h3>{formatCategoryName(category)}</h3>
                    {items.map((item) => (
                      <div key={item.id} className="menu-item">
                        <div className="menu-info">
                          <h4>{item.name}</h4>
                          <p className="menu-desc">{item.description}</p>
                        </div>
                        <div className="menu-price">{item.price}€</div>
                      </div>
                    ))}
                  </div>
                )
              ))}
            </div>
          ) : (
            <div className="text-center" style={{gridColumn: '1 / -1'}}>
              <div className="feature-card">
                <div className="feature-icon">🍽️</div>
                <h3 className="feature-title">Menu temporairement indisponible</h3>
                <p className="feature-desc">
                  Notre équipe met à jour la carte. Contactez-nous pour connaître les plats du jour !
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Section Informations */}
        <div className="features-grid" style={{marginTop: '40px'}}>
          <div className="feature-card">
            <div className="feature-icon">📍</div>
            <h3 className="feature-title">Adresse</h3>
            <p className="feature-desc">
              123 Rue de la Gastronomie<br />
              75001 Paris
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⏰</div>
            <h3 className="feature-title">Horaires</h3>
            <p className="feature-desc">
              Mar-Sam : 12h-14h & 19h-22h<br />
              Fermé dimanche et lundi
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📞</div>
            <h3 className="feature-title">Contact</h3>
            <p className="feature-desc">
              01 42 33 44 55<br />
              contact@gourmet-parisien.fr
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-20">
          <h3 style={{color: '#6c5ce7', marginBottom: '16px'}}>Prêt pour une expérience inoubliable ?</h3>
          <Link to="/reserver" className="btn btn-primary btn-large">
            Réserver maintenant
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
