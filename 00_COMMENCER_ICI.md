# 🎬 PREMIÈRE UTILISATION - Portfolio

## ⚡ Quick Start (5 minutes)

### Windows:
```bash
# Ouvrir PowerShell ou CMD dans le dossier portfolio
cd c:\Users\nunod\IdeaProjects\Portfolio\portfolio

# Double-click sur start.bat
# OU exécuter:
.\start.bat
```

### Linux/Mac:
```bash
cd ~/IdeaProjects/Portfolio/portfolio
bash start.sh
```

### Avec Docker (Tous OS):
```bash
docker-compose up
```

---

## 📖 Guide Complet (30 minutes)

### 1. Configuration Initiale

```bash
# Créer le fichier .env
cp .env.example .env

# Éditer .env et remplir vos valeurs
# Pour les tests locaux, laisser les defaults
```

### 2. Installation des Dépendances

```bash
# Terminal principal
npm run install-all
```

Ça va installer:
- ✅ Dépendances backend (Express, CORS, dotenv, etc.)
- ✅ Dépendances frontend (juste package.json pour les scripts)

### 3. Démarrage

#### Option A: Deux Terminals Séparés (Recommandé pour le développement)

```bash
# Terminal 1 - Backend
cd backend
npm run dev
# ✅ Backend sur http://localhost:5000

# Terminal 2 - Frontend  
cd frontend
npm start
# ✅ Frontend sur http://localhost:3000
```

#### Option B: Un Seul Terminal

```bash
npm run dev
# Démarre les 2 services avec concurrently
```

#### Option C: Mode Détaché

```bash
npm install -g pm2
npm run backend &
npm run frontend &
# Exécute en arrière-plan
```

### 4. Vérification

Ouvrez votre navigateur:
- 📍 Frontend: http://localhost:3000
- 📍 Backend: http://localhost:5000/api/health

Vous devriez voir:
```json
{
  "status": "Backend is running ✅",
  "timestamp": "2024-04-07T10:00:00.000Z"
}
```

### 5. Tester les Fonctionnalités

**Services** (rechargement auto):
- Allez sur http://localhost:3000#services
- Vous verrez 4 services chargés depuis l'API

**Projets** (rechargement auto):
- Allez sur http://localhost:3000#projects
- Vous verrez 3 projets avec technos

**Contact**:
- Allez sur http://localhost:3000#contact
- Remplissez le formulaire
- Cliquez "Envoyer"
- Vous verrez un message de succès

---

## 🔧 Fichiers Importants à Connaître

### À Éditer Rapidement

| Fichier | Objectif |
|---------|----------|
| `frontend/index.html` | Structure HTML, texte principal |
| `frontend/src/assets/css/style.css` | Styles principal, couleurs |
| `backend/src/controllers/projectsController.js` | Vos projets |
| `backend/src/controllers/servicesController.js` | Vos services |
| `.env` | Configuration environnement |

### À Explorer

| Fichier | Contenu |
|---------|---------|
| `GUIDE_DEMARRAGE.md` | Guide détaillé complet |
| `PRODUCTION.md` | Déploiement OVH |
| `OVH_OPTIMISATION.md` | Performance |
| `CHECKLIST.md` | Toutes les tâches |

---

## ⚙️ Personnalisation Rapide

### 1. Modifier vos informations

**Frontend (index.html)**:
```html
<!-- Ligne 42 -->
<h1 class="hero-title">Votre Titre Ici</h1>
<p class="hero-subtitle">Votre Métier Ici</p>
```

**Formulaire de contact**:
```html
<!-- Ligne 150 -->
<span>votre.email@example.com</span>
<span>+33 X XX XX XX XX</span>
<span>Votre Pays</span>
```

### 2. Ajouter vos projets

**Backend (src/controllers/projectsController.js)**:
```javascript
// Ligne 5
const projects = [
  {
    id: 1,
    title: 'Votre Projet',
    description: 'Description...',
    // ...
  }
];
```

### 3. Changer les couleurs

**Frontend (src/assets/css/style.css)**:
```css
/* Ligne 9-10 */
--primary-color: #6366f1;      /* Votre couleur primaire */
--secondary-color: #ec4899;    /* Votre couleur secondaire */
```

