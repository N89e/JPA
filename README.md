# Portfolio Personnel

Portfolio moderne et responsive développé avec Node.js, Express et Vanilla JavaScript.

## 📋 Structure du Projet

```
portfolio/
├── backend/              # API Express.js
│   ├── src/
│   │   ├── server.js
│   │   ├── routes/       # Routes API
│   │   ├── controllers/   # Contrôleurs
│   │   ├── models/        # Modèles de données
│   │   ├── middleware/    # Middlewares
│   │   └── config/        # Configuration
│   └── package.json
├── frontend/             # Application SPA
│   ├── src/
│   │   ├── index.html    # Page principale
│   │   ├── assets/
│   │   │   ├── css/      # Feuilles de style
│   │   │   ├── js/       # Scripts JavaScript
│   │   │   └── images/   # Images et ressources
│   │   └── pages/        # Contenu des sections
│   └── package.json
└── README.md
```

## 🚀 Installation

### Backend
```bash
cd backend
npm install
```

### Frontend
Pas de dépendances externes requises (HTML/CSS/JS vanilla)

## 🛠️ Démarrage

### Backend (Terminal 1)
```bash
cd backend
npm run dev  # Mode développement avec nodemon
```

### Frontend (Terminal 2)
```bash
cd frontend
npm start
# Ou ouvrir index.html directement dans le navigateur
```

## 📱 Sections du Portfolio

- **Accueil** - Présentation principale
- **À Propos** - Informations personnelles et compétences
- **Services** - Services offerts
- **Projets** - Portfolio de projets
- **Contact** - Formulaire de contact
- **Footer** - Informations supplémentaires

## 📱 Responsive Design

- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## 🌐 Déploiement sur OVH

Configuration incluse pour le déploiement sur serveurs OVH avec :
- Support Node.js
- HTTPS automatique
- Performance optimisée

## 📝 Licence

MIT
