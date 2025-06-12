import React from 'react';

const formatCategoryName = (category) => {
  const mapping = {
    'entrée': 'Entrées',
    'plat': 'Plats principaux',
    'dessert': 'Desserts',
    'boisson': 'Boissons'
  };
  return mapping[category] || category.charAt(0).toUpperCase() + category.slice(1);
};

const MenuSection = ({ menu, loading, error }) => {
  return (
    <div className="menu-section">
      <h2 className="title-section">Notre Carte</h2>
      {loading ? (
        <div className="text-center">
          <p style={{color: '#636e72'}}>Chargement du menu...</p>
        </div>
      ) : error ? (
        <div className="message message-error">{error}</div>
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
  );
};

export default MenuSection;