### 4. Ajouter vos réseaux sociaux

**Frontend (index.html, ligne 148)**:
```html
<a href="https://github.com/votre_profil" target="_blank">
  <i class="fab fa-github"></i>
</a>
<a href="https://linkedin.com/in/votre_profil" target="_blank">
  <i class="fab fa-linkedin"></i>
</a>
```

---

## 🛠️ Commandes Utiles

```bash
# Gestion npm root
npm run dev           # Démarrer dev (2 services)
npm run backend       # Démarrer backend uniquement
npm run frontend      # Démarrer frontend uniquement
npm run install-all   # Installer dépendances
npm run docker-up     # Démarrer Docker
npm run docker-down   # Arrêter Docker

# Backend
cd backend
npm run dev           # Nodemon (auto-reload)
npm start             # Production

# Frontend
cd frontend
npm start             # Serveur HTTP simple
```

---

## ❓ Problèmes Courants

### "npm: command not found"
**Solution**: Installer Node.js depuis https://nodejs.org

### "Backend connection error"
**Solution**: 
1. Vérifier que Terminal 1 backend est en cours d'exécution
2. Vérifier que le port 5000 n'est pas occupé: `lsof -i :5000`

### "Port 5000 déjà utilisé"
**Solution**: Dans `.env` change `PORT=5001`

### "Formulaire de contact ne fonctionne pas"
**Solution**: 
1. Ouvrir la console du navigateur (F12)
2. Vérifier les erreurs
3. Vérifier que l'api.js envoie les données au bon endpoint

### Les styles ne chargent pas
**Solution**: 
1. Hard refresh: Ctrl+Shift+R (ou Cmd+Shift+R Mac)
2. Effacer le cache du navigateur

---

## 📚 Prochaines Étapes

### Immédiat

1. **Personnaliser les informations** (30 min)
   - Éditer vos projets, services, contact
   - Modifier les couleurs et texte

2. **Tester localement** (15 min)
   - Vérifier toutes les sections
   - Tester la responsivité (F12)
   - Tester le formulaire

3. **Ajouter des images** (30 min)
   - Ajouter vos projets screenshots
   - Modifier le favicon
   - Ajouter une photo de profil

### Court terme

4. **Configurer l'email** (15 min)
   - Activer 2FA sur Gmail
   - Générer App Password
   - Copier dans `.env`

5. **Initialiser Git** (5 min)
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Portfolio setup"
   git push origin main
   ```

6. **Préparer le déploiement OVH** (1h)
   - Lire `PRODUCTION.md`
   - Créer un compte OVH
   - Préparer le serveur

### Moyen terme

7. **Déployer en production** (1-2h)
   - Configurer le serveur OVH
   - Uploader le code
   - Configurer le domaine
   - Activer HTTPS

---

## 🎓 Ressources d'Apprentissage

- [Node.js Docs](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [CSS-Tricks](https://css-tricks.com/)
- [MDN Web Docs](https://developer.mozilla.org/)
- [OVH Support](https://www.ovh.com/fr/support/)

---

## 📞 Support Rapide

Si quelque chose ne fonctionne pas:

1. **Consulter les logs**:
   ```bash
   # Terminal backend
   npm run dev
   # Regarder les erreurs affichées
   ```

2. **Vérifier la console du navigateur**:
   - F12 → Onglet "Console"
   - Voir les erreurs JavaScript

3. **Vérifier le fichier .env**:
   - Assurez-vous qu'il existe
   - Vérifier les variables

4. **Relancer les services**:
   - Terminer les processus (Ctrl+C)
   - Les redémarrer

---

## ✅ Checklist Démarrage

- [ ] Node.js et npm installés
- [ ] Fichier .env créé depuis .env.example
- [ ] `npm run install-all` exécuté
- [ ] Backend démarre: `npm run backend`
- [ ] Frontend accessible: http://localhost:3000
- [ ] Services chargés correctement
- [ ] Formulaire de contact fonctionne
- [ ] Responsive design testé (F12)

---

## 🚀 Vous êtes Prêt!

Votre portfolio est maintenant prêt pour être personnalisé et déployé!

**Bon développement!** 💪

---

*Last updated: 7 avril 2026*
