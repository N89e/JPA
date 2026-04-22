# 🎨 Frontend SPA - Portfolio

Application Single Page (SPA) développée avec **HTML5**, **CSS3** et **JavaScript Vanilla** (zéro dépendances).

---

## 🎯 Caractéristiques

✅ **Architecture Moderne**
- Single Page Application (SPA)
- Chargement dynamique des sections
- Navigation fluide sans rechargement page
- Responsive design Mobile-First

✅ **Accessibilité & Conformité**
- WCAG 2.1 Level A+ ✨
- W3C HTML5 valide ✅
- Schema.org JSON-LD pour SEO
- Open Graph pour réseaux sociaux

✅ **Perfomance**
- Zero external JavaScript dependencies
- CSS natif (Grid, Flexbox, Animations)
- Lazy loading des images
- Optimisation SEO complète

✅ **Formulaires**
- Validation front-end robuste
- Rate limiting backend (5 req/15min)
- Gestion des erreurs
- Messages de succès/erreur

---

## 📋 Structure

```
frontend/
├── index.html                                    # Page principale
├── src/
│   ├── assets/
│   │   ├── css/
│   │   │   ├── style.css                       # Styles principaux
│   │   │   ├── responsive.css                  # Responsive design
│   │   │   └── spinner.css                     # Loading spinner
│   │   ├── js/
│   │   │   ├── app.js                          # App principale
│   │   │   ├── sectionLoader.js                # Chargeur sections
│   │   │   ├── spinner.js                      # Spinner manager
│   │   │   ├── api/
│   │   │   │   ├── api.js                      # Client API
│   │   │   │   ├── contact.js                  # Contact API
│   │   │   │   ├── projects.js                 # Projects API
│   │   │   │   └── services.js                 # Services API
│   │   │   ├── carousel/
│   │   │   │   ├── carousel.js                 # Carousel principal
│   │   │   │   └── languageCarousel.js         # Carousel langages
│   │   │   ├── navbar/
│   │   │   │   └── navbar.js                   # Menu burger mobile
│   │   │   └── [...autres modules]
│   │   └── images/
│   │       ├── Logo_Portfolio/
│   │       ├── Logo_Signature_Nuno/
│   │       ├── Icons_methodes/
│   │       ├── Icons_Langages/
│   │       ├── icons_services/
│   │       └── [autres images]
│   ├── config/
│   │   └── sectionsConfig.js                   # Config sections
│   └── pages/
│       ├── home/
│       │   └── home.html                       # Section accueil
│       ├── aboutMe/
│       │   └── aboutMe.html                    # Section à propos
│       ├── myServices/
│       │   └── myServices.html                 # Section services
│       ├── myProjects/
│       │   └── myProjects.html                 # Section projets
│       ├── contact/
│       │   └── contact.html                    # Section contact
│       └── footer/
│           └── footer.html                     # Footer
├── package.json
├── ARCHITECTURE.md                             # Architecture détaillée
├── SECTIONS_CONFIG_GUIDE.md                    # Guide config sections
├── TEST_GUIDE.md                               # Guide tests
└── README.md
```

---

## 🚀 Installation & Démarrage

### Option 1: Live Server (VS Code) - ⭐ Recommandé
```bash
# 1. Installer extension: "Live Server"
# 2. Clic droit sur index.html
# 3. "Open with Live Server"
# Accède à http://localhost:5500/frontend/
```

### Option 2: Python SimpleHTTPServer
```bash
cd frontend
python -m http.server 3000
# Accède à http://localhost:3000
```

### Option 3: Node.js Serve
```bash
npm install -g serve
serve -s frontend -l 3000
# Accède à http://localhost:3000
```

### Option 4: npm start
```bash
cd frontend
npm start
# Ouvre le navigateur automatiquement
```

---

## 🔗 Configuration API

### Automatique
L'app détecte automatiquement l'environnement:
- **Local:** `http://localhost:5000/api`
- **Production:** `https://www.nunoesteves.com/api`

### Manuel (si requis)
Éditer `src/assets/js/app.js`:
```javascript
// Changer BASE_API_URL
const BASE_API_URL = 'http://votre-api-url/api';
```

---

## 📱 Sections & Pages

### 1. **Accueil** (`pages/home/`)
- Présentation héro
- Call-to-action
- Navigation vers autres sections

### 2. **À Propos** (`pages/aboutMe/`)
- Présentation personnelle
- Expérience professionelle
- Compétences & méthodes (icons)
- Outils utilisés (Jira, Trello, etc.)

### 3. **Services** (`pages/myServices/`)
- Grille de services
- Descriptions détaillées
- Icônes représatives

### 4. **Projets** (`pages/myProjects/`)
- Galerie de projets
- Descriptions & technologies
- Liens vers repositoires
- Cartes responsive

### 5. **Contact** (`pages/contact/`)
- Formulaire avec validation
- Champs: Nom, Email, Sujet, Message
- Gestion des erreurs/succès
- Rate limiting (serveur)

### 6. **Footer** (`pages/footer/`)
- Liens sociaux (GitHub, LinkedIn)
- Email & téléphone
- Copyright

---

## 🎨 Design & Responsive

### Breakpoints
| Device | Width | CSS |
|--------|-------|-----|
| Mobile | < 768px | `mobile-first` |
| Tablet | 768px - 1199px | `tablet breakpoints` |
| Desktop | 1200px+ | `full layout` |

