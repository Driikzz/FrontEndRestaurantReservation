# Resto-TP – Application de réservation de restaurant

## Description

Ce projet est une application web complète de réservation pour restaurant, développée avec React (Vite) pour le frontend et Node.js/Express/Sequelize pour le backend. Elle permet :
- Authentification/inscription (client & admin)
- Gestion des rôles (admin/client)
- Affichage dynamique du menu
- Réservation de tables sur créneaux standards et dates exceptionnelles
- Espace admin : gestion des tables, créneaux, dates exceptionnelles, dashboard
- UX moderne et responsive

## Fonctionnalités principales

### Côté client
- Inscription, connexion, déconnexion
- Réservation sur les créneaux réellement disponibles (prise en compte des jours standards et dates exceptionnelles)
- Affichage des créneaux et dates disponibles dans le formulaire
- Consultation et annulation de ses réservations

### Côté admin
- Dashboard d’administration
- Gestion CRUD des tables
- Gestion CRUD des créneaux standards (par jour de la semaine)
- Gestion CRUD des dates exceptionnelles (ouvertures/fermetures spéciales)
- Attribution automatique des tables lors de la réservation

## Structure du projet

```
resto-tp/
  src/
    components/         # Composants réutilisables (NavBar, Inputs, PrimaryButton...)
    misc/               # Fichiers utilitaires (base_url...)
    screen/             # Pages principales (HomePage, ReservationForm, AdminDashboard...)
    service/            # Services d’appel API (userService, availabilityService...)
    App.jsx             # Routing principal
    App.css             # Styles globaux
```

## Installation & lancement

1. **Cloner le repo**
2. **Installer les dépendances**
   ```bash
   npm install
   ```
3. **Configurer le backend**
   - L’URL du backend est fixée dans `src/misc/base_url.jsx` (par défaut `http://localhost:3000`)
   - Lancer le backend Node/Express/Sequelize fourni
4. **Lancer le frontend**
   ```bash
   npm run dev
   ```
5. Accéder à l’application sur [http://localhost:5173](http://localhost:5173) (ou le port affiché)

## Technologies utilisées
- React 19 (Vite)
- React Router DOM
- Axios
- Node.js / Express / Sequelize (backend)

## Notes importantes
- Les créneaux disponibles sont calculés dynamiquement selon les jours standards et les dates exceptionnelles (ouvertures/fermetures spéciales)
- L’attribution des tables est automatique côté backend
- L’interface admin permet la gestion complète des ressources (tables, créneaux, dates exceptionnelles)
- Le code est organisé pour faciliter l’évolution (ajout de gestion des réservations côté admin, gestion du profil, etc.)

## Auteur
- Rémi S. – ESGI B3

---

Pour toute question ou amélioration, n’hésitez pas à ouvrir une issue ou à me contacter.