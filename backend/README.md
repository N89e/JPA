# 🔧 Backend API - Portfolio

API REST développée avec **Node.js** et **Express.js** pour gérer les données du portfolio.

---

## 🎯 Fonctionnalités

✅ **Endpoints API**
- `GET /api/projects` - Récupérer tous les projets
- `POST /api/contact` - Envoyer un message de contact
- `GET /api/services` - Récupérer les services

✅ **Sécurité**
- Rate limiting (5 requêtes par 15 minutes par IP)
- Validation des inputs
- Sanitisation XSS (DOMPurify)
- CORS configuré
- Headers de sécurité

✅ **Email**
- Intégration Nodemailer
- Support Gmail App Passwords
- Service SMTP générique

✅ **Tests & Monitoring**
- Vitest pour tests unitaires
- Coverage reports
- Logging (logger.js)

---

## 📋 Structure

```
backend/
├── src/
│   ├── server.js                    # Point d'entrée (dev)
│   ├── server-prod.js               # Point d'entrée (prod)
│   ├── routes/
│   │   ├── contact.js               # Route contact
│   │   ├── contact-prod.js          # Route contact (prod)
│   │   ├── projects.js              # Route projects
│   │   └── services.js              # Route services
│   ├── controllers/
│   │   ├── contactController.js     # Logique contact
│   │   ├── projectsController.js    # Logique projects
│   │   └── servicesController.js    # Logique services
│   ├── middleware/
│   │   ├── rateLimiter.js          # Rate limiting
│   │   └── validation.js            # Validation inputs
│   ├── services/
│   │   └── emailService.js          # Service email
│   ├── config/                      # Configuration
│   └── utils/
│       └── logger.js                # Logger
├── tests/
│   └── validation.test.js           # Tests unitaires
├── package.json
├── vitest.config.js
├── Procfile                         # Config Heroku
└── README.md
```

---

## 🚀 Installation & Démarrage

### Installation
```bash
cd backend
npm install
```

### Mode Développement
```bash
npm run dev
# Démarre sur http://localhost:5000
# Auto-reload avec nodemon
```

### Mode Production
```bash
npm start
# Utilise server-prod.js
```

### Tests
```bash
npm test                # Lancer les tests
npm run test:ui         # UI interactive
npm run test:coverage   # Rapport de couverture
```

---

## 🔑 Configuration (.env)

```env
# Serveur
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Email (optionnel - utilisé par /api/contact)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_TO=recipient@example.com

# Security
RATE_LIMIT_WINDOW=15         # minutes
RATE_LIMIT_MAX_REQUESTS=5    # requêtes par window
```

### Configuration Email

#### Option 1: Gmail App Password (Recommandé)
```bash
# 1. Activer 2FA: https://myaccount.google.com/security
# 2. Générer App Password: https://myaccount.google.com/apppasswords
# 3. Configurer dans .env:
EMAIL_USER=votre_email@gmail.com
EMAIL_PASS=votre_app_password_genere
EMAIL_TO=contact@example.com
```

#### Option 2: SMTP Générique
```env
# Utiliser un service comme Mailgun, SendGrid, OVH:
EMAIL_USER=smtp_user
EMAIL_PASS=smtp_password
# Modifier src/services/emailService.js pour le host SMTP
```

#### Option 3: Service Email Cloud
- Mailgun, SendGrid, AWS SES, etc.
- Modifier `emailService.js` pour l'intégration

---

## 📡 Routes API

### 1. GET /api/projects
Récupère la liste des projets.

**Réponse:**
```json
[
  {
    "id": "1",
    "title": "AirSphereConnect",
    "description": "Application de management...",
    "image": "url",
    "technologies": ["React", "Node.js"],
    "link": "https://..."
  }
]
```

**Rate Limited:** ❌ Non

---

### 2. POST /api/contact
Envoie un message de contact.

