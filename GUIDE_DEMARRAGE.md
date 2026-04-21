# 📚 Guide de Démarrage - Portfolio

## 🚀 Démarrage Rapide

### Prérequis
- **Node.js** v16+ (https://nodejs.org)
- **Git** (https://git-scm.com)
- **Python** 3+ (pour le serveur frontend simple)

### Option 1: Démarrage Local Classique

#### Terminal 1 - Backend
```bash
cd backend
npm install
npm run dev
```
✅ Backend accessible sur: http://localhost:5000

#### Terminal 2 - Frontend
```bash
cd frontend
python -m http.server 3000
```
✅ Frontend accessible sur: http://localhost:3000

---

### Option 2: Avec Docker

```bash
# Démarrer tous les services
docker-compose up

# Accès:
# - Frontend: http://localhost:3000
# - Backend: http://localhost:5000
```

---

## 📋 Configuration

### 1. Créer le fichier `.env`
```bash
cp .env.example .env
```

Éditer `.env` avec vos valeurs:
```
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
EMAIL_USER=votre_email@gmail.com
EMAIL_PASS=votre_mot_passe
EMAIL_TO=recipient@example.com
```

### 2. Configuration Email (Optional)

Pour le formulaire de contact par email:

**Gmail (Recommandé):**
1. Activer 2-Step Verification sur votre compte Google
2. Générer un "App Password" (https://myaccount.google.com/apppasswords)
3. Copier le mot de passe généré dans `EMAIL_PASS`

---

## 🏗️ Structure du Projet

```
portfolio/
├── backend/                 # API Express.js
│   ├── src/
│   │   ├── server.js       # Entrée principale
│   │   ├── routes/         # Routes API
│   │   ├── controllers/    # Logique métier
│   │   ├── models/         # Modèles (si DB)
│   │   └── middleware/     # Middlewares
│   ├── package.json
│   └── README.md
│
├── frontend/                # SPA Frontend
│   ├── index.html          # Page principale
│   ├── src/
│   │   └── assets/
│   │       ├── css/        # Styles (responsive)
│   │       ├── js/         # Scripts (app, api, nav)
│   │       └── images/     # Images/ressources
│   ├── package.json
│   └── README.md
│
├── .env.example            # Variables d'environnement
├── .gitignore              # Fichiers à ignorer
├── docker-compose.yml      # Configuration Docker
├── Dockerfile              # Image Docker
├── nginx.conf              # Configuration Nginx
├── deploy.sh               # Déploiement (Linux/Mac)
├── deploy.ps1              # Déploiement (Windows)
├── README.md               # Ce fichier
│
└── .github/
    └── workflows/
        └── deploy.yml      # CI/CD GitHub Actions
```

---

## 🎨 Sections du Portfolio

### Accueil (Hero Section)
- Titre principal avec dégradé
- Sous-titre et description
- Boutons CTA (Call To Action)

### À Propos
- Présentation personnelle
- Grille de compétences (Frontend, Backend, DB, DevOps)

### Services
- 4 services proposés
- Icônes et descriptions
- Features listées

### Projets
- Grille de projets responsive
- Cartes avec images, technologies, dates
- Liens vers les projets

### Contact
- Formulaire avec validation
- Informations de contact
- Liens sociaux (GitHub, LinkedIn, Twitter)

### Footer
- Copyright et info d'hébergement

---

## 📱 Responsive Design

Le portfolio est **100% responsive** sur:
- 📱 **Mobiles** (< 480px, 480-768px)
- 📱 **Tablets** (768px - 1024px)
- 💻 **Desktop** (1024px+)

Breakpoints définis dans `frontend/src/assets/css/responsive.css`

---

## 🔗 API Endpoints

### Services
```
GET  /api/services
```
Retourne la liste de tous les services

### Projets
```
GET  /api/projects
GET  /api/projects/:id
```
Retourne les projets avec détails

### Contact
```
POST /api/contact/submit
Body: { name, email, subject, message }
```
Soumet un formulaire de contact

### Health Check
```
GET  /api/health
```
Vérifie que le backend fonctionne

---

## 🌐 Déploiement sur OVH

### Étape 1: Préparer le serveur OVH
```bash
# SSH sur votre serveur
ssh utilisateur@votre_domaine.com

# Installer Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Étape 2: Uploader le code
```bash
# Depuis votre machine locale
# Option A: Git
git push origin main

# Option B: SFTP/SCP
scp -r . utilisateur@votre_serveur:/path/to/portfolio
```

### Étape 3: Installer et démarrer
```bash
cd /path/to/portfolio
npm install -g pm2

# Backend avec PM2
cd backend && npm install
pm2 start src/server.js --name "portfolio-backend"

# Frontend avec Nginx
sudo apt-get install nginx
sudo cp nginx.conf /etc/nginx/sites-available/default
sudo systemctl restart nginx
```

### Étape 4: Configurer le domaine
- Pointer votre domaine vers l'IP du serveur OVH
- Configurer Let's Encrypt pour HTTPS:
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d votre_domaine.com
```

---

## 🛠️ Commands Utiles

```bash
# Backend
npm run dev        # Mode développement with nodemon
npm start          # Mode production

# Frontend
npm start          # Serveur HTTP local

# Docker
docker-compose up           # Démarrer tous les services
docker-compose down         # Arrêter tous les services
docker-compose logs -f      # Voir les logs

# PM2 (Production)
pm2 start src/server.js --name "portfolio"
pm2 list
pm2 logs
pm2 restart portfolio
pm2 stop portfolio
```

---

## ❓ Troubleshooting

### Backend ne démarre pas
```bash
# Vérifier le port
lsof -i :5000  # Linux/Mac
netstat -ano | findstr :5000  # Windows

# Port ocuppé? Changer dans .env
PORT=5001
```

### Connexion refusée au backend
```bash
# Vérifier que le backend est démarré
# Vérifier l'URL dans frontend/src/assets/js/api.js
# Vérifier CORS dans backend/src/server.js
```

### Formulaire de contact ne fonctionne pas
```bash
# Vérifier les variables email dans .env
# Vérifier que le backend reçoit les requêtes (logs)
# Gmail: vérifier que l'App Password est correct
```

---

## 📞 Support

Pour toute question ou problème:
- 📧 Email: votre.email@example.com
- 🐙 GitHub: https://github.com/votre_pseudo/portfolio
- 💼 LinkedIn: https://linkedin.com/in/votre_profil

---

## 📄 Licence

MIT - Libre d'utilisation et de modification

---

## ⭐ Prochaines Étapes

- [ ] Ajouter une base de données (MongoDB/PostgreSQL)
- [ ] Implémenter authentification admin
- [ ] Ajouter un CMS pour gérer le contenu
- [ ] Implémenter la recherche de projets
- [ ] Ajouter des tests unitaires
- [ ] Optimiser les performances (cache, compression)
- [ ] Configurer les analytics (Google Analytics)
- [ ] Ajouter un blog section

---

💡 **Bon développement!** 🚀
