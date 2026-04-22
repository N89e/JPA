# 🎯 Portfolio Personnel - Nuno ESTEVES

**Chef de Projet IT** | Full Stack Developer | 6 ans d'expérience en gestion de projets

Portfolio moderne, responsive et accessible développé avec **Node.js**, **Express** et **Vanilla JavaScript**.

[![W3C Valid HTML5](https://img.shields.io/badge/HTML5-Valid-blue)](https://validator.w3.org/)
[![WCAG 2.1 Level A+](https://img.shields.io/badge/WCAG%202.1-Level%20A%2B-green)](https://www.w3.org/WAI/WCAG21/)
[![SEO Optimized](https://img.shields.io/badge/SEO-Optimized-brightgreen)](https://www.nunoesteves.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🌟 Caractéristiques Principales

✅ **Full Stack Moderne**
- Backend: Node.js + Express.js (API REST)
- Frontend: HTML5/CSS3/JavaScript Vanilla (SPA)
- Responsive Design (Mobile, Tablet, Desktop)
- Optimisation SEO complète

✅ **Accessibilité & Standards**
- WCAG 2.1 Level A+ conformité
- W3C HTML5 valide
- Schema.org JSON-LD pour rich snippets
- Open Graph pour réseaux sociaux

✅ **Infrastructure Production**
- Docker & Docker Compose
- Nginx reverse proxy
- Let's Encrypt SSL/TLS
- PM2 process manager
- Rate limiting & validation

✅ **Tests & Qualité**
- Vitest pour les tests unitaires
- Coverage reports
- Validation des inputs XSS
- Rate limiting sur les API

---

## 📋 Structure du Projet

```
portfolio/
├── 📚 Documentation
│   ├── README.md                          # Ce fichier
│   ├── 00_COMMENCER_ICI.md               # Guide de démarrage rapide
│   ├── AUDIT_W3C_SEO_ACCESSIBILITY.md    # Audit complet (W3C/SEO/WCAG)
│   ├── PRODUCTION.md                      # Guide de déploiement
│   ├── CONTRIBUTING.md                    # Guides de contribution
│   └── [autres guides...](./docs/)
│
├── 🔧 Backend (API Express)
│   ├── src/
│   │   ├── server.js                     # Point d'entrée serveur
│   │   ├── server-prod.js               # Configuration production
│   │   ├── routes/                       # Routes API (contact, projects, services)
│   │   ├── controllers/                  # Logique métier
│   │   ├── middleware/                   # Rate limiting, validation, CORS
│   │   ├── services/                     # Services (email, etc.)
│   │   ├── config/                       # Configuration
│   │   └── utils/                        # Utilitaires (logger, etc.)
│   ├── tests/                            # Tests unitaires (Vitest)
│   ├── package.json                      # Dépendances
│   └── README.md                         # Documentation backend
│
├── 🎨 Frontend (SPA)
│   ├── src/
│   │   ├── index.html                    # Page principale
│   │   ├── assets/
│   │   │   ├── css/                      # Styles (style.css, responsive.css)
│   │   │   ├── js/                       # Scripts (app.js, sectionLoader.js)
│   │   │   └── images/                   # Images et ressources
│   │   └── pages/                        # Sections HTML chargées dynamiquement
│   │       ├── home/
│   │       ├── aboutMe/
│   │       ├── myServices/
│   │       ├── myProjects/
│   │       ├── contact/
│   │       └── footer/
│   ├── package.json                      # Scripts npm
│   └── README.md                         # Documentation frontend
│
├── 🐳 Infrastructure
│   ├── Dockerfile                        # Image Docker dev
│   ├── Dockerfile.prod                   # Image Docker production
│   ├── docker-compose.yml                # Compose dev
│   ├── docker-compose.prod.yml           # Compose production
│   ├── nginx.conf                        # Config Nginx dev
│   ├── nginx.conf.prod                   # Config Nginx prod
│   ├── .env.example                      # Variables d'env template
│   └── .env.example.production           # Variables d'env production
│
├── 📦 Scripts de Déploiement
│   ├── deploy.sh / deploy.ps1            # Déploiement dev
│   ├── deploy-prod.sh / deploy-prod.ps1  # Déploiement production
│   ├── verify-deployment.sh              # Vérification post-déploiement
│   ├── check-install.sh                  # Vérification installation
│   └── install-hooks.sh                  # Installation git hooks
│
└── 📁 Public
    ├── robots.txt                        # Configuration pour crawlers
    └── sitemap.xml                       # Sitemap pour SEO
```

---

## 🚀 Quick Start

### Option 1: Windows (Recommandé)
```bash
# Double-click sur:
start.bat

# Ou via PowerShell:
.\start.bat
```

### Option 2: Linux/Mac
```bash
bash start.sh
```

### Option 3: Docker (Tous OS)
```bash
docker-compose up
```

### Option 4: Mode Développement (Terminal séparé)
```bash
# Terminal 1 - Backend (API)
cd backend
npm install
npm run dev      # Démarre sur http://localhost:5000

# Terminal 2 - Frontend (SPA)
cd frontend
npm start        # Ouvre http://localhost:3000
# OU accédez directement à frontend/index.html
```

---

## 🔧 Installation Complète

```bash
# 1. Clone du repository
git clone https://github.com/N89e/portfolio.git
cd portfolio

# 2. Installation des dépendances (backend + frontend)
npm run install-all

# 3. Configuration (optionnel - seulement si emails requis)
cp .env.example .env
# Éditer .env avec vos paramètres
```

---

## 📱 Sections du Portfolio

| Section | Description |
|---------|-------------|
| **Accueil** | Présentation héro avec accroche |
| **À Propos** | Expérience, compétences, méthodes |
| **Services** | Services offerts (pilotage, digitalisation, etc.) |
| **Projets** | Portfolio de réalisations |
| **Contact** | Formulaire avec validation & rate limiting |
| **Footer** | Liens sociaux (GitHub, LinkedIn, email, phone) |

---

## 🎨 Design & Responsive

- **Desktop:** 1200px+ (layout complet)
- **Tablet:** 768px - 1199px (layout adapté)
- **Mobile:** < 768px (layout mobile)

✨ **Thème:** Design moderne avec palette:
- Couleur primaire: `#4e78ff` (Bleu)
- Couleur secondaire: `#70b9f9` (Bleu clair)
- Fond clair: `#f8fafc`
- Texte sombre: `#1e293b`

---

## 🧪 Tests

```bash
# Tests unitaires (Vitest)
cd backend
npm test                # Lancer les tests
npm run test:ui         # UI interactive
npm run test:coverage   # Rapport de couverture

# Sécurité XSS
npm run test:xss        # Tests de sécurité
```

---

## 📊 Audit & Qualité

**Conformité actuelle (22 avril 2026):**
- ✅ **W3C HTML5:** 92/100
- ✅ **SEO:** 90/100
- ✅ **Accessibilité WCAG 2.1:** 92/100
- **Score Global:** 91/100 ⭐⭐⭐⭐

Voir [AUDIT_W3C_SEO_ACCESSIBILITY.md](./AUDIT_W3C_SEO_ACCESSIBILITY.md) pour détails complets.

---

## 🌐 Variables d'Environnement

### Backend (.env)
```env
# Serveur
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Email (optionnel)
EMAIL_USER=notification@example.com
EMAIL_PASS=app_password
EMAIL_TO=contact@example.com

# Production
JWT_SECRET=votre_secret
API_KEY=votre_api_key
```

### Frontend (Automatique)
```javascript
// src/assets/js/app.js configure automatiquement:
API_URL = http://localhost:5000/api  // ou /api en production
```

---

## 🚀 Déploiement

### Développement
```bash
npm run docker-up      # Démarre dev avec docker-compose.yml
npm run docker-down    # Arrête les services
```

### Production (OVH)
```bash
# Voir PRODUCTION.md pour instructions complètes
bash deploy-prod.sh    # Ou deploy-prod.ps1 sur Windows

# Ou utiliser:
docker-compose -f docker-compose.prod.yml up -d
```

**Hosting Configuration:**
- Serveur Node.js sur port 5000
- Nginx reverse proxy avec SSL
- Let's Encrypt pour HTTPS
- PM2 pour la gestion des processus

Voir [PRODUCTION.md](./PRODUCTION.md) pour guide détaillé.

---

## 📚 Documentation Complète

| Document | Description |
|----------|-------------|
| [00_COMMENCER_ICI.md](./00_COMMENCER_ICI.md) | Guide de démarrage rapide |
| [AUDIT_W3C_SEO_ACCESSIBILITY.md](./AUDIT_W3C_SEO_ACCESSIBILITY.md) | Audit complet (W3C/SEO/WCAG) |
| [PRODUCTION.md](./PRODUCTION.md) | Guide de déploiement production |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Guide de contribution |
| [backend/README.md](./backend/README.md) | Documentation backend |
| [frontend/README.md](./frontend/README.md) | Documentation frontend |
| [GITHUB_SECRETS.md](./GITHUB_SECRETS.md) | Configuration GitHub secrets |
| [GUIDE_AJOUTER_PROJETS.md](./GUIDE_AJOUTER_PROJETS.md) | Ajouter des projets |
| [OVH_COMMANDES_RAPIDES.md](./OVH_COMMANDES_RAPIDES.md) | Commandes OVH utiles |

---

## 🔒 Sécurité

✅ **Mesures implémentées:**
- Rate limiting sur tous les endpoints
- Validation & sanitisation des inputs (XSS protection)
- CORS configuré
- Helmet.js pour headers de sécurité
- DOMPurify pour sanitisation HTML
- Validation email & pattern

Voir [XSS_SECURITY_TEST.md](./XSS_SECURITY_TEST.md) pour tests de sécurité.

---

## 🛠️ Stack Technique

### Backend
- **Runtime:** Node.js v16+
- **Framework:** Express.js 4.18+
- **Validation:** Custom middleware + patterns
- **Email:** Nodemailer
- **Testing:** Vitest + Coverage
- **Rate Limiting:** express-rate-limit
- **Security:** DOMPurify, isomorphic-dompurify

### Frontend
- **HTML5** - Sémantique & accessibilité
- **CSS3** - Grid, Flexbox, Animations
- **JavaScript Vanilla** - No dependencies
- **Mobile First** - Responsive design
- **Accessibility** - WCAG 2.1 Level A+


### Infrastructure
- **Docker & Docker Compose** - Containerisation
- **Nginx** - Reverse proxy & Static serving
- **PM2** - Process management
- **SSL/TLS** - Let's Encrypt
- **systemd** - Service persistence

---

## 📞 Support & Contact

- **LinkedIn:** [Profil](https://www.linkedin.com/in/nuno-esteves-b89792246/)
- **GitHub:** [Repositories](https://github.com/N89e)

---

## 📄 Licence

Ce projet est sous licence **MIT**. Voir [LICENSE](./LICENSE) pour détails.

---

## 🎉 Contribuer

Les contributions sont bienvenues ! Voir [CONTRIBUTING.md](./CONTRIBUTING.md) pour guidelines.

---

**Dernière mise à jour:** 22 avril 2026  
**Version:** 1.0.0  
**Statut:** ✅ Production-Ready