**Rate Limited:** ✅ Oui (5 requêtes/15min par IP)

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Collaboration",
  "message": "Intéressé par..."
}
```

**Validation:**
- `name`: Lettres + espaces uniquement, max 100 chars
- `email`: Format email valide, max 254 chars
- `subject`: Lettres + espaces, max 200 chars
- `message`: Any chars, max 5000 chars

**Réponse Success (200):**
```json
{
  "success": true,
  "message": "Message envoyé avec succès"
}
```

**Réponse Error (400/429):**
```json
{
  "success": false,
  "message": "Erreur validation / Rate limit exceeded"
}
```

---

### 3. GET /api/services
Récupère la liste des services.

**Réponse:**
```json
[
  {
    "id": "1",
    "title": "Pilotage de Projets",
    "description": "Expertise Agile...",
    "icon": "fas fa-project-diagram"
  }
]
```

**Rate Limited:** ❌ Non

---

## 🔒 Middleware & Sécurité

### rateLimiter.js
```javascript
// Limite: 5 requêtes par 15 minutes par IP
app.use('/api/contact', rateLimiter);
```

### validation.js
```javascript
// Valide les inputs du formulaire
// Vérifie les patterns, longueurs, etc.
validateContactForm(data)
```

### emailService.js
```javascript
// Envoie les emails via Nodemailer
// Support Gmail, SMTP générique
sendContactEmail(name, email, subject, message)
```

---

## 🧪 Tests

### Lancer les tests
```bash
npm test
# Vitest découvre automatiquement les fichiers *.test.js
```

### Coverage
```bash
npm run test:coverage
# Génère un rapport de couverture
```

### Fichiers de test
```
tests/
└── validation.test.js          # Tests du validation middleware
```

---

## 📊 Endpoints & Statuts

| Method | Route | Rate Limited | Auth | Description |
|--------|-------|-------------|------|-------------|
| GET | `/api/projects` | ❌ | ❌ | Récupère les projets |
| GET | `/api/services` | ❌ | ❌ | Récupère les services |
| POST | `/api/contact` | ✅ | ❌ | Envoie un message |

---

## 🚀 Déploiement

### Développement (Local)
```bash
npm run dev
```

### Production (OVH/Heroku)
```bash
npm start
# Utilise server-prod.js
# Écoute sur port 5000 par défaut
```

### Docker
```bash
# Créé automatiquement par docker-compose.yml
docker-compose up
```

---

## 📚 Dépendances Principales

| Package | Version | Usage |
|---------|---------|-------|
| express | ^4.18.2 | Web framework |
| cors | ^2.8.5 | CORS middleware |
| dotenv | ^16.0.3 | Environment variables |
| nodemailer | ^6.9.1 | Email sending |
| isomorphic-dompurify | ^1.12.1 | XSS protection |
| express-rate-limit | ^8.3.2 | Rate limiting |
| axios | ^1.4.0 | HTTP client |
| uuid | ^13.0.0 | UUID generation |
| body-parser | ^1.20.2 | Body parsing |
| vitest | ^1.0.0 | Test framework |
| nodemon | ^3.0.1 | Auto-reload (dev) |

---

## 🔧 Scripts NPM

```bash
npm start               # Production mode
npm run dev             # Development mode (auto-reload)
npm test                # Run tests
npm run test:ui         # Tests with UI
npm run test:coverage   # Coverage report
```

---

## 💡 Bonnes Pratiques

1. **Validation toujours** - Valider tous les inputs
2. **Rate limiting** - Protéger contre les abus
3. **Logs structurés** - Faciliter le debugging
4. **Tests** - Couvrir les cas critiques
5. **Env secrets** - Ne jamais commit les .env

---

## 🆘 Troubleshooting

### L'email ne s'envoie pas
```bash
# 1. Vérifier .env (EMAIL_USER, EMAIL_PASS)
# 2. Vérifier que 2FA est activé (Gmail)
# 3. Vérifier App Password (pas le mot de passe Gmail)
# 4. Lancer en local et checker les logs
npm run dev
```

### Rate limit bloque les tests
```bash
# Temporairement désactiver dans validation.js
// app.use('/api/contact', rateLimiter);
```

### Port déjà utilisé
```bash
# Changer le port dans .env
PORT=3001
```

---

**Dernière mise à jour:** 22 avril 2026  
**Statut:** ✅ Production-Ready
