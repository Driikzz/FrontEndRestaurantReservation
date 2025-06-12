# Resto-TP – Application de réservation de restaurant

## Description

Ce projet est une application web complète de réservation pour restaurant, développée avec React (Vite) pour le frontend et Node.js/Express/Sequelize pour le backend. Elle permet :
- Authentification/inscription (client & admin)
- Gestion des rôles (admin/client)
- Affichage dynamique du menu (composant réutilisable)
- Réservation de tables sur créneaux standards et dates exceptionnelles
- Sélection UX des dates et créneaux : calendrier interactif, affichage lisible des horaires et jours
- Espace admin : gestion des tables, créneaux, dates exceptionnelles, dashboard
- Attribution automatique des tables lors de la réservation
- Consultation/annulation de ses réservations côté client
- Design moderne, responsive, messages d’erreur/succès, feedback utilisateur

## Fonctionnalités réalisées

### Côté client
- [x] Inscription, connexion, déconnexion
- [x] Sélection de la date sur calendrier interactif (affichage explicite : lundi 16 juin...)
- [x] Sélection des créneaux horaires (affichage lisible : 10h22)
- [x] Réservation uniquement sur les créneaux réellement disponibles (prise en compte jours standards ET dates exceptionnelles)
- [x] Consultation et annulation de ses réservations
- [x] Affichage dynamique du menu via composant `MenuSection`
- [x] Feedback UX (chargement, erreurs, succès, validation des champs)

### Côté admin
- [x] Dashboard d’administration
- [x] Gestion CRUD des tables
- [x] Gestion CRUD des créneaux standards (par jour de la semaine)
- [x] Gestion CRUD des dates exceptionnelles (ouvertures/fermetures spéciales)
- [x] Attribution automatique des tables lors de la réservation
- [x] Navigation adaptée selon le rôle (boutons admin/réserver/mes réservations)

### Technique & UX
- [x] Routing React Router DOM avec redirections selon l’authentification et le rôle
- [x] Stockage du token, rôle et prénom dans localStorage
- [x] Services API centralisés (userService, availabilityService, menuService, tableService)
- [x] Composants réutilisables (Inputs, PrimaryButton, MenuSection, NavBar...)
- [x] Design responsive, moderne, messages d’erreur/succès, feedback utilisateur
- [x] Code commenté et structuré (explications physiques pour la simulation, etc.)

## Structure du projet

```
resto-tp/
  src/
    components/         # Composants réutilisables (NavBar, Inputs, PrimaryButton, MenuSection...)
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
- Lorenzo F. - ESGI B3
- Nohlan H. - ESGI B3

---
