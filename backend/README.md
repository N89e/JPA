# Configuration du Backend

- **PORT**: Port d'écoute du serveur (par défaut: 5000)
- **NODE_ENV**: Environnement (development/production)
- **FRONTEND_URL**: URL du frontend pour CORS

## Configuration Email

Pour activer l'envoi d'emails depuis le formulaire de contact:

1. Utiliser Gmail App Password:
   - Activer 2FA sur le compte Gmail
   - Générer un "App Password"
   - EMAIL_USER: votre_email@gmail.com
   - EMAIL_PASS: le mot de passe généré

2. OU utiliser un service SMTP comme Mailgun, SendGrid, etc.

## Installation

```bash
cd backend
npm install
```

## Démarrage

```bash
# Mode développement
npm run dev

# Mode production
npm start
```

## Structure des fichiers

- `src/server.js` - Entrée principale du serveur
- `src/routes/` - Définition des routes API
- `src/controllers/` - Logique métier
- `src/models/` - Modèles de données (si DB utilisée)
- `src/middleware/` - Middlewares personnalisés
- `src/config/` - Fichiers de configuration