### Thème Couleurs
```css
--primary-color: #4e78ff          /* Bleu primaire */
--secondary-color: #70b9f9        /* Bleu secondaire */
--dark-bg: #0f172a                /* Fond sombre */
--light-bg: #f8fafc               /* Fond clair */
--text-dark: #1e293b              /* Texte sombre */
--text-light: #ffffff             /* Texte clair */
--success-color: #10b981          /* Succès (vert) */
--error-color: #ef4444            /* Erreur (rouge) */
```

### Polices
- **Titres:** Pattaya (Google Fonts)
- **Textes:** System font stack (-apple-system, Segoe UI, etc.)

---

## 🧪 Formulaire de Contact

### Validation Côté Client
```javascript
// Validations en temps réel
- name: Lettres uniquement, 3-100 chars
- email: Format email valide
- subject: Lettres + chiffres, 5-200 chars
- message: Libre, 10-5000 chars
```

### Envoi du Formulaire
```javascript
// POST vers /api/contact
fetch('http://localhost:5000/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, email, subject, message })
})
```

### Réponses
```javascript
// Succès (200)
{ success: true, message: "Message envoyé avec succès" }

// Erreur validation (400)
{ success: false, message: "Erreur de validation..." }

// Rate limit (429)
{ success: false, message: "Trop de requêtes. Réessayez plus tard." }
```

---

## ♿ Accessibilité (WCAG 2.1)

✅ **Conformité A+:**
- Hiérarchie des headings correcte (H1 → H2 → H3)
- ARIA labels sur tous les éléments interactifs
- Skip link pour clavier navigation
- Focus visible sur tous les éléments
- Alt texts descriptifs sur les images
- Formulaire avec aria-describedby
- Contraste minimum 4.5:1 (WCAG AA)

✅ **Clavier Navigation:**
- Tab/Shift+Tab - Naviguer
- Enter - Activer lien/bouton
- Espace - Cocher checkbox
- Escape - Fermer menu

---

## 🔍 SEO & Meta Tags

### Meta Tags
- `meta description` - Optimisée pour Google
- `canonical URL` - Évite la duplication
- `og:image`, `og:title`, `og:description` - Open Graph
- `twitter:card`, `twitter:image` - Twitter Card

### Structured Data
- Schema.org `Person` (JSON-LD)
- Rich snippets pour Google

### Sitemap & Robots
- `robots.txt` - Configuration crawlers
- `sitemap.xml` - Liste des pages pour Google

---

## 🚀 Performance Tips

1. **Images**: Optimiser avec TinyPNG/ImageOptim
2. **CSS**: Minimiser en prod (done)
3. **JavaScript**: Pas de dépendances externes
4. **Lazy Loading**: Images chargées à la demande
5. **Caching**: Navigateur cache les assets

---

## 📚 Guides Additionnels

| Document | Description |
|----------|-------------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Architecture détaillée de l'app |
| [SECTIONS_CONFIG_GUIDE.md](./SECTIONS_CONFIG_GUIDE.md) | Configurer les sections |
| [TEST_GUIDE.md](./TEST_GUIDE.md) | Guide de test manuel |

---

## 🔧 Scripts NPM

```bash
npm start                    # Démarre l'app (si configuré)
npm test                     # Tests (si configurés)
```

---

## 📦 Déploiement

### Statique (Simple)
```bash
# 1. Uploader le contenu du dossier 'frontend' via FTP
# 2. Configurer le serveur web pour servir index.html
```

### Avec Nginx (Production)
```bash
# Configuration incluse: nginx.conf et nginx.conf.prod
# Géré par docker-compose.prod.yml
```

### Via Docker
```bash
docker-compose up
# Frontend sur http://localhost:3000 (dev)
# Sur production.com (prod)
```

---

## 🆘 Troubleshooting

### L'API ne répond pas
```bash
# 1. Vérifier que le backend fonctionne:
npm run backend
# 2. Vérifier l'URL API dans app.js
# 3. Vérifier CORS dans le backend
```

### Formulaire ne s'envoie pas
```bash
# 1. Vérifier les logs navigateur (F12 → Console)
# 2. Vérifier que /api/contact est accessible
# 3. Vérifier les variables .env (EMAIL_USER, EMAIL_PASS)
```

### Styles CSS cassés
```bash
# 1. Vérifier le chemin des fichiers CSS dans index.html
# 2. Vérifier les permissions de fichier
# 3. Forcer le refresh (Ctrl+Shift+R)
```

---

## 💡 Bonnes Pratiques

1. **Pas de dépendances externes** - Maintenabilité max
2. **Responsive first** - Mobile-first design
3. **Accessibilité** - WCAG 2.1 min
4. **SEO** - Schema, meta tags, sitemaps
5. **Performance** - Images optimisées, CSS/JS minifiés

---

## 📊 Audit Final

**Conformité actuelle:**
- ✅ W3C HTML5: 92/100
- ✅ SEO: 90/100
- ✅ Accessibilité: 92/100
- **Score Global:** 91/100 ⭐⭐⭐⭐

Voir [../AUDIT_W3C_SEO_ACCESSIBILITY.md](../AUDIT_W3C_SEO_ACCESSIBILITY.md)

---

**Dernière mise à jour:** 22 avril 2026  
**Statut:** ✅ Production-Ready
